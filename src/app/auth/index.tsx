import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth, useUser, useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import COLORS from "@/src/constants/colors";
import Header from "@/src/components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextButton from "@/src/components/buttons/TextButton";

const Profile: FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const insets = useSafeAreaInsets();

  if (!user) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header backButton title="Profile" />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          margin: 16,
          justifyContent: "space-between",
        }}
      >
        {/* <Text>{user.username[0]?.user}</Text> */}
        <Text>{user.emailAddresses[0]?.emailAddress}</Text>

        <TextButton
          title="Logout"
          onPress={async () => {
            await signOut();
            router.replace("/unauth/signIn");
          }}
        ></TextButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default Profile;
