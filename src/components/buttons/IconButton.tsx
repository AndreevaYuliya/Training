import React from 'react';
import { FC } from 'react';

import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

import ArrowLeftIcon from '../../assets/icons/back.svg';
import CrossIcon from '../../assets/icons/close.svg';
import CloseEyeIcon from '../../assets/icons/close-eye.svg';
import Eye from '../../assets/icons/eye.svg';
import GoogleIcon from '../../assets/icons/google.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import TouchIdIcon from '../../assets/icons/touch-id.svg';

import COLORS from '@/src/constants/colors';

type Props = {
	iconName: IconType;
	disabled?: boolean;
	onPress: () => void;
	containerStyles?: StyleProp<ViewStyle>;
	buttonStyles?: StyleProp<ViewStyle>;
};

type IconType =
	| 'touch-id'
	| 'face-recognition'
	| 'arrow-left'
	| 'cross'
	| 'profile'
	| 'close-eye'
	| 'eye'
	| 'google'
	| 'apple'
	| 'github'
	| 'settings'
	| 'edit'
	| 'trash';

const IconButton: FC<Props> = (props) => {
	const { iconName, disabled, onPress, containerStyles, buttonStyles } = props;

	const renderIcon = () => {
		switch (iconName) {
			case 'touch-id':
				return (
					<TouchIdIcon
						width={48}
						height={48}
					/>
				);
			case 'arrow-left':
				return (
					<ArrowLeftIcon
						width={24}
						height={24}
					/>
				);
			case 'cross':
				return (
					<CrossIcon
						width={24}
						height={24}
						color={COLORS.white}
					/>
				);
			case 'profile':
				return (
					<ProfileIcon
						width={24}
						height={24}
					/>
				);
			case 'close-eye':
				return (
					<CloseEyeIcon
						width={24}
						height={24}
					/>
				);
			case 'eye':
				return (
					<Eye
						width={24}
						height={24}
					/>
				);
			case 'google':
				return (
					<GoogleIcon
						width={32}
						height={32}
					/>
				);
			case 'apple':
				return (
					<FontAwesome
						name="apple"
						size={32}
						color={COLORS.black}
					/>
				);
			case 'github':
				return (
					<FontAwesome
						name="github"
						size={32}
						color={COLORS.black}
					/>
				);
			case 'settings':
				return (
					<Ionicons
						name="settings-outline"
						size={32}
						color={COLORS.white}
					/>
				);
			case 'trash':
				return (
					<Ionicons
						name="trash"
						color={COLORS.white}
						size={24}
					/>
				);
			case 'edit':
				return (
					<MaterialIcons
						name="edit"
						color={COLORS.white}
						size={18}
					/>
				);
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
		alignSelf: 'center',
	},
});

export default IconButton;
