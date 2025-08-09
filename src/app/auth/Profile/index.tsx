import React, { FC } from 'react';

import { Image, StyleSheet, Text, View, Alert } from 'react-native';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useAuth, useUser } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';
import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';

import COLORS from '@/src/constants/colors';

const Profile: FC = () => {
	const { user } = useUser();
	const { signOut } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<View style={[styles.container]}>
			<Header
				backButton
				title="Profile"
			>
				<IconButton
					iconName="settings"
					onPress={() => router.push('/auth/Profile/editAccount/EditProfile')}
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
					<Text style={{ fontSize: 28, fontWeight: 500, color: COLORS.white }}>
						{user.firstName}
					</Text>
				)}

				{user.username && (
					<Text style={{ fontSize: 20, color: COLORS.white, marginTop: 8 }}>
						@{user.username}
					</Text>
				)}

				<Text style={{ fontSize: 20, color: COLORS.white, marginTop: 16 }}>
					Email: {user.emailAddresses[0].emailAddress}
				</Text>

				{user.unsafeMetadata?.phoneNumber ? (
					<Text style={{ fontSize: 20, color: COLORS.white, marginTop: 16 }}>
						Phone number: {String(user.unsafeMetadata.phoneNumber)}
					</Text>
				) : null}
			</View>

			<BaseButton
				title="Logout"
				containerStyles={{ marginHorizontal: 32 }}
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
		backgroundColor: COLORS.background,
	},
	avatar: {
		width: 140,
		height: 140,
		marginBottom: 24,
		borderRadius: 70,
	},
});

export default Profile;
