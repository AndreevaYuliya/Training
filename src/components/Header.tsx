import { FC, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import IconButton from "./buttons/IconButton";
import COLORS from "../constants/colors";
import { router } from "expo-router";

type Props = {
  title: string;
  backButton?: boolean;
  children?: ReactNode;
  headerStyles?: StyleProp<TextStyle>;
};

const Header: FC<Props> = (props) => {
  const { title, backButton, children, headerStyles } = props;
  return (
    <View style={styles.container}>
      {backButton && <IconButton iconName="arrow-left" onPress={router.back} />}

      <Text style={[styles.titleContainer, headerStyles]}>{title}</Text>

      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
  },

  titleContainer: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24 * 1.2,
    color: COLORS.white,
  },
});

export default Header;
