import { env } from "@/config/env";
import { InternalServerError } from "@/domain/errors/app-errors";
import { networkRequest } from "@/domain/helpers/networkRequest";

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens(code: string) {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_REDIRECT_URL,
    grant_type: "authorization_code",
  };

  const res = await networkRequest("POST", url, values);

  return res;
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleUser(
  id_token: string,
  access_token: string
): Promise<GoogleUserResult> {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (error: any) {
    console.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}

export async function getGoogleProfile(code: string) {
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens(code);
    const user = await getGoogleUser(id_token, access_token);
    return user;
  } catch (error) {
    throw new InternalServerError(`Oauth Error:-> ${error}`);
  }
}
