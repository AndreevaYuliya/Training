// src/services/authService.ts
import * as WebBrowser from "expo-web-browser";

export const resetPassword = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const baseUrl = "https://brave-slug-38.clerk.accounts.dev"; // ← replace this
  const url = `${baseUrl}/sign-in?strategy=password-reset&identifier=${encodeURIComponent(
    email
  )}`;

  await WebBrowser.openBrowserAsync(url);
};
