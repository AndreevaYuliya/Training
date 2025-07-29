import React, { FC } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useClerk, useUser } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';

import BaseButton from '@/src/components/buttons/BaseButton';
import IconButton from '@/src/components/buttons/IconButton';
import COLORS from '@/src/constants/colors';

const Profile: FC = () => {
	const { signOut } = useClerk();
	const { user } = useUser();

	const handleLogout = async () => {
		Alert.alert('Logout pressed');
		const provider = await SecureStore.getItemAsync('provider');

		console.log('logout', provider);

		// Всегда вызываем signOut
		await signOut();

		if (provider && provider !== 'email') {
			// Провайдерный вход — просто блокируем приложение
			await SecureStore.setItemAsync('locked', 'true');
			router.replace('/unauth/signIn');
		} else {
			// Email/password — полноценный logout
			await signOut();
			// await SecureStore.deleteItemAsync('credentials');
			await SecureStore.setItemAsync('locked', 'true'); // <— ключевой момент
			// await SecureStore.deleteItemAsync('provider');
			router.replace('/unauth/signIn');
		}
	};

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
				// onPress={async () => {
				// 	await signOut();
				// 	router.replace('/unauth/signIn');
				// }}

				onPress={handleLogout}
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
