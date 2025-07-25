import COLORS from '@/src/constants/colors';
import { useSignUp, useUser } from '@clerk/clerk-expo';
import { EmailAddressResource } from '@clerk/types';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import BaseTextInput from './BaseTextInput';
import BaseButton from './buttons/BaseButton';

type Props = {
	setVerificationCode: (code: string) => void;
	emailToVerify: EmailAddressResource | string | null;
	onSuccess: () => void;
	onPress: () => void;
};

export type BottomSheetModalMethods = {
	show: (mode: 'changeEmail' | 'signUp') => void;
	close: () => void;
};

const BaseBottomSheetModal = forwardRef<BottomSheetModalMethods, Props>((props, ref) => {
	const { setVerificationCode, emailToVerify, onSuccess, onPress } = props;

	const bottomSheetRef = useRef<BottomSheet>(null);

	// const [mode, setMode] = useState<'changeEmail' | 'signUp'>('signUp');
	// const [step, setStep] = useState<'input' | 'verify'>('input');

	// const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [error, setError] = useState('');
	// const [emailToVerify, setEmailToVerify] = useState<EmailAddressResource | string | null>(null);

	const { isLoaded, signUp, setActive } = useSignUp();
	const { user } = useUser();

	useImperativeHandle(ref, () => ({
		show: (selectedMode: 'changeEmail' | 'signUp') => {
			console.log(
				'BaseBottomSheetModal show called, bottomSheetRef:',
				bottomSheetRef.current,
			);
			// setMode(selectedMode);
			// setStep('input');
			// setEmail('');
			setVerificationCode('');
			setError('');
			bottomSheetRef.current?.expand();
		},
		close: () => {
			bottomSheetRef.current?.close();
		},
	}));

	// const onVerifyPress = async () => {
	// 	if (!isLoaded) return;

	// 	try {
	// 		// Use the code the user provided to attempt verification
	// 		const signUpAttempt = await signUp.attemptEmailAddressVerification({
	// 			code,
	// 		});

	// 		// If verification was completed, set the session to active
	// 		// and redirect the user
	// 		if (signUpAttempt.status === 'complete') {
	// 			await setActive({ session: signUpAttempt.createdSessionId });
	// 			router.replace('/');
	// 		} else {
	// 			// If the status is not complete, check why. User may need to
	// 			// complete further steps.
	// 			console.error(JSON.stringify(signUpAttempt, null, 2));
	// 		}
	// 	} catch (err) {
	// 		// See https://clerk.com/docs/custom-flows/error-handling
	// 		// for more info on error handling
	// 		console.error(JSON.stringify(err, null, 2));
	// 	}
	// };

	// Called when user confirms (e.g., confirm email change or sign-up start)
	// const onConfirmPress = async () => {
	// 	// if (mode === 'changeEmail') {
	// 	if (!user) return;

	// 	try {
	// 		const newEmailObj = await updateUserEmail(user, String(emailToVerify));

	// 		if (newEmailObj) {
	// 			setEmailToVerify(newEmailObj);
	// 			// setStep('verify');
	// 			setError('');
	// 		} else {
	// 			alert('Email is the same or already used');
	// 		}
	// 	} catch (err) {
	// 		console.error('Email update failed:', err);
	// 		setError('Failed to update email');
	// 	}
	// 	// return;
	// 	// }

	// 	// Sign-up flow (start sign-up & send code)
	// 	try {
	// 		await signUp?.create({ emailAddress: String(emailToVerify) });
	// 		await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
	// 		// setStep('verify');
	// 		setError('');
	// 	} catch (err) {
	// 		console.error('Sign-up error:', err);
	// 		setError('Sign-up failed');
	// 	}
	// };

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
			backgroundStyle={{ backgroundColor: COLORS.background }}
		>
			<BottomSheetView
				style={{
					// padding: 36,
					paddingTop: 16,
					paddingHorizontal: 32,
					// alignItems: 'center',
					justifyContent: 'center',
					paddingBottom: Platform.OS === 'android' ? 32 : undefined,
				}}
			>
				<BaseTextInput
					label="Verify your email"
					value={code}
					placeholder="Enter your verification code"
					labelStyles={{
						textAlign: 'center',
						width: '100%',
						fontSize: 24,
						paddingBottom: 16,
					}}
					containerStyles={{ paddingBottom: 100 }}
					onChangeText={(text) => {
						setCode(text);
						setVerificationCode(text); // ← передаём в родитель
					}}
				/>
				{error ? <Text style={styles.error}>{error}</Text> : null}
				<BaseButton
					title="Verify"
					onPress={onPress}
				/>
			</BottomSheetView>
		</BottomSheet>
	);
});

export default BaseBottomSheetModal;

const styles = StyleSheet.create({
	error: {
		color: 'red',
		marginBottom: 8,
	},
});
