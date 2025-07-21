import COLORS from "@/src/constants/colors";
import React, { FC, ReactNode } from "react";

import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  disabled?: boolean;
  title?: string;
  pressedOpacity?: number;
  containerStyles?: StyleProp<ViewStyle>;
  titleStyles?: StyleProp<TextStyle>;
  buttonStyles?: StyleProp<ViewStyle>;
  onPress: () => void;
  children?: ReactNode;
};

const BaseButton: FC<Props> = (props) => {
  const {
    disabled,
    title,
    pressedOpacity = 0.5,
    containerStyles,
    titleStyles,
    buttonStyles,
    onPress,
    children,
  } = props;

  return (
    <View style={containerStyles}>
      <Pressable
        disabled={disabled}
        style={({ pressed }) => [
          styles.buttonContainer,
          buttonStyles,
          { opacity: pressed || disabled ? pressedOpacity : 1 },
        ]}
        onPress={onPress}
      >
        {title && (
          <Text style={[styles.buttonTitle, titleStyles]}>{title}</Text>
        )}

        {children}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 7,
    width: "auto",
    height: 50,
    borderRadius: 32,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: COLORS.blue,
  },

  buttonTitle: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
  },
});

export default BaseButton;
