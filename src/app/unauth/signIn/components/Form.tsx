import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Alert, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import * as LocalAuthentication from 'expo-local-authentication';

import { useAuth, useSignIn, useSSO } from '@clerk/clerk-expo';
import { useLocalCredentials } from '@clerk/clerk-expo/local-credentials';

import { useWarmUpBrowser } from '@/src/hooks/useWarmUpBrowser';

import BaseTextInput from '@/src/components/BaseTextInput';
import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';
import TextButton from '@/src/components/buttons/TextButton';
import { BottomSheetModalMethods } from '@/src/components/BaseBottomSheetModal';

import COLORS from '@/src/constants/colors';

const Form: FC = () => {
	const { signIn, setActive, isLoaded } = useSignIn();
	const { isSignedIn } = useAuth();
	const { hasCredentials, setCredentials, authenticate, biometricType } = useLocalCredentials();

	useWarmUpBrowser(); // Prevent blank tab delay
	const { startSSOFlow } = useSSO();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [authLoading, setAuthLoading] = useState(false);
	const [canUseBiometrics, setCanUseBiometrics] = useState(false);

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	useEffect(() => {
		(async () => {
			const hasHardware = await LocalAuthentication.hasHardwareAsync();
			const isEnrolled = await LocalAuthentication.isEnrolledAsync();
			const storedCreds = await SecureStore.getItemAsync('credentials');

			console.log('Biometric available:', hasHardware, storedCreds);

			const biometricsAvailable = hasHardware /*&& isEnrolled*/ && !!storedCreds;

			setCanUseBiometrics(biometricsAvailable);
		})();
	}, []);

	// Handle the submission of the sign-in form
	const handleSignIn = async (useLocal: boolean) => {
		if (!isLoaded) {
			return;
		}

		if (isSignedIn) {
			console.log('User already signed in');

			router.replace('/');
			return;
		}

		// Start the sign-in process using the email and password provided
		try {
			const signInAttempt =
				hasCredentials && useLocal
					? await authenticate()
					: await signIn.create({
							identifier: email,
							password,
						});

			// If sign-in process is complete,
			// set the created session as active and redirect the user
			if (signInAttempt.status === 'complete') {
				console.log('status is complete?', signInAttempt.status);

				// Сохраняем тип провайдера в SecureStore
				await SecureStore.setItemAsync('provider', 'email');

				if (!useLocal) {
					await setCredentials({
						identifier: email,
						password,
					});

					await SecureStore.setItemAsync(
						'credentials',
						JSON.stringify({ email, password }),
					);
				}

				if (setActive) {
					await setActive({ session: signInAttempt.createdSessionId });
				}
				router.replace('/');
			} else {
				// If the status is not complete, check why.
				// User may need to complete further steps.
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err) {
			// For info on error handing,
			// see https://clerk.com/docs/custom-flows/error-handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	const handleBiometricLogin = async () => {
		console.log('Biometric button pressed');

		// Реальный биометрический запрос (прод)
		const result = await LocalAuthentication.authenticateAsync({
			promptMessage: 'Login with biometrics',
		});

		if (!result.success) {
			Alert.alert('Biometric authentication failed');
			return;
		}

		const storedCreds = await SecureStore.getItemAsync('credentials');
		if (!storedCreds) {
			Alert.alert('No saved credentials found');
			return;
		}
		const { email, password } = JSON.parse(storedCreds);
		try {
			if (!signIn) {
				return;
			}

			const signInAttempt = await signIn.create({ identifier: email, password });

			if (signInAttempt.status === 'complete') {
				await setActive({ session: signInAttempt.createdSessionId });

				router.replace('/');
			} else {
				Alert.alert('Additional verification required.');
			}
		} catch (err) {
			Alert.alert('Login failed');
		}
	};

	const handleProvidersSignIn = useCallback(
		async (strategy: 'oauth_google' | 'oauth_apple' | 'oauth_github') => {
			try {
				// Start the authentication process by calling `startSSOFlow()`
				const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
					strategy,
					// For web, defaults to current path
					// For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
					// For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
					redirectUrl: AuthSession.makeRedirectUri(),
				});

				// If sign in was successful, set the active session
				if (createdSessionId) {
					await setActive?.({ session: createdSessionId });

					// Сохраняем провайдера в SecureStore
					await SecureStore.deleteItemAsync('credentials');

					router.replace('/auth/Profile');
				} else {
					// If there is no `createdSessionId`,
					// there are missing requirements, such as MFA
					// Use the `signIn` or `signUp` returned from `startSSOFlow`
					// to handle next steps
				}
			} catch (err) {
				// See https://clerk.com/docs/custom-flows/error-handling
				// for more info on error handling
				console.error(JSON.stringify(err, null, 2));
			}
		},
		[],
	);

	const isDisabled = !email || !password;

	return (
		<BottomSheetModalProvider>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.container}>
					<View style={{ flex: 2, justifyContent: 'space-between' }}>
						{/* <Header title="Sign In" headerStyles={styles.header} /> */}
						<View>
							<BaseTextInput
								label="Email"
								value={email}
								placeholder="Enter your email"
								onChangeText={(prevEmail) => setEmail(prevEmail.toLowerCase())}
							/>

							<BaseTextInput
								label="Password"
								value={password}
								placeholder="Enter your password"
								isSecure
								onChangeText={(prevPassword) => setPassword(prevPassword)}
							/>

							<View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
								<Text style={{ fontSize: 18, color: COLORS.white }}>
									Forgot password?
								</Text>

								<TextButton
									title="Reset"
									titleStyles={{ textDecorationLine: 'underline' }}
									onPress={() => router.navigate('/common/ResetPasswordForm')}
								/>
							</View>
						</View>

						{canUseBiometrics && (
							<IconButton
								disabled={authLoading}
								iconName="touch-id"
								buttonStyles={styles.touchId}
								onPress={handleBiometricLogin} //handleBiometricLogin}
							/>
						)}

						<BaseButton
							disabled={isDisabled}
							title="Sign In"
							containerStyles={{ marginBottom: 16 }}
							onPress={() => handleSignIn(false)}
						/>
					</View>

					<View
						style={{
							flex: 1,
							justifyContent: 'space-between',
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<View
								style={{
									width: '35%',
									height: 2,
									alignItems: 'center',
									alignSelf: 'center',
									backgroundColor: COLORS.white,
								}}
							/>

							<Text
								style={{
									alignItems: 'center',
									alignSelf: 'center',
									color: COLORS.white,
									fontSize: 18,
									fontWeight: 'bold',
								}}
							>
								OR
							</Text>

							<View
								style={{
									width: '35%',
									height: 2,
									alignItems: 'center',
									alignSelf: 'center',
									backgroundColor: COLORS.white,
								}}
							/>
						</View>

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<IconButton
								iconName="google"
								buttonStyles={{
									backgroundColor: COLORS.white,
									opacity: 0.6,
									height: 60,
									width: 85,
									borderRadius: 35,
									alignItems: 'center',
									justifyContent: 'center',
								}}
								onPress={() => handleProvidersSignIn('oauth_google')}
							/>

							<IconButton
								iconName="apple"
								buttonStyles={{
									backgroundColor: COLORS.white,
									opacity: 0.6,
									height: 60,
									width: 85,
									borderRadius: 35,
									alignItems: 'center',
									justifyContent: 'center',
								}}
								onPress={() => handleProvidersSignIn('oauth_apple')}
							/>

							<IconButton
								iconName="github"
								buttonStyles={{
									backgroundColor: COLORS.white,
									opacity: 0.2,
									height: 60,
									width: 85,
									borderRadius: 35,
									alignItems: 'center',
									justifyContent: 'center',
								}}
								onPress={() => handleProvidersSignIn('oauth_github')}
							/>
						</View>

						<View
							style={{
								flexDirection: 'row',
								gap: 8,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Text style={{ fontSize: 18, color: COLORS.white }}>
								Don't have an account?
							</Text>

							<TextButton
								title="Sign up"
								titleStyles={{ textDecorationLine: 'underline' }}
								onPress={() => router.navigate('/unauth/signUp')}
							/>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 24,
		marginHorizontal: 32,
		justifyContent: 'space-between',
		gap: 48,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.background,
	},
	header: {
		textAlign: 'center',
	},
	touchId: {
		flex: 1,
		justifyContent: 'center',
	},
});

export default Form;
