import { FC, useRef, useState } from 'react';
import {
	Alert,
	Image,
	Keyboard,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import { useUser } from '@clerk/clerk-expo';

import TextButton from '@/src/components/buttons/TextButton';

import BaseBottomSheetModal, {
	BottomSheetModalMethods,
} from '@/src/components/BaseBottomSheetModal';
import BaseTextInput from '@/src/components/BaseTextInput';
import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';
import COLORS from '@/src/constants/colors';
import updateUserEmail from '@/src/hooks/updateUserEmail';
import { EmailAddressResource } from '@clerk/types';
import { MaterialIcons } from '@expo/vector-icons';

import Header from '@/src/components/Header';
import ConfirmationModal from '@/src/components/modals/ConfirmationModal';
import EditingModal from '@/src/components/modals/EditingModal';
import React from 'react';
import useChangeAvatar from './helpers/handleChangeAvatar';
import useFieldDelete from './helpers/useFieldDelete';

const EditAccount: FC = () => {
	const { isLoaded, user } = useUser();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	const [editingField, setEditingField] = useState<
		'avatar' | 'name' | 'username' | 'phone' | 'account' | null
	>(null);

	const [image, setImage] = useState<string | null>(null);
	const [name, setName] = useState(user?.firstName);
	const [username, setUsername] = useState(user?.username ?? '');
	const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress ?? '');
	const [phone, setPhone] = useState(
		user?.unsafeMetadata?.phoneNumber ? user?.unsafeMetadata?.phoneNumber.toString() : '',
	);

	const [emailToVerify, setEmailToVerify] = useState<EmailAddressResource | null>(null);
	const [verificationCode, setVerificationCode] = useState('');
	const [pendingVerification, setPendingVerification] = useState(false);

	const [error, setError] = useState('');

	const { handleChangeAvatar } = useChangeAvatar(setImage);

	// Use your custom hook for deleting fields
	const {
		fieldToDelete,
		setFieldToDelete,
		showFieldDeleteModal,
		setShowFieldDeleteModal,
		confirmFieldDelete,
	} = useFieldDelete(setImage, setName, setUsername, setPhone, setEditingField);

	const handleSave = async () => {
		if (!user) {
			return;
		}

		try {
			if (editingField === 'name') {
				await user.update({ firstName: name });
			} else if (editingField === 'username') {
				await user.update({ username });
			} else if (editingField === 'phone') {
				await user.update({
					unsafeMetadata: {
						...user.unsafeMetadata,
						phoneNumber: phone,
					},
				});
			}

			setEditingField(null);
		} catch (error: unknown) {
			let message = 'Unknown error occurred';

			if (error instanceof Error) {
				message = error.message;
			}
			Alert.alert('Update Failed', message);
		}
	};

	const onConfirmEmail = async () => {
		if (!user) {
			return;
		}

		try {
			const newEmailObj = await updateUserEmail(user, email);
			if (newEmailObj) {
				setEmailToVerify(newEmailObj);
				setPendingVerification(true);
				bottomSheetRef.current?.show('changeEmail');
			}
		} catch (err: any) {
			console.error('Failed to send verification code:', err);
			setError(err.errors?.[0]?.message || 'Something went wrong');
		}
	};

	const handleVerifyEmail = async () => {
		if (!user || !emailToVerify || !verificationCode) {
			return;
		}

		try {
			await emailToVerify.attemptVerification({ code: verificationCode });
			await user.update({ primaryEmailAddressId: emailToVerify.id });

			// Delete old emails
			for (const e of user.emailAddresses.filter((e) => e.id !== emailToVerify.id)) {
				await e.destroy();
			}

			setPendingVerification(false);
			setEmailToVerify(null);
			bottomSheetRef.current?.close();
		} catch (err: any) {
			console.error('Verification error:', err);
			setError(err.errors?.[0]?.message || 'Invalid code');
		}
	};

	if (!user) {
		return null;
	}

	return (
		<View style={[styles.container]}>
			<Header
				backButton
				title="Edit Profile"
			/>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
					style={{
						flex: 1,
						margin: 16,
						// backgroundColor: 'green',
					}}
				>
					<TouchableOpacity
						style={styles.avatarWrapper}
						onPress={handleChangeAvatar}
					>
						<Image
							source={{ uri: user.imageUrl || undefined }}
							style={styles.avatar}
						/>
						<View
							style={{
								marginTop: 8,
								flexDirection: 'row',
								gap: 4,
								alignItems: 'center',
							}}
						>
							<Text style={styles.changeAvatarText}>Change avatar</Text>
							<MaterialIcons
								name="edit"
								color={COLORS.textButton}
								size={18}
							/>
						</View>

						<IconButton
							iconName="cross"
							buttonStyles={{
								position: 'absolute',
								right: 8,
								top: 8,
							}}
							onPress={() => {
								setFieldToDelete('avatar');
								setShowFieldDeleteModal(true);
							}}
						/>
					</TouchableOpacity>

					{!name ? (
						<TextButton
							title="+ Add name"
							buttonStyles={{
								alignItems: 'center',
								flexDirection: 'row',
								gap: 4,
							}}
							titleStyles={{ textDecorationLine: 'none' }}
							onPress={() => setEditingField('name')}
						>
							<MaterialIcons
								name="edit"
								color={COLORS.textButton}
								size={18}
							/>
						</TextButton>
					) : (
						<View style={{ flexDirection: 'row', gap: 16 }}>
							<BaseTextInput
								label="Name"
								placeholder="Enter your name"
								value={name}
								containerStyles={{ flex: 1 }}
								onChangeText={setName}
							>
								<TextButton
									title="Save"
									buttonStyles={{ position: 'absolute', right: 15 }}
									titleStyles={{ textDecorationLine: 'none' }}
									onPress={() => user.update({ firstName: name })}
								/>
							</BaseTextInput>

							<IconButton
								iconName="trash"
								buttonStyles={{ marginTop: 25 }}
								onPress={() => {
									setFieldToDelete('name');
									setShowFieldDeleteModal(true);
								}}
							/>
						</View>
					)}

					{username && (
						<View style={{ flexDirection: 'row', gap: 16 }}>
							<BaseTextInput
								label="Username"
								placeholder="Enter your username"
								value={username}
								containerStyles={{ flex: 1 }}
								onChangeText={setUsername}
							>
								<TextButton
									title="Save"
									buttonStyles={{ position: 'absolute', right: 15 }}
									titleStyles={{ textDecorationLine: 'none' }}
									onPress={() => user.update({ username: username })}
								/>
							</BaseTextInput>

							<IconButton
								iconName="trash"
								buttonStyles={{ marginTop: 25 }}
								onPress={() => {
									setFieldToDelete('username');
									setShowFieldDeleteModal(true);
								}}
							/>
						</View>
					)}

					{!phone ? (
						<TextButton
							title="+ Add phone"
							buttonStyles={{
								alignItems: 'center',
								flexDirection: 'row',
								gap: 4,
							}}
							titleStyles={{ textDecorationLine: 'none' }}
							onPress={() => setEditingField('phone')}
						>
							<MaterialIcons
								name="edit"
								color={COLORS.textButton}
								size={18}
							/>
						</TextButton>
					) : (
						<View style={{ flexDirection: 'row', gap: 16 }}>
							<BaseTextInput
								label="Phone number"
								placeholder="Enter your phone number"
								value={phone}
								containerStyles={{ flex: 1 }}
								onChangeText={setPhone}
							>
								<TextButton
									title="Save"
									buttonStyles={{ position: 'absolute', right: 15 }}
									titleStyles={{ textDecorationLine: 'none' }}
									onPress={() => {
										setFieldToDelete('phone');
										setShowFieldDeleteModal(true);
									}}
								/>
							</BaseTextInput>

							<IconButton
								iconName="trash"
								buttonStyles={{ marginTop: 25 }}
								onPress={() => {
									user.update({ unsafeMetadata: { phoneNumber: null } });
									setPhone(''); // Clear local state
									setEditingField(null);
								}}
							/>
						</View>
					)}

					<BaseTextInput
						label="Email"
						value={email}
						labelStyles={{ color: COLORS.white }}
						containerStyles={{ marginTop: 15 }}
						onChangeText={(val) => setEmail(val.toLowerCase())}
					>
						<TextButton
							title="Save"
							buttonStyles={{ position: 'absolute', right: 15 }}
							titleStyles={{ textDecorationLine: 'none' }}
							onPress={onConfirmEmail}
						/>
					</BaseTextInput>

					{!username && (
						<TextButton
							title="+ Add username"
							buttonStyles={{
								alignItems: 'center',
								flexDirection: 'row',
								gap: 4,
							}}
							titleStyles={{ textDecorationLine: 'none' }}
							onPress={() => setEditingField('username')}
						>
							<MaterialIcons
								name="edit"
								color={COLORS.textButton}
								size={18}
							/>
						</TextButton>
					)}
				</View>
			</TouchableWithoutFeedback>

			<ConfirmationModal
				visible={showFieldDeleteModal}
				title={`Delete ${fieldToDelete}`}
				message={`Are you sure you want to delete your ${fieldToDelete}?`}
				onCancel={() => {
					setShowFieldDeleteModal(false);
					setFieldToDelete(null);
				}}
				onConfirm={async () => {
					await confirmFieldDelete();
				}}
			/>

			{/* Edit Modal */}
			<EditingModal
				visible={editingField !== null}
				label={
					editingField === 'name'
						? 'Enter your name'
						: editingField === 'username'
							? 'Enter username'
							: 'Enter phone number'
				}
				placeholder={
					editingField === 'name'
						? 'Name'
						: editingField === 'username'
							? 'Username'
							: 'Phone Number'
				}
				value={
					editingField === 'name'
						? (name ?? '')
						: editingField === 'username'
							? (username ?? '')
							: (phone ?? '')
				}
				onChange={
					editingField === 'name'
						? setName
						: editingField === 'username'
							? setUsername
							: setPhone
				}
				onSave={handleSave}
				onCancel={() => setEditingField(null)}
			/>

			<BaseButton
				title="Delete profile"
				containerStyles={{ marginHorizontal: 32 }}
				buttonStyles={{ padding: 15 }}
				onPress={() => {
					setFieldToDelete('account');
					setShowFieldDeleteModal(true);
				}}
			/>

			<BaseBottomSheetModal
				ref={bottomSheetRef}
				setVerificationCode={setVerificationCode}
				emailToVerify={emailToVerify}
				onSuccess={() => {
					bottomSheetRef.current?.close();
					setEmailToVerify(null);
					setVerificationCode('');
				}}
				onPress={handleVerifyEmail}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},

	avatarWrapper: {
		alignSelf: 'center',
		alignItems: 'center',
		marginBottom: 24,
	},

	avatar: {
		width: 140,
		height: 140,
		borderRadius: 70,
		backgroundColor: '#ccc',
	},

	changeAvatarText: {
		color: COLORS.textButton,
		fontSize: 18,
		fontWeight: '500',
	},
});

export default EditAccount;
