import { FC } from 'react';

import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/src/components/Header';

import COLORS from '@/src/constants/colors';
import Form from './components/Form';

const SignUp: FC = () => {
	const insets = useSafeAreaInsets();

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
