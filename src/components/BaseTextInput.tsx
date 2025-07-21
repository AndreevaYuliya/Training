import { FC, useState } from "react";
import {
  StyleProp,
  TextInput,
  TextStyle,
  ViewStyle,
  Text,
  View,
  StyleSheet,
} from "react-native";
import COLORS from "../constants/colors";
import IconButton from "./buttons/IconButton";

type Props = {
  label: string | string[];
  value: string;
  placeholder: string;
  isSecure?: boolean;
  onChangeText: (value: string) => void;
  containerStyles?: StyleProp<ViewStyle>;
  labelStyles?: StyleProp<TextStyle> | StyleProp<TextStyle>[];
  inputStyles?: StyleProp<TextStyle>;
};

const BaseTextInput: FC<Props> = (props) => {
  const {
    label,
    value,
    placeholder,
    isSecure,
    onChangeText,
    containerStyles,
    labelStyles,
    inputStyles,
  } = props;

  const [isHidden, setIsHidden] = useState<boolean>(true);

  return (
    <View style={containerStyles}>
      <View style={styles.labelRequired}>
        {Array.isArray(label) ? (
          label.map((lbl, index) => (
            <Text
              key={index}
              style={[
                styles.label,
                Array.isArray(labelStyles) ? labelStyles[index] : labelStyles,
              ]}
            >
              {lbl}
            </Text>
          ))
        ) : (
          <Text style={[styles.label, labelStyles]}>{label}</Text>
        )}
      </View>

      <View style={[styles.inputContainer, containerStyles]}>
        <TextInput
          value={value}
          placeholder={placeholder}
          secureTextEntry={isHidden}
          style={[styles.input, inputStyles]}
          onChangeText={onChangeText}
        />

        {isSecure && (
          <IconButton
            iconName={isHidden ? "close-eye" : "eye"}
            buttonStyles={styles.inputIcon}
            onPress={() => setIsHidden((prevIsHidden) => !prevIsHidden)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    color: COLORS.white,
  },

  labelRequired: {
    flexDirection: "row",
    gap: 8,
  },

  inputContainer: {
    justifyContent: "center",
  },

  input: {
    marginVertical: 10,
    padding: 15,
    paddingRight: 31,
    borderRadius: 32,
    fontSize: 18,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },

  inputIcon: {
    position: "absolute",
    right: 17,
    backgroundColor: "transparent",
  },
});

export default BaseTextInput;
