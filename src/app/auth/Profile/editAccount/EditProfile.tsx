import React from 'react';
import { FC, useRef } from 'react';

import {
	Image,
	Keyboard,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useUser } from '@clerk/clerk-expo';

import useChangeAvatar from './helpers/changeAvatar';
import useFieldDelete from './helpers/useFieldDelete';
import updateProfile from './helpers/editProfile';
import useProfileFormState from './helpers/useProfileFormState';
import updateEmail from './helpers/updateEmail';

import Header from '@/src/components/Header';
import BaseTextInput from '@/src/components/BaseTextInput';

import ConfirmationModal from '@/src/components/modals/ConfirmationModal';
import EmailVerificationBottomSheetModal, {
	BottomSheetModalMethods,
} from '@/src/components/bottomSheetModals/EmailVerificationBottomSheetModal';

import TextButton from '@/src/components/buttons/TextButton';
import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';

import EditingModal from '@/src/components/modals/EditingModal';

import COLORS from '@/src/constants/colors';
import ResetPasswordBottomSheetModal from '@/src/components/bottomSheetModals/ResetPasswordBottomSheetModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditAccount: FC = () => {
	const insets = useSafeAreaInsets();

	const profileForm = useProfileFormState();

	const {
		name,
		setName,
		username,
		setUsername,
		email,
		setEmail,
		phone,
		setPhone,
		editingField,
		setEditingField,
		setVerificationCode,
		error,
	} = profileForm;

	const { bottomSheetRef, onConfirmEmail, handleVerifyEmail } = updateEmail(profileForm);

	const { handleEditProfile } = updateProfile(profileForm);

	const { user } = useUser();

	// const emailVerificationRef = useRef<BottomSheetModalMethods>(null);
	const resetPasswordRef = useRef<BottomSheetModalMethods>(null);

	const { handleChangeAvatar } = useChangeAvatar();

	// Use your custom hook for deleting fields
	const {
		fieldToDelete,
		setFieldToDelete,
		showFieldDeleteModal,
		setShowFieldDeleteModal,
		confirmFieldDelete,
	} = useFieldDelete(profileForm);

	console.log('aaa', error);

	if (!user) {
		return null;
	}

	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: Platform.OS === 'ios' ? insets.top : 32,
					paddingBottom: Platform.OS === 'ios' ? insets.bottom : 15,
				},
			]}
		>
			<Header
				backButton
				title="Edit Profile"
			/>

			<View style={styles.avatarContainer}>
				<Image
					source={{ uri: user.imageUrl || undefined }}
					style={styles.avatar}
				/>
				<TextButton
					title="Change avatar"
					onPress={handleChangeAvatar}
					buttonStyles={styles.row}
				>
					<MaterialIcons
						name="edit"
						color={COLORS.textButton}
						size={18}
					/>
				</TextButton>

				<IconButton
					iconName="cross"
					buttonStyles={styles.avatarDeleteButton}
					onPress={() => {
						setFieldToDelete('avatar');
						setShowFieldDeleteModal(true);
					}}
				/>
			</View>

			{name && (
				<View style={styles.row}>
					<BaseTextInput
						label="Name"
						placeholder="Enter your name"
						value={name}
						containerStyles={styles.flex}
						onChangeText={setName}
					>
						<TextButton
							title="Save"
							buttonStyles={styles.saveButtonContainer}
							onPress={() => user.update({ firstName: name })}
						/>
					</BaseTextInput>

					<IconButton
						iconName="trash"
						buttonStyles={styles.marginTop}
						onPress={() => {
							setFieldToDelete('name');
							setShowFieldDeleteModal(true);
						}}
					/>
				</View>
			)}

			{username && (
				<View style={styles.row}>
					<BaseTextInput
						label="Username"
						placeholder="Enter your username"
						value={username}
						containerStyles={styles.flex}
						onChangeText={setUsername}
					>
						<TextButton
							title="Save"
							buttonStyles={styles.saveButtonContainer}
							onPress={() => user.update({ username: username })}
						/>
					</BaseTextInput>

					<IconButton
						iconName="trash"
						buttonStyles={styles.marginTop}
						onPress={() => {
							setFieldToDelete('username');
							setShowFieldDeleteModal(true);
						}}
					/>
				</View>
			)}

			{/* {phone && (
						<View style={styles.row}>
							<BaseTextInput
								label="Phone number"
								placeholder="Enter your phone number"
								value={phone}
								containerStyles={styles.flex}
								onChangeText={setPhone}
							>
								<TextButton
									title="Save"
									buttonStyles={styles.saveButtonContainer}
									onPress={() => {
										user.update({ unsafeMetadata: { phoneNumber: phone } });
									}}
								/>
							</BaseTextInput>

							<IconButton
								iconName="trash"
								buttonStyles={styles.marginTop}
								onPress={() => {
									setFieldToDelete('phone');
									setShowFieldDeleteModal(true);
								}}
							/>
						</View>
					)} */}

			<BaseTextInput
				label="Email"
				value={email}
				containerStyles={styles.paddingHorizontal}
				labelStyles={error && styles.textError}
				inputStyles={error && styles.inpuptError}
				onChangeText={(val) => setEmail(val.toLowerCase())}
			>
				<TextButton
					title="Save"
					buttonStyles={styles.saveButtonContainer}
					onPress={onConfirmEmail}
				/>
			</BaseTextInput>

			{error && <Text style={styles.textError}>{error}</Text>}

			{!name && (
				<TextButton
					title="+ Add name"
					buttonStyles={styles.addButtonContainer}
					onPress={() => setEditingField('name')}
				>
					<MaterialIcons
						name="edit"
						color={COLORS.textButton}
						size={18}
					/>
				</TextButton>
			)}

			{!username && (
				<TextButton
					title="+ Add username"
					buttonStyles={styles.addButtonContainer}
					onPress={() => setEditingField('username')}
				>
					<MaterialIcons
						name="edit"
						color={COLORS.textButton}
						size={18}
					/>
				</TextButton>
			)}

			{/* {!phone && (
						<TextButton
							title="+ Add phone"
							buttonStyles={styles.addButtonContainer}
							onPress={() => setEditingField('phone')}
						>
							<MaterialIcons
								name="edit"
								color={COLORS.textButton}
								size={18}
							/>
						</TextButton>
					)} */}
			{/* </View> */}
			{/* </TouchableWithoutFeedback> */}

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
				onSave={handleEditProfile}
				onCancel={() => setEditingField(null)}
			/>

			<View style={styles.buttonsContainer}>
				{/* <TextButton
					title="Change password"
					onPress={() => resetPasswordRef.current?.show()}
				/> */}

				<BaseButton
					title="Delete profile"
					onPress={() => {
						setFieldToDelete('account');
						setShowFieldDeleteModal(true);
					}}
				/>
			</View>

			<EmailVerificationBottomSheetModal
				ref={bottomSheetRef}
				setVerificationCode={setVerificationCode}
				err={error}
				onPress={handleVerifyEmail}
			/>

			<ResetPasswordBottomSheetModal ref={resetPasswordRef} />
		</View>
	);
};

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},

	row: {
		paddingHorizontal: 16,
		flexDirection: 'row',
		gap: 4,
		alignItems: 'center',
		marginBottom: 15,
	},

	marginTop: {
		marginTop: 25,
	},

	paddingHorizontal: {
		paddingHorizontal: 16,
	},

	container: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: COLORS.background,
	},

	avatarContainer: {
		marginTop: 25,
		marginBottom: 10,
		alignSelf: 'center',
		alignItems: 'center',
	},

	avatar: {
		marginBottom: 8,
		width: 140,
		height: 140,
		borderRadius: 70,
		backgroundColor: '#ccc',
	},

	avatarDeleteButton: {
		position: 'absolute',
		right: 8,
		top: 100,
		// shadowColor: COLORS.textButton,
		// shadowOffset: { width: 15, height: 15 },
		// shadowOpacity: 1,
		// shadowRadius: 5,
		// elevation: 5,

		backgroundColor: COLORS.background,
		borderRadius: 16,
		borderColor: COLORS.white,
		borderWidth: 1,
	},

	saveButtonContainer: {
		position: 'absolute',
		right: 15,
	},

	addButtonContainer: {
		marginTop: 15,
		alignItems: 'center',
		flexDirection: 'row',
		gap: 4,
	},

	buttonsContainer: {
		flex: 1,
		paddingHorizontal: 16,

		justifyContent: 'flex-end',
		gap: 15,
	},

	inpuptError: {
		borderWidth: 1,
		borderColor: COLORS.red,
	},

	textError: {
		color: COLORS.red,
		fontSize: 16,
		marginBottom: 15,
	},
});

export default EditAccount;
