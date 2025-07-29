import React, { FC, ReactNode, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import COLORS from '../constants/colors';
import IconButton from './buttons/IconButton';

type Props = {
	label?: string | string[];
	value: string;
	placeholder?: string;
	isSecure?: boolean;
	onChangeText: (value: string) => void;
	onBlur?: () => void;
	containerStyles?: StyleProp<ViewStyle>;
	labelStyles?: StyleProp<TextStyle> | StyleProp<TextStyle>[];
	inputStyles?: StyleProp<TextStyle>;
	children?: ReactNode;
};

const BaseTextInput: FC<Props> = (props) => {
	const {
		label,
		value,
		placeholder,
		isSecure,
		onChangeText,
		onBlur,
		containerStyles,
		labelStyles,
		inputStyles,
		children,
	} = props;

	const [isHidden, setIsHidden] = useState<boolean>(!!isSecure);

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

			<View style={styles.inputContainer}>
				<TextInput
					value={value}
					placeholder={placeholder}
					secureTextEntry={isHidden}
					style={[styles.input, inputStyles]}
					onChangeText={onChangeText}
					onBlur={onBlur}
				/>

				{isSecure && (
					<IconButton
						iconName={isHidden ? 'close-eye' : 'eye'}
						buttonStyles={styles.inputIcon}
						onPress={() => setIsHidden((prevIsHidden) => !prevIsHidden)}
					/>
				)}

				{children}
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
		flexDirection: 'row',
		gap: 8,
	},

	inputContainer: {
		justifyContent: 'center',
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
		position: 'absolute',
		right: 17,
		backgroundColor: 'transparent',
	},
});

export default BaseTextInput;
