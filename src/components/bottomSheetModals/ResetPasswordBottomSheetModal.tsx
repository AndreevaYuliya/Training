import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';

import { Platform, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { useSignIn } from '@clerk/clerk-expo';

import BaseTextInput from '../BaseTextInput';
import BaseButton from '../buttons/BaseButton';

import COLORS from '@/src/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomSheetModalMethods = {
	show: () => void;
	close: () => void;
};

const ResetPasswordBottomSheetModal = forwardRef<BottomSheetModalMethods>((_, ref) => {
	const insets = useSafeAreaInsets();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [code, setCode] = useState('');

	const [successfulCreation, setSuccessfulCreation] = useState(false);
	const [secondFactor, setSecondFactor] = useState(false);
	const [error, setError] = useState('');

	const { isLoaded, signIn, setActive } = useSignIn();

	const bottomSheetRef = useRef<BottomSheet>(null);

	const resetForm = () => {
		setEmail('');
		setPassword('');
		setCode('');
		setError('');
		setSuccessfulCreation(false);
		setSecondFactor(false);
	};

	if (!isLoaded) {
		return null;
	}

	useImperativeHandle(ref, () => ({
		show: () => {
			resetForm();

			bottomSheetRef.current?.expand();
		},
		close: () => {
			bottomSheetRef.current?.close();
		},
	}));

	// Send the password reset code to the user's email
	const create = async () => {
		await signIn
			?.create({
				strategy: 'reset_password_email_code',
				identifier: email,
			})
			.then((_) => {
				setSuccessfulCreation(true);
				setError('');
			})
			.catch((err) => {
				console.error('error', err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	};

	// Reset the user's password.
	// Upon successful reset, the user will be
	// signed in and redirected to the home page
	const reset = async () => {
		await signIn
			?.attemptFirstFactor({
				strategy: 'reset_password_email_code',
				code,
				password,
			})
			.then(async (result) => {
				// Check if 2FA is required
				if (result.status === 'needs_second_factor') {
					setSecondFactor(true);
					setError('');
				} else if (result.status === 'complete') {
					// Set the active session to
					// the newly created session (user is now signed in)
					setActive({ session: result.createdSessionId });
					setError('');

					// ✅ Redirect to Profile or any success screen

					await SecureStore.setItemAsync(
						'credentials',
						JSON.stringify({
							email,
							password,
						}),
					);

					bottomSheetRef.current?.close();
				} else {
					console.log(result);
				}
			})
			.catch((err) => {
				console.error('error', err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	};

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={-1}
			backdropComponent={(props) => (
				<BottomSheetBackdrop
					{...props}
					disappearsOnIndex={-1}
					appearsOnIndex={0}
					pressBehavior="close"
				/>
			)}
			backgroundStyle={styles.backgroundColor}
		>
			<BottomSheetView
				style={[
					styles.container,
					{
						paddingBottom: Platform.OS === 'ios' ? insets.bottom : 15,
					},
				]}
			>
				{!successfulCreation && (
					<View>
						<BaseTextInput
							label="Provide your email address"
							placeholder="email"
							value={email}
							labelStyles={error && styles.textError}
							inputStyles={error && styles.inpuptError}
							onChangeText={(prevEmail) => setEmail(prevEmail.toLowerCase())}
						/>

						{error && <Text style={styles.textError}>{error}</Text>}

						<BaseButton
							disabled={!email}
							title="Send password reset code"
							containerStyles={styles.marginTop}
							onPress={create}
						/>
					</View>
				)}

				{successfulCreation && (
					<View>
						<BaseTextInput
							label="Enter the code sent to your email"
							placeholder="code"
							value={code}
							labelStyles={error && styles.textError}
							inputStyles={error && styles.inpuptError}
							onChangeText={setCode}
						/>

						{error && <Text style={styles.textError}>{error}</Text>}

						<BaseTextInput
							label="Enter your new password"
							placeholder="password"
							isSecure
							value={password}
							onChangeText={(prevPassword) => setPassword(prevPassword)}
						/>

						<BaseButton
							disabled={!code || !password}
							title="Reset"
							containerStyles={styles.marginTop}
							onPress={reset}
						/>
					</View>
				)}

				{secondFactor && <Text>2FA is required, but this UI does not handle that</Text>}
			</BottomSheetView>
		</BottomSheet>
	);
});

export default ResetPasswordBottomSheetModal;

const styles = StyleSheet.create({
	backgroundColor: {
		backgroundColor: COLORS.background,
	},

	marginTop: {
		marginTop: 100,
	},

	container: {
		padding: 32,
		justifyContent: 'center',
		paddingBottom: Platform.OS === 'android' ? 32 : undefined,
	},

	inpuptError: {
		borderWidth: 1,
		borderColor: COLORS.red,
	},

	textError: {
		color: COLORS.red,
		fontSize: 16,
		marginBottom: 15,
	},
});
