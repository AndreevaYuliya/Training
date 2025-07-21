import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  User,
} from "firebase/auth";
// import { getFirebaseAuth } from "@/src/firebase/config";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "75389310735-17jqmrd1elehsmbo4oc6463vqmtsjnje.apps.googleusercontent.com",
  });

  // useEffect(() => {
  //   const auth = getFirebaseAuth();
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     setUser(firebaseUser);
  //     setLoading(false);

  //     // ✅ persist login token manually if needed
  //     if (firebaseUser) {
  //       await SecureStore.setItemAsync("userEmail", firebaseUser.email || "");
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   const auth = getFirebaseAuth();
  //   if (response?.type === "success") {
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);

  //     signInWithCredential(auth, credential).catch((error) => {
  //       console.error("Firebase sign-in failed:", error);
  //     });
  //   }
  // }, [response]);

  return { user, loading, promptAsync, request };
}
