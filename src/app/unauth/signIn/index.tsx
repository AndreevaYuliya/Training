import { FC, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "@/src/components/Header";
import COLORS from "@/src/constants/colors";
import Form from "./components/Form";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const SignIn: FC = () => {
  const insets = useSafeAreaInsets();

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
      <Header title="Sign In" />
      <Form />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default SignIn;
