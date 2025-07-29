import COLORS from '@/src/constants/colors';
import { EmailAddressResource } from '@clerk/types';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import BaseTextInput from './BaseTextInput';
import BaseButton from './buttons/BaseButton';

type Props = {
	setVerificationCode?: (code: string) => void;
	emailToVerify?: EmailAddressResource | string | null;
	setPassword?: (password: string) => void;
	onSuccess: () => void;
	onPress: () => void;
};

type Mode = 'changeEmail' | 'setUpPassword' | 'signUp';

export type BottomSheetModalMethods = {
	show: (mode: Mode) => void;
	close: () => void;
};

const BaseBottomSheetModal = forwardRef<BottomSheetModalMethods, Props>((props, ref) => {
	const { setVerificationCode, setPassword, onPress } = props;

	const bottomSheetRef = useRef<BottomSheet>(null);

	const [mode, setMode] = useState<Mode>('signUp');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordLocal, setPasswordLocal] = useState('');
	const [code, setCode] = useState('');
	const [error, setError] = useState('');

	useImperativeHandle(ref, () => ({
		show: (selectedMode: Mode) => {
			setMode(selectedMode);
			setError('');

			if (selectedMode === 'changeEmail' || selectedMode === 'signUp') {
				setCode('');
				setVerificationCode && setVerificationCode('');
			} else {
				setPasswordLocal('');
				setConfirmPassword('');
				setPassword && setPassword('');
			}
			bottomSheetRef.current?.expand();
		},
		close: () => {
			bottomSheetRef.current?.close();
		},
	}));

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
				{mode === 'changeEmail' || mode === 'signUp' ? (
					<>
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
								setVerificationCode && setVerificationCode(text); // ← передаём в родитель
							}}
						/>
						{error ? <Text style={styles.error}>{error}</Text> : null}
						<BaseButton
							title="Verify"
							onPress={onPress}
						/>
					</>
				) : (
					<>
						<BaseTextInput
							label="New Password"
							placeholder="Enter password"
							isSecure
							value={passwordLocal}
							onChangeText={(text) => {
								setPasswordLocal(text);
								setPassword && setPassword(text);
							}}
						/>
						<BaseTextInput
							label="Confirm Password"
							placeholder="Confirm password"
							isSecure
							value={confirmPassword}
							onChangeText={setConfirmPassword}
						/>
						{error ? <Text style={styles.error}>{error}</Text> : null}
						<BaseButton
							title="Save Password"
							onPress={onPress}
						/>
					</>
				)}
			</BottomSheetView>
		</BottomSheet>
	);
});

export default BaseBottomSheetModal;

const styles = StyleSheet.create({
	error: {
		color: COLORS.red,
		marginBottom: 8,
	},
});
