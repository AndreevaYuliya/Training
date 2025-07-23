import React, { FC, useState } from 'react';
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { useClerk, useUser } from '@clerk/clerk-expo';

import Header from '@/src/components/Header';
import TextButton from '@/src/components/buttons/TextButton';

import BaseButton from '@/src/components/buttons/BaseButton';
import COLORS from '@/src/constants/colors';

const Profile: FC = () => {
	const [isEditing, setIsEditing] = useState(false);

	const { user } = useUser();

	const [name, setName] = useState(String(user?.unsafeMetadata.name ?? ''));

	const { signOut } = useClerk();

	const insets = useSafeAreaInsets();

	if (!user) {
		return null;
	}

	const handleChangeAvatar = () => {};

	const handleEditProfile = () => {};

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

				{!isEditing ? (
					<Pressable
						style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
						onPress={() => setIsEditing(true)}
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
							user.update({ unsafeMetadata: { name } });
							setIsEditing(false);
						}}
						autoFocus
					/>
				)}

				{user.username && (
					<Text style={{ fontSize: 18, color: COLORS.blue, marginTop: 4 }}>
						@{user.username}
					</Text>
				)}

				<Text style={{ fontSize: 20, color: COLORS.blue, marginTop: 16 }}>
					Email: {user.emailAddresses[0]?.emailAddress}
				</Text>

				{user.phoneNumbers[0]?.phoneNumber && (
					<Text style={{ fontSize: 20, color: COLORS.blue, marginTop: 16 }}>
						Phonenumber: {user.phoneNumbers[0]?.phoneNumber}
					</Text>
				)}
			</View>
			<BaseButton
				title="Edit profile"
				containerStyles={{ marginHorizontal: 32, marginBottom: 32 }}
				onPress={handleEditProfile}
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
