// EditFieldModal.tsx
import React, { FC } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import COLORS from '../../constants/colors';
import BaseButton from '../buttons/BaseButton';

type Props = {
	visible: boolean;
	title: string;
	message: string;
	onCancel: () => void;
	onConfirm: () => void;
};

const ConfirmationModal: FC<Props> = (props) => {
	const { visible, title, message, onCancel, onConfirm } = props;
	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent
			onRequestClose={onCancel}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.title}>{title}</Text>

					<Text style={styles.message}>{message}</Text>

					<View style={styles.buttonsContainer}>
						<BaseButton
							title="Confirm"
							buttonStyles={styles.padding}
							onPress={onConfirm}
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

export default ConfirmationModal;

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
