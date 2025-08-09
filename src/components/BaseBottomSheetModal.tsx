import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Platform, StyleSheet, Text } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { EmailAddressResource } from '@clerk/types';

import BaseTextInput from './BaseTextInput';
import BaseButton from './buttons/BaseButton';

import COLORS from '@/src/constants/colors';

type Props = {
	setVerificationCode?: (code: string) => void;
	emailToVerify?: EmailAddressResource | string | null;
	onSuccess: () => void;
	onPress: () => void;
};

export type BottomSheetModalMethods = {
	close: () => void;
};

const BaseBottomSheetModal = forwardRef<BottomSheetModalMethods, Props>((props, ref) => {
	const { setVerificationCode, onPress } = props;

	const bottomSheetRef = useRef<BottomSheet>(null);

	const [code, setCode] = useState('');
	const [error, setError] = useState('');

	useImperativeHandle(ref, () => ({
		show: () => {
			setError('');
			setCode('');
			setVerificationCode && setVerificationCode('');

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
					paddingTop: 16,
					paddingHorizontal: 32,
					justifyContent: 'center',
					paddingBottom: Platform.OS === 'android' ? 32 : undefined,
				}}
			>
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
