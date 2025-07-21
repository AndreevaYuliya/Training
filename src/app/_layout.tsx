import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { router, Slot, usePathname } from "expo-router";
import { useEffect } from "react";

import { ActivityIndicator, Text, View } from "react-native";

import { tokenCache } from "@clerk/clerk-expo/token-cache";

import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <AuthGate>
        <Slot />
      </AuthGate>
    </ClerkProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && pathname !== "/auth") {
      console.log(isSignedIn, pathname);
      console.log("Redirecting to /auth");
      router.replace("/auth");
    }
  }, [isLoaded, isSignedIn, pathname]);

  console.log(isSignedIn, pathname);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
