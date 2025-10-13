import { injectable } from "tsyringe";
import { stripe } from "@/infrastructure/payment-processor/stripe/client";
import { env } from "@/config/env";
import { Product } from "@/domain/entities/product.entity";
import { InternalServerError, NotFoundError } from "@/domain/errors/app-errors";
import Stripe from "stripe";

export type AccountStatus = {
  isActive: boolean;
  requiresInformation: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
};

export type StripeCheckoutMetaData = {
  productId: string;
  buyerId: string;
  sellerId: string;
  accountId: string;
  tipAmount: number;
  stripeFee: number;
  platformFeeAmount: number;
  priceAmount: number;
  taxAmount: number;
  paymentMethod?: string;
  totalAmount: number;
};

@injectable()
export class StripePaymentProcessor {
  async getAccountStatus(accountId: string): Promise<AccountStatus> {
    if (!accountId) {
      throw new NotFoundError("stripe account not exist please connect!!");
    }

    try {
      const account = await stripe.accounts.retrieve(accountId);

      return {
        isActive:
          account.details_submitted &&
          !account.requirements?.currently_due?.length,
        requiresInformation: !!(
          account.requirements?.currently_due?.length ||
          account.requirements?.eventually_due?.length ||
          account.requirements?.past_due?.length
        ),
        requirements: {
          currently_due: account.requirements?.currently_due || [],
          eventually_due: account.requirements?.eventually_due || [],
          past_due: account.requirements?.past_due || [],
        },
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
      };
    } catch (error) {
      console.error("Error fetching Stripe Connect account status:", error);
      throw new Error("Failed to fetch Stripe Connect account status");
    }
  }

  async getLoginLink(accountId: string) {
    if (!accountId) {
      throw new Error("No Stripe Account Id Provided");
    }

    try {
      const loginLink = await stripe.accounts.createLoginLink(accountId);
      return loginLink.url;
    } catch (error) {
      console.error("Error Creating Stripe Connect Login Link:", error);
      throw new Error("Failed to create Stripe Connect login link");
    }
  }

  async create(email: string): Promise<string> {
    const account = await stripe.accounts.create({
      type: "express",
      email: email,
      capabilities: {
        card_payments: { requested: true },
        bank_transfer_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return account.id;
  }

  async createAccountLink(accountId: string): Promise<string> {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${env.CLIENT_URL}/SellerStripeConnect`,
      return_url: `${env.CLIENT_URL}/SellerStripeConnect`,
      type: "account_onboarding",
    });

    return accountLink.url;
  }

  async checkOut({
    product,
    buyerId,
    sellerId,
    accountId,
    tipAmount = "0",
  }: {
    product: Product;
    buyerId: string;
    sellerId: string;
    accountId: string;
    tipAmount?: string;
  }): Promise<{ sessionId: string; sessionUrl: string | null }> {
    if (!product || !product._id) {
      throw new Error("Invalid product data");
    }

    const productPrice = Number(product.price);
    const tip = Number(tipAmount) || 0;
    const tax = productPrice * 0.04;

    const productCut = productPrice * 0.25;
    const tipCut = tip * 0.1;
    let totalProductPrice = productPrice + tip;
    const stripeAmmount = totalProductPrice * 0.029;
    const stripeFee = Number((stripeAmmount + 0.3).toFixed(2));
    const platformFee = productCut + tipCut;

    const productPriceCents = Math.round(productPrice * 100);
    const tipCents = Math.round(tip * 100);
    const platformFeeCents = Math.round(platformFee * 100);

    const metadata: StripeCheckoutMetaData = {
      productId: product._id.toString(),
      buyerId: buyerId.toString(),
      sellerId: sellerId.toString(),
      accountId: accountId.toString(),
      tipAmount: tip,
      platformFeeAmount: platformFee,
      totalAmount: totalProductPrice,
      priceAmount: productPrice,
      stripeFee: stripeFee,
      taxAmount: tax,
    };

    const lineItems = [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: productPriceCents,
        },
        quantity: 1,
      },
      ...(tipCents > 0
        ? [
            {
              price_data: {
                currency: "USD",
                product_data: {
                  name: "Tip",
                  description: `Tip for ${product.name}`,
                },
                unit_amount: tipCents,
              },
              quantity: 1,
            },
          ]
        : []),
    ];

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: lineItems,
        payment_intent_data: {
          application_fee_amount: platformFeeCents,
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        mode: "payment",
        success_url: `${env.CLIENT_URL}/product_detail/${product._id}`,
        cancel_url: `${env.CLIENT_URL}/product_detail/${product._id}`,
        metadata,
      },
      { stripeAccount: accountId }
    );

    return { sessionId: session.id, sessionUrl: session.url };
  }

  async isPaymentSuccess(body: any, signature: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        "whsec_baad357fd7eadb29143b08a48c53a0564c4d94a5c9870391f3eceb7b93f59a6d"
      );
    } catch (err) {
      console.error("Webhook construction failed:", err);
      throw new InternalServerError(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      //@ts-ignore
      const metadata = session?.metadata as StripeCheckoutMetaData;

      return { isPaymentSuccess: true, metadata };
    }

    // if (event.type === "payment_intent.succeeded") {
    //   const session = event.data.object;
    //   //@ts-ignore
    //   const metadata = session?.metadata as StripeCheckoutMetaData;
    //   metadata.paymentMethod = session.payment_method?.toString() || "card";

    //   return { isPaymentSuccess: true, metadata };
    // }

    return { isPaymentSuccess: false };
  }
}
