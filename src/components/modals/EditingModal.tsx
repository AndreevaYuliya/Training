// EditFieldModal.tsx
import React, { FC } from 'react';

import { Modal, StyleSheet, Text, View } from 'react-native';

import BaseTextInput from '../BaseTextInput';
import BaseButton from '../buttons/BaseButton';

import COLORS from '../../constants/colors';

type Props = {
	visible: boolean;
	label: string;
	placeholder: string;
	value: string;
	onChange?: (val: string) => void;
	onCancel: () => void;
	onSave: () => void;
};

const EditingModal: FC<Props> = (props) => {
	const { visible, label, placeholder, value, onChange, onCancel, onSave } = props;

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent
			onRequestClose={onCancel}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.title}>{label}</Text>

					<BaseTextInput
						placeholder={placeholder}
						value={value}
						onChangeText={onChange ?? (() => {})}
					/>

					<View style={styles.buttonsContainer}>
						<BaseButton
							title="Save"
							buttonStyles={styles.padding}
							onPress={onSave}
						/>

						<BaseButton
							title="Cancel"
							buttonStyles={styles.padding}
							onPress={onCancel}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default EditingModal;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.transparent,
	},

	modalContent: {
		padding: 20,
		width: '80%',
		borderRadius: 12,
		backgroundColor: COLORS.background,
	},

	title: {
		marginBottom: 12,
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.white,
	},

	message: {
		fontSize: 16,
		marginBottom: 20,
		color: COLORS.white,
	},

	buttonsContainer: {
		flexDirection: 'row',
		marginTop: 16,
		justifyContent: 'space-between',
	},

	padding: {
		padding: 24,
	},
});
