// EditFieldModal.tsx
import React, { FC } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import COLORS from '../constants/colors';
import BaseTextInput from './BaseTextInput';
import BaseButton from './buttons/BaseButton';

type Props = {
	visible: boolean;
	label: string;
	placeholder: string;
	value: string;
	onChange: (val: string) => void;
	onCancel: () => void;
	onSave: () => void;
};

const BaseModal: FC<Props> = (props) => {
	const { visible, label, placeholder, value, onChange, onCancel, onSave } = props;
	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent
			onRequestClose={onCancel}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<BaseTextInput
						label={label}
						placeholder={placeholder}
						value={value}
						onChangeText={onChange}
					/>
					<View
						style={{
							flexDirection: 'row',
							marginTop: 16,
							justifyContent: 'space-between',
						}}
					>
						<BaseButton
							title="Save"
							buttonStyles={{ padding: 24 }}
							onPress={onSave}
						/>
						<BaseButton
							title="Cancel"
							buttonStyles={{ padding: 24 }}
							onPress={onCancel}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default BaseModal;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.transparent,
	},
	modalContent: {
		backgroundColor: COLORS.background,
		padding: 20,
		borderRadius: 12,
		width: '80%',
	},
});
