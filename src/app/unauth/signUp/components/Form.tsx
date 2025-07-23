import BaseTextInput from '@/src/components/BaseTextInput';
import BaseButton from '@/src/components/buttons/BaseButton';
import Header from '@/src/components/Header';
import { useSignUp, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { FC, useState } from 'react';
import {
	Keyboard,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

const Form: FC = () => {
	const { isLoaded, signUp, setActive } = useSignUp();

	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [error, setError] = useState('');
	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState('');

	const { user } = useUser();

	const isDisabled = !email || password !== confirmedPassword;

	// Handle submission of sign-up form
	const handleSignUp = async () => {
		if (!isLoaded) return;

		console.log(email, password);

		// Start sign-up process using email and password provided
		try {
			await signUp.create({
				emailAddress: email,
				password,
			});

			// Send user an email with verification code
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

			// Set 'pendingVerification' to true to display second form
			// and capture OTP code
			setPendingVerification(true);
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	// Handle submission of verification form
	const onVerifyPress = async () => {
		if (!isLoaded) return;

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === 'complete') {
				await setActive({ session: signUpAttempt.createdSessionId });

				await user?.update({
					unsafeMetadata: {
						name,
						username,
						phoneNumber,
					},
				});

				router.replace('/auth');
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

	if (pendingVerification) {
		return (
			<>
				<Text>Verify your email</Text>
				<TextInput
					value={code}
					placeholder="Enter your verification code"
					onChangeText={(code) => setCode(code)}
				/>
				<TouchableOpacity onPress={onVerifyPress}>
					<Text>Verify</Text>
				</TouchableOpacity>
			</>
		);
	}

	return (
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
