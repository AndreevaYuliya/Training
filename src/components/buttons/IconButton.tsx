import { FC } from "react";

import {
  Pressable,
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
} from "react-native";

import TouchIdIcon from "../../assets/icons/touch-id.svg";
import ArrowLeftIcon from "../../assets/icons/back.svg";
import CrossIcon from "../../assets/icons/close.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import CloseEyeIcon from "../../assets/icons/close-eye.svg";
import Eye from "../../assets/icons/eye.svg";
import { FontAwesome } from "@expo/vector-icons";
import COLORS from "@/src/constants/colors";

type Props = {
  iconName: IconType;
  disabled?: boolean;
  onPress: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  buttonStyles?: StyleProp<ViewStyle>;
};

type IconType =
  | "touch-id"
  | "face-recognition"
  | "arrow-left"
  | "cross"
  | "profile"
  | "close-eye"
  | "eye"
  | "google"
  | "apple"
  | "github";

const IconButton: FC<Props> = (props) => {
  const { iconName, disabled, onPress, containerStyles, buttonStyles } = props;

  const renderIcon = () => {
    switch (iconName) {
      case "touch-id":
        return <TouchIdIcon width={48} height={48} />;
      case "arrow-left":
        return <ArrowLeftIcon width={24} height={24} />;
      case "cross":
        return <CrossIcon width={24} height={24} />;
      case "profile":
        return <ProfileIcon width={24} height={24} />;
      case "close-eye":
        return <CloseEyeIcon width={24} height={24} />;
      case "eye":
        return <Eye width={24} height={24} />;
      case "google":
        return <FontAwesome name="google" size={32} color={COLORS.white} />;
      case "apple":
        return <FontAwesome name="apple" size={32} color={COLORS.white} />;
      case "github":
        return <FontAwesome name="github" size={32} color={COLORS.white} />;
      default:
        null;
    }
  };

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonContainer,
        buttonStyles,
        { opacity: pressed || disabled ? 0.5 : 1 },
      ]}
      onPress={onPress}
    >
      {renderIcon()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
  },
});

export default IconButton;
