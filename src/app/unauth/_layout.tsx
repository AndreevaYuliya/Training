import { router, Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function Layout() {
  const { isLoaded, isSignedIn } = useAuth();

  // console.log("unauth", isSignedIn);
  // console.log("unauth", isSignedIn);
  // console.log("unauth", isSignedIn);

  // if (isSignedIn) {
  //   return router.replace("/auth/Profile");
  // }

  console.log("AuthLayout rendered", { isLoaded, isSignedIn });

  // useEffect(() => {
  //   if (isSignedIn) {
  //     console.log("unauth", isSignedIn);
  //     console.log("unauth", isSignedIn);
  //     console.log("unauth", isSignedIn);
  //     router.replace("/auth/Profile");
  //   }
  // }, [isLoaded, isSignedIn, router]);

  // Пользователь залогинен — рендерим навигацию дальше
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="SignIn" />
      <Stack.Screen name="SignUp" /> */}
    </Stack>
  );
}
