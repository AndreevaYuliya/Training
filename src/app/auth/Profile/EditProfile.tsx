import React, { FC, useRef, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { useClerk, useUser } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';
import TextButton from '@/src/components/buttons/TextButton';

import BaseBottomSheetModal, {
	BottomSheetModalMethods,
} from '@/src/components/BaseBottomSheetModal';
import BaseModal from '@/src/components/BaseModal';
import BaseTextInput from '@/src/components/BaseTextInput';
import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';
import updateUserEmail from '@/src/hooks/updateUserEmail';
import { EmailAddressResource } from '@clerk/types';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/src/constants/colors';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const EditProfile: FC = () => {
	const insets = useSafeAreaInsets();

	const { signOut } = useClerk();
	const { isLoaded, user } = useUser();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	const [editingField, setEditingField] = useState<'name' | 'username' | 'phone' | null>(null);

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

	const handleChangeAvatar = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images', 'videos'],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			const asset = result.assets[0]; // ✅ This defines 'asset'
			setImage(asset.uri);
			await uploadToClerk(asset.uri);
		}
	};

	const uploadToClerk = async (uri: string) => {
		if (!isLoaded || !user) return;

		try {
			// 👇 Resize and compress image to reduce size
			const manipulatedImage = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 512 } }], // Resize to 512px width, keep aspect ratio
				{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
			);

			const base64 = manipulatedImage.base64;
			if (!base64) {
				throw new Error('Failed to convert image to base64');
			}

			const dataUrl = `data:image/jpeg;base64,${base64}`;

			await user.setProfileImage({ file: dataUrl });

			Alert.alert('Success', 'Profile image updated!');
		} catch (error) {
			console.error('Upload failed', error);
			Alert.alert('Error', 'Failed to upload image');
		}
	};

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

	const handleFieldDelete = (field: 'name' | 'username' | 'phone') => {
		if (!user) {
			return;
		}

		Alert.alert(`Delete ${field}`, `Are you sure you want to delete your ${field}?`, [
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					try {
						if (field === 'name') {
							await user.update({ firstName: '' });
							setName('');
						} else if (field === 'username') {
							await user.update({ username: '' });
							setUsername('');
						} else if (field === 'phone') {
							await user.update({ unsafeMetadata: { phoneNumber: phone } });
							setPhone('');
						}

						setEditingField(null);
					} catch (err) {
						console.error(`Failed to delete ${field}`, err);
					}
				},
			},

			{ text: 'Cancel', style: 'cancel' },
		]);
	};

	const handleDeleteProfile = async () => {
		if (!user) {
			return;
		}

		Alert.alert('Delete account', 'Are you sure you want to delete your account?', [
			{
				text: 'Delete',
				style: 'destructive',
				onPress: async () => {
					try {
						await user.delete(); // Deletes the user
						await signOut(); // Clears local session/cache if still present
						router.replace('/unauth/signIn');
					} catch (error) {
						console.error('Failed to delete profile:', error);
					}
				},
			},
			{ text: 'Cancel', style: 'cancel' },
		]);
	};

	if (!user) {
		return null;
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
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

						<View
							style={{
								backgroundColor: 'red',
								width: 30,
								height: 30,
								position: 'absolute',
								right: 5,
								top: 5,
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
								onPress={() => handleFieldDelete('name')}
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
								onPress={() => handleFieldDelete('username')}
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
									onPress={() => handleFieldDelete('phone')}
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

			{/* Edit Modal */}
			<BaseModal
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

			<BaseBottomSheetModal
				ref={bottomSheetRef}
				setVerificationCode={setVerificationCode}
				emailToVerify={emailToVerify}
				onSuccess={() => {
					setEmailToVerify(null);
					setVerificationCode('');
				}}
				onPress={handleVerifyEmail}
			/>

			<BaseButton
				title="Delete profile"
				containerStyles={{ marginHorizontal: 32, marginBottom: 32 }}
				buttonStyles={{ padding: 15 }}
				onPress={handleDeleteProfile}
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
				onPress={handleVerifyEmail} // <- вот здесь передаём функцию верификации
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
		// marginTop: 8,
		color: COLORS.textButton,
		fontSize: 18,
		fontWeight: '500',
	},
});

export default EditProfile;
