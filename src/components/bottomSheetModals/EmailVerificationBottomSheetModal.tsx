import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Platform, StyleSheet, Text, View } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import BaseTextInput from '../BaseTextInput';
import BaseButton from '../buttons/BaseButton';

import COLORS from '@/src/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
	setVerificationCode: (code: string) => void;
	err: string | null;
	onPress: () => void;
};

export type BottomSheetModalMethods = {
	show: () => void;
	close: () => void;
};

const EmailVerificationBottomSheetModal = forwardRef<BottomSheetModalMethods, Props>(
	(props, ref) => {
		const insets = useSafeAreaInsets();

		const { setVerificationCode, err, onPress } = props;

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
					<View>
						<BaseTextInput
							label="Enter the code"
							value={code}
							placeholder="Enter your verification code"
							labelStyles={error && styles.textError}
							inputStyles={error && styles.inpuptError}
							onChangeText={(text) => {
								setCode(text);
								setVerificationCode && setVerificationCode(text);
							}}
						/>

						{err && <Text style={styles.textError}>{err}</Text>}

						<BaseButton
							disabled={!code}
							title="Verify"
							containerStyles={styles.marginTop}
							onPress={onPress}
						/>
					</View>
				</BottomSheetView>
			</BottomSheet>
		);
	},
);

export default EmailVerificationBottomSheetModal;

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
	},
});
