import React, { FC, useRef, useState } from 'react';
import {
	Image,
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
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
import BaseButton from '@/src/components/buttons/BaseButton';
import COLORS from '@/src/constants/colors';
import updateUserEmail from '@/src/hooks/updateUserEmail';
import { EmailAddressResource } from '@clerk/types';

const Profile: FC = () => {
	const insets = useSafeAreaInsets();

	const { signOut } = useClerk();
	const { user } = useUser();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	const [editingField, setEditingField] = useState<'name' | 'username' | 'phone' | null>(null);

	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingUsername, setIsEditingUsername] = useState(false);
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [isEditingPhonenumber, setIsEditingPhonenumber] = useState(false);

	const [error, setError] = useState('');
	const [emailToVerify, setEmailToVerify] = useState<EmailAddressResource | null>(null);
	const [verificationCode, setVerificationCode] = useState('');

	// console.log('user.firstName:', user?.firstName); // Основное имя
	// console.log('user.publicMetadata:', user?.publicMetadata); // Общее мета
	// console.log('user.unsafeMetadata:', user?.unsafeMetadata); // Польз. мета

	const [name, setName] = useState(user?.firstName ?? '');
	const [username, setUserame] = useState(user?.username ?? '');
	const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress ?? '');
	const [pendingVerification, setPendingVerification] = useState(false);

	if (!user) {
		return null;
	}

	const handleChangeAvatar = () => {};

	const onConfirmPress = async () => {
		if (!user) return;

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

	// В родителе (Profile.tsx или где у тебя состояние и модалка):
	const handleVerifyEmail = async () => {
		if (!user || !emailToVerify || !verificationCode) return;

		try {
			await emailToVerify.attemptVerification({ code: verificationCode });

			await user.update({ primaryEmailAddressId: emailToVerify.id });

			// delete old emails
			const oldEmails = user.emailAddresses.filter((email) => email.id !== emailToVerify.id);
			for (const email of oldEmails) {
				await email.destroy();
			}

			setPendingVerification(false);
			setEmailToVerify(null);
			bottomSheetRef.current?.close();
		} catch (err: any) {
			console.error('Verification error:', err);
			setError(err.errors?.[0]?.message || 'Invalid code');
		}
	};

	// Email onBlur handler
	const handleCancelEmailChange = async () => {
		if (emailToVerify) {
			try {
				// Clean up the unverified email if user cancels
				await emailToVerify.destroy();
			} catch (err) {
				console.warn('Failed to destroy unverified email:', err);
			}
		}

		setEmailToVerify(null);
		setPendingVerification(false);
		setIsEditingEmail(false);
		bottomSheetRef.current?.close();
	};

	const handleDeleteProfile = async () => {
		try {
			await user.delete(); // Deletes the user
			await signOut(); // Clears local session/cache if still present
			router.replace('/unauth/signIn');
		} catch (error) {
			console.error('Failed to delete profile:', error);
		}
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<Header
				backButton
				title="Profile"
			>
				<TextButton
					title="Logout"
					onPress={async () => {
						await signOut();
						router.replace('/unauth/signIn');
					}}
				/>
			</Header>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
					style={{
						flex: 1,
						// flexDirection: "row",
						margin: 16,
						alignItems: 'center',
						// justifyContent: 'flex-start',
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
						<Text style={styles.changeAvatarText}>Change avatar</Text>
					</TouchableOpacity>

					{!isEditingName ? (
						<Pressable
							style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
							onPress={() => setIsEditingName(true)}
						>
							<Text style={{ fontSize: 28, color: COLORS.white }}>{name}</Text>
						</Pressable>
					) : (
						<TextInput
							style={{
								fontSize: 28,
								color: COLORS.white,
							}}
							value={name}
							onChangeText={setName}
							onBlur={() => {
								user.update({ firstName: name });
								setIsEditingName(false);
							}}
							autoFocus
						/>
					)}

					{!isEditingUsername ? (
						<Pressable
							style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
							onPress={() => setIsEditingUsername(true)}
						>
							{user.username && (
								<Text style={{ fontSize: 18, color: COLORS.blue, marginTop: 4 }}>
									@{user.username}
								</Text>
							)}
						</Pressable>
					) : (
						<TextInput
							style={{
								fontSize: 28,
								color: COLORS.white,
							}}
							value={username}
							onChangeText={setUserame}
							onBlur={() => {
								user.update({ username: username });
								setIsEditingUsername(false);
							}}
							autoFocus
						/>
					)}

					{!isEditingEmail ? (
						<Pressable
							style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
							onPress={() => setIsEditingEmail(true)}
						>
							{user.emailAddresses.map((emailObj, index) => (
								<Text
									key={emailObj.id || index}
									style={{ fontSize: 20, color: COLORS.blue, marginTop: 16 }}
								>
									Email: {emailObj.emailAddress}
								</Text>
							))}
						</Pressable>
					) : (
						<View>
							<TextInput
								style={{
									fontSize: 28,
									color: COLORS.white,
								}}
								value={email}
								onChangeText={(prevEmail) => setEmail(prevEmail.toLowerCase())}
								onFocus={() => setIsEditingEmail(true)}
								// onBlur={handleCancelEmailChange}
								autoFocus
							/>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<BaseButton
									title="Save Email"
									buttonStyles={{ padding: 15 }}
									onPress={onConfirmPress}
								/>

								<BaseButton
									title="Cancel"
									buttonStyles={{ padding: 15 }}
									onPress={handleCancelEmailChange}
								/>
							</View>
						</View>
					)}

					{user.unsafeMetadata?.phoneNumber ? (
						<Text style={{ fontSize: 20, color: COLORS.blue, marginTop: 16 }}>
							Phone number: {String(user.unsafeMetadata.phoneNumber)}
						</Text>
					) : null}
				</View>
			</TouchableWithoutFeedback>

			<View style={{ flexDirection: 'row' }}>
				<BaseButton
					title="Edit profile"
					containerStyles={{ marginHorizontal: 32, marginBottom: 32 }}
					buttonStyles={{ padding: 15 }}
					onPress={() => {
						console.log('navigating');
						router.push('/auth/Profile/EditProfile');
					}}
				/>

				<BaseButton
					title="Delete profile"
					containerStyles={{ marginHorizontal: 32, marginBottom: 32 }}
					buttonStyles={{ padding: 15 }}
					onPress={handleDeleteProfile}
				/>
			</View>
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
		marginTop: 8,
		color: COLORS.white,
		fontSize: 14,
		fontWeight: '500',
	},
});

export default Profile;
