export enum PaymentMethodType {
  // Credit and Debit Cards
  Card = "card", // Traditional credit/debit card

  // Digital Wallets
  GooglePay = "google_pay", // Google Pay
  ApplePay = "apple_pay", // Apple Pay
  MicrosoftPay = "microsoft_pay", // Microsoft Pay
  SamsungPay = "samsung_pay", // Samsung Pay
  WeChatPay = "wechat_pay", // WeChat Pay

  // Bank Payments
  ACH = "ach", // ACH (Automated Clearing House) - US-based bank transfers
  SEPA = "sepa", // SEPA Direct Debit - European Union
  BacsDirectDebit = "bacs_debit", // Bacs Direct Debit - UK-based bank transfers
  BECSDirectDebit = "becs_debit", // BECS Direct Debit - Australia
  FPX = "fpx", // FPX (Financial Process Exchange) - Malaysia

  // Buy Now Pay Later (BNPL)
  Affirm = "affirm", // Affirm (US-based BNPL)
  Klarna = "klarna", // Klarna (BNPL in Europe and US)
  AfterpayClearpay = "afterpay_clearpay", // Afterpay (Australia, UK, US)

  // Local Payment Methods
  Alipay = "alipay", // Alipay (China)
  GrabPay = "grabpay", // GrabPay (Southeast Asia)
  OXXO = "oxxo", // OXXO (Mexico)
  EPS = "eps", // EPS (Austria)
  Multibanco = "multibanco", // Multibanco (Portugal)
  P24 = "p24", // P24 (Poland)

  // Other Stripe-supported methods
  Ideal = "ideal", // iDEAL (Netherlands)
  Bancontact = "bancontact", // Bancontact (Belgium)
  Sofort = "sofort", // Sofort (Germany, Austria)
  Giropay = "giropay", // Giropay (Germany)
  Boleto = "boleto", // Boleto Bancário (Brazil)
  PayNow = "paynow", // PayNow (Singapore)

  // For Testing purposes (can be used in development environments)
  UsBankAccount = "us_bank_account", // US bank account for ACH payments (testing)
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum ChartTypeEnum {
  SALES = "sales-analitics",
  PRODUCT = "product-analitics",
  ORDER = "order-analitics",
  REVENUE = "revenue-analitics",
}
