import COLORS from '@/src/constants/colors';
import React, { FC, ReactNode } from 'react';

import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type Props = {
	title?: string;
	pressedOpacity?: number;
	titleStyles?: StyleProp<TextStyle>;
	buttonStyles?: StyleProp<ViewStyle>;
	onPress: () => void;
	children?: ReactNode;
};

const TextButton: FC<Props> = (props) => {
	const { title, pressedOpacity = 0.5, titleStyles, buttonStyles, onPress, children } = props;

	return (
		<Pressable
			style={({ pressed }) => [
				styles.buttonContainer,
				buttonStyles,
				{ opacity: pressed ? pressedOpacity : 1 },
			]}
			onPress={onPress}
		>
			{title && <Text style={[styles.buttonTitle, titleStyles]}>{title}</Text>}

			{children}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		backgroundColor: 'transparent',
	},

	buttonTitle: {
		fontSize: 18,
		fontWeight: 500,
		color: COLORS.textButton,
		textAlign: 'center',
		textDecorationLine: 'underline',
	},
});

export default TextButton;
