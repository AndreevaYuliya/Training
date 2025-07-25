import BaseTextInput from "@/src/components/BaseTextInput";
import BaseButton from "@/src/components/buttons/BaseButton";
import Header from "@/src/components/Header";
import COLORS from "@/src/constants/colors";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useState, useEffect, FC } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ForgotPasswordPage: FC = () => {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/auth");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  const create = async () => {
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  const reset = async () => {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Header backButton title="Reset Password" headerStyles={styles.header} />
      <View style={styles.formContainer}>
        {!successfulCreation && (
          <View>
            <BaseTextInput
              label="Provide your email address"
              placeholder="email"
              value={email}
              onChangeText={(prevEmail) => setEmail(prevEmail.toLowerCase())}
            />

            <BaseButton
              disabled={!email}
              title="Send password reset code"
              onPress={create}
            />

            {error && <Text style={styles.textError}>{error}</Text>}
          </View>
        )}

        {successfulCreation && (
          <View>
            <BaseTextInput
              label="Enter the code sent to your email"
              placeholder="code"
              value={code}
              labelStyles={error && styles.textError}
              inputStyles={error && styles.inpuptError}
              onChangeText={setCode}
            />

            <BaseTextInput
              label="Enter your new password"
              placeholder="password"
              isSecure
              value={password}
              onChangeText={(prevPassword) => setPassword(prevPassword)}
            />

            <BaseButton
              disabled={!code || !password}
              title="Reset"
              onPress={reset}
            />

            {error && <Text style={styles.textError}>{error}</Text>}
          </View>
        )}

        {secondFactor && (
          <Text>2FA is required, but this UI does not handle that</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    // flex: 1,
    marginTop: 24,
    marginHorizontal: 32,
    // justifyContent: "space-between",
  },
  header: {
    textAlign: "center",
  },
  inpuptError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  textError: {
    color: COLORS.error,
  },
});

export default ForgotPasswordPage;
