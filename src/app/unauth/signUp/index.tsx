import React from 'react';
import { FC } from 'react';

import { StyleSheet, View } from 'react-native';

import Header from '@/src/components/Header';
import Form from './components/Form';

import COLORS from '@/src/constants/colors';

const SignUp: FC = () => {
	return (
		<View style={[styles.container]}>
			<Header
				backButton
				title="Sign Up"
			/>

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

export default SignUp;
