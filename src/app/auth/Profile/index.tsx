import React, { FC, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { useClerk, useUser } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';

import { BottomSheetModalMethods } from '@/src/components/BaseBottomSheetModal';
import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';
import { COLORS5 } from '@/src/constants/colors';

const Profile: FC = () => {
	const insets = useSafeAreaInsets();

	const { signOut } = useClerk();
	const { user } = useUser();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	// const [emailToVerify, setEmailToVerify] = useState<EmailAddressResource | null>(null);
	// const [verificationCode, setVerificationCode] = useState('');

	const [name, setName] = useState(user?.firstName ?? '');
	const [username, setUserame] = useState(user?.username ?? '');
	const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress ?? '');

	if (!user) {
		return null;
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<Header
				backButton
				title="Profile"
			>
				<IconButton
					iconName="settings"
					onPress={() => router.push('/auth/Profile/EditProfile')}
				/>
			</Header>

			<View
				style={{
					flex: 1,
					margin: 16,
					alignItems: 'center',
				}}
			>
				<Image
					source={{ uri: user.imageUrl || undefined }}
					style={styles.avatar}
				/>
				{user.firstName && (
					<Text style={{ fontSize: 28, color: COLORS5.primaryText }}>{name}</Text>
				)}

				{user.username && (
					<Text style={{ fontSize: 20, color: COLORS5.secondaryText, marginTop: 8 }}>
						@{user.username}
					</Text>
				)}

				<Text style={{ fontSize: 20, color: COLORS5.secondaryText, marginTop: 16 }}>
					Email: {user.emailAddresses[0].emailAddress}
				</Text>

				{user.unsafeMetadata?.phoneNumber ? (
					<Text style={{ fontSize: 20, color: COLORS5.secondaryText, marginTop: 16 }}>
						Phone number: {String(user.unsafeMetadata.phoneNumber)}
					</Text>
				) : null}
			</View>

			<BaseButton
				title="Logout"
				containerStyles={{ marginHorizontal: 32, marginBottom: 32 }}
				buttonStyles={{
					padding: 15,
				}}
				onPress={async () => {
					await signOut();
					router.replace('/unauth/signIn');
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS5.background,
	},
	avatar: {
		width: 140,
		height: 140,
		marginBottom: 24,

		borderRadius: 70,
		backgroundColor: '#ccc',
	},
});

export default Profile;
