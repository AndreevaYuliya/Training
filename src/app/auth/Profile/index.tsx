import React, { FC } from 'react';

import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useAuth, useUser } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';
import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';

import COLORS from '@/src/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Profile: FC = () => {
	const insets = useSafeAreaInsets();

	const { user } = useUser();
	const { signOut } = useAuth();

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
				title="Profile"
			>
				<IconButton
					iconName="settings"
					onPress={() => router.push('/auth/Profile/editAccount/EditProfile')}
				/>
			</Header>

			<View style={styles.contentContainer}>
				<Image
					source={{ uri: user.imageUrl || undefined }}
					style={styles.avatar}
				/>
				{user.firstName && <Text style={styles.firstName}>{user.firstName}</Text>}

				{user.username && <Text style={styles.userInfo}>@{user.username}</Text>}

				<Text style={styles.userInfo}>Email: {user.emailAddresses[0].emailAddress}</Text>

				{/* {user.unsafeMetadata?.phoneNumber ? (
					<Text style={styles.userInfo}>
						Phone number: {String(user.unsafeMetadata.phoneNumber)}
					</Text>
				) : null} */}
			</View>
			<BaseButton
				title="Logout"
				buttonStyles={styles.marginHorizontal}
				onPress={async () => {
					await signOut();
					router.replace('/unauth/signIn');
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	marginHorizontal: {
		marginHorizontal: 16,
	},

	container: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: COLORS.background,
	},

	contentContainer: {
		flex: 1,
		alignItems: 'center',
	},

	avatar: {
		marginTop: 25,
		marginBottom: 10,
		width: 140,
		height: 140,
		borderRadius: 70,
	},

	firstName: {
		fontSize: 28,
		fontWeight: 500,
		color: COLORS.white,
	},

	userInfo: {
		fontSize: 20,
		color: COLORS.white,
		marginTop: 16,
	},
});

export default Profile;
