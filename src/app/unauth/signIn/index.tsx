import React from 'react';
import { FC } from 'react';

import { Platform, StyleSheet, View } from 'react-native';

import Header from '@/src/components/Header';
import Form from './components/Form';

import COLORS from '@/src/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignIn: FC = () => {
	const insets = useSafeAreaInsets();

	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: Platform.OS === 'ios' ? insets.top : 32,
					paddingBottom: Platform.OS === 'ios' ? insets.bottom : 15,
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
		paddingHorizontal: 16,
		backgroundColor: COLORS.background,
	},
});

export default SignIn;
