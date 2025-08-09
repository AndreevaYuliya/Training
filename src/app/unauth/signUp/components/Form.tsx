import React from 'react';
import { FC, useRef, useState } from 'react';

import {
	Keyboard,
	ScrollView,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { useClerk, useSignUp } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';
import BaseTextInput from '@/src/components/BaseTextInput';
import BaseButton from '@/src/components/buttons/BaseButton';

import BaseBottomSheetModal, {
	BottomSheetModalMethods,
} from '@/src/components/BaseBottomSheetModal';

const Form: FC = () => {
	const { isLoaded, signUp, setActive } = useSignUp();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	const [email, setEmail] = useState('yuliya2080219@gmail.com');
	const [name, setName] = useState('Yuliia');
	const [username, setUsername] = useState('Yuliia11');
	const [phoneNumber, setPhoneNumber] = useState('+380961545544');
	const [password, setPassword] = useState('Rain2024*Secure');
	const [confirmedPassword, setConfirmedPassword] = useState('Rain2024*Secure');

	const [error, setError] = useState('');
	const [pendingVerification, setPendingVerification] = useState(false);

	const [verificationCode, setVerificationCode] = useState('');

	const isDisabled = !email || password !== confirmedPassword;

	// Handle submission of sign-up form
	const handleSignUp = async () => {
		console.log('handleSignUp triggered');

		if (!isLoaded) {
			return;
		}

		try {
			// Step 1: Create the sign-up but do NOT activate session yet
			const createResult = await signUp.create({
				emailAddress: email,
				password,
				firstName: name,
				username,
				unsafeMetadata: { phoneNumber },
			});

			console.log('signUp.create result:', createResult);

			// Step 2: Prepare the email verification (send code)
			const prepResult = await signUp.prepareEmailAddressVerification({
				strategy: 'email_code',
			});

			console.log('prepareEmailAddressVerification result:', prepResult);

			// Step 3: Show verification UI
			setPendingVerification(true);

			bottomSheetRef.current?.show('signUp');
		} catch (err) {
			console.error('Sign-up error:', err);

			setError('Sign-up failed');
		}
	};

	const onVerifyPress = async () => {
		if (!isLoaded) {
			return;
		}

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code: verificationCode,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === 'complete') {
				await setActive({ session: signUpAttempt.createdSessionId });

				// Сохраняем email и пароль в SecureStore для биометрии
				await SecureStore.setItemAsync('credentials', JSON.stringify({ email, password }));

				// Сохраняем, что пользователь залогинен через email
				await SecureStore.setItemAsync('provider', 'email');

				console.log('Redirecting to /auth/Profile...');

				router.push('/auth/Profile');
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signUpAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<BottomSheetModalProvider>
			<View style={{ flex: 1 }}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={styles.container}
						contentContainerStyle={styles.contentContainerStyle}
					>
						<View>
							<Header
								title="Sign Up"
								headerStyles={styles.header}
							/>

							<BaseTextInput
								label={['Email', '*']}
								value={email}
								placeholder="Enter your email"
								labelStyles={[
									{},
									{
										position: 'absolute',
										top: -5,
										left: 55,
										color: 'red',
										fontSize: 32,
									},
								]}
								onChangeText={(prevEmail) => setEmail(prevEmail.toLowerCase())}
							/>

							<BaseTextInput
								label="Name"
								value={name}
								placeholder="Enter your name"
								onChangeText={(prevName) => setName(prevName)}
							/>

							<BaseTextInput
								label="Username"
								value={username}
								placeholder="Enter your username"
								onChangeText={(prevUsername) => setUsername(prevUsername)}
							/>

							<BaseTextInput
								label="Phone number"
								value={phoneNumber}
								placeholder="Enter your phone number"
								onChangeText={(prevPhoneNumber) => setPhoneNumber(prevPhoneNumber)}
							/>

							<BaseTextInput
								label={['Password', '*']}
								value={password}
								placeholder="Enter your password"
								isSecure
								labelStyles={[
									{},
									{
										position: 'absolute',
										top: -5,
										left: 95,
										color: 'red',
										fontSize: 32,
									},
								]}
								onChangeText={(prevPassword) => setPassword(prevPassword)}
							/>

							<BaseTextInput
								label={['Confirm password', '*']}
								value={confirmedPassword}
								placeholder="Confirm your password"
								isSecure
								labelStyles={[
									{},
									{
										position: 'absolute',
										top: -5,
										left: 170,
										color: 'red',
										fontSize: 32,
									},
								]}
								onChangeText={(prevConfirmedPassword) =>
									setConfirmedPassword(prevConfirmedPassword)
								}
							/>
						</View>

						<BaseButton
							disabled={isDisabled}
							title="Sign Up"
							onPress={handleSignUp}
							containerStyles={{ marginTop: 24 }}
						/>

						{error && <Text>{error}</Text>}
					</ScrollView>
				</TouchableWithoutFeedback>

				<BaseBottomSheetModal
					ref={bottomSheetRef}
					setVerificationCode={setVerificationCode}
					emailToVerify={null} // или актуальный EmailAddressResource, если есть
					onSuccess={() => {
						// логика после успешной верификации
						bottomSheetRef.current?.close();

						setVerificationCode('');
						setPendingVerification(false);
					}}
					onPress={onVerifyPress}
				/>
			</View>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 24,
		marginHorizontal: 32,
	},

	contentContainerStyle: {
		flexGrow: 1,
		justifyContent: 'space-between',
	},

	header: {
		textAlign: 'center',
	},
});

export default Form;
