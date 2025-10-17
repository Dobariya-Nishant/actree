import { env } from "@/config/env";
import { Error } from "mongoose";

export async function networkRequest(
  method: string = "GET",
  url: string,
  body: any = null,
  headers = {},
  queryParams: Record<string, any> = {},
  urlParams: Record<string, string> = {}
) {
  const options: any = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (urlParams && Object.keys(urlParams).length > 0) {
    Object.keys(urlParams).forEach((key) => {
      url = url.replace(`:${key}`, encodeURIComponent(urlParams[key]));
    });
  }

  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(queryParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  if (body && method !== "GET" && method !== "HEAD") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    return response.json().then((err) => {
      console.log("response -> err", err);
      console.log(
        `Error ${response.status}: ${err.message || "Unknown error"}`
      );
      throw new Error(
        `Error ${response.status}: ${err.message || "Unknown error"}`
      );
    });
  }

  const data = await response.json();

  return data?.data ?? data;
}
