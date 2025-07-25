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

import { useClerk, useSignUp, useUser } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';
import TextButton from '@/src/components/buttons/TextButton';

import BaseButton from '@/src/components/buttons/BaseButton';
import COLORS from '@/src/constants/colors';
import BaseBottomSheetModal, {
	BottomSheetModalMethods,
} from '@/src/components/BaseBottomSheetModal';
import updateUserEmail from '@/src/hooks/updateUserEmail';
import { EmailAddressResource } from '@clerk/types';

const Profile: FC = () => {
	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingUsername, setIsEditingUsername] = useState(false);
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [isEditingPhonenumber, setIsEditingPhonenumber] = useState(false);

	const [error, setError] = useState('');
	const [emailToVerify, setEmailToVerify] = useState<EmailAddressResource | string | null>(null);
	const [verificationCode, setVerificationCode] = useState('');

	const { user } = useUser();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	console.log('user.firstName:', user?.firstName); // Основное имя
	console.log('user.publicMetadata:', user?.publicMetadata); // Общее мета
	console.log('user.unsafeMetadata:', user?.unsafeMetadata); // Польз. мета
	// const [name, setName] = useState(String(user?.unsafeMetadata.name ?? ''));

	const [name, setName] = useState(user?.firstName ?? '');
	const [username, setUserame] = useState(user?.username ?? '');
	const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress ?? '');
	const [pendingVerification, setPendingVerification] = useState(false);

	const { signOut } = useClerk();

	const { isLoaded, signUp, setActive } = useSignUp();

	const insets = useSafeAreaInsets();

	if (!user) {
		return null;
	}

	const handleChangeAvatar = () => {};

	const onConfirmPress = async () => {
		if (!user) return;

		try {
			const newEmailObj = await user.createEmailAddress({ email });

			await newEmailObj.prepareVerification({ strategy: 'email_code' });

			setEmailToVerify(newEmailObj);
			bottomSheetRef.current?.show('changeEmail');
		} catch (err: any) {
			console.error('Failed to send verification code:', err);
			setError(err.errors?.[0]?.message || 'Something went wrong');
		}
	};

	// В родителе (Profile.tsx или где у тебя состояние и модалка):
	const handleVerifyEmail = async () => {
		if (!emailToVerify || typeof emailToVerify === 'string') {
			setError('Invalid email to verify');
			return;
		}

		try {
			await emailToVerify.attemptVerification({ code: verificationCode });
			await user.update({ primaryEmailAddressId: emailToVerify.id });

			setPendingVerification(false);
			setEmailToVerify(null);
			setVerificationCode('');
			bottomSheetRef.current?.close();
		} catch (err: any) {
			console.error('Email verification failed:', err);
			setError(err.errors?.[0]?.message || 'Verification failed');
		}
	};

	// Email onBlur handler
	const handleEmailBlur = async () => {
		if (!user) return;

		console.log('Email input blurred with value:', email);

		try {
			const newEmailObj = await updateUserEmail(user, email);

			if (newEmailObj) {
				setPendingVerification(true);
				// bottomSheetRef.current?.show('changeEmail');
			} else {
				alert('Email is the same or already used');
			}

			setIsEditingEmail(false);
		} catch (error) {
			console.error('Failed to update email:', error);
			// setError('Failed to update email. Please try again.');
		}
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
						<>
							<TextInput
								style={{
									fontSize: 28,
									color: COLORS.white,
								}}
								value={email}
								onChangeText={(prevEmail) => setEmail(prevEmail.toLowerCase())}
								onFocus={() => setIsEditingEmail(true)}
								onBlur={handleEmailBlur}
								autoFocus
							/>

							<BaseButton
								title="Save Email"
								onPress={onConfirmPress}
							/>
						</>
					)}

					{/* <Text style={{ fontSize: 20, color: COLORS.blue, marginTop: 16 }}>
						Email: {user.emailAddresses[0]?.emailAddress}
					</Text> */}

					{String(user.unsafeMetadata?.phoneNumber) && (
						<Text style={{ fontSize: 20, color: COLORS.blue, marginTop: 16 }}>
							Phonenumber:{' '}
							{String(user.unsafeMetadata?.phoneNumber || 'Phone not provided')}
						</Text>
					)}
				</View>
			</TouchableWithoutFeedback>

			<BaseButton
				title="Delete profile"
				containerStyles={{ marginHorizontal: 32, marginBottom: 32 }}
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
