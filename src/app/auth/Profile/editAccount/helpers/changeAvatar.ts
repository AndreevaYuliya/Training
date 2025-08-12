import { Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { useUser } from '@clerk/clerk-expo';

import useProfileFormState from './useProfileFormState';

const changeAvatar = () => {
	const { setImage } = useProfileFormState();

	const { isLoaded, user } = useUser();

	const handleChangeAvatar = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
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
		} catch (error) {
			console.error('Image picker error:', error);
			Alert.alert('Error', 'Something went wrong while selecting image');

			return null;
		}
	};

	const uploadToClerk = async (uri: string) => {
		if (!isLoaded || !user) {
			return null;
		}

		try {
			// 👇 Resize image to 512px width
			const context = ImageManipulator.ImageManipulator.manipulate(uri).resize({
				width: 512,
			});

			// 👇 Render the intermediate image
			const intermediate = await context.renderAsync();

			// 👇 Save with compression and base64 output
			const manipulatedImage = await intermediate.saveAsync({
				compress: 0.7,
				format: ImageManipulator.SaveFormat.JPEG,
				base64: true,
			});

			const base64 = manipulatedImage.base64;

			if (!base64) {
				throw new Error('Failed to convert image to base64');
			}

			const dataUrl = `data:image/jpeg;base64,${base64}`;

			// 👇 Upload to Clerk
			await user.setProfileImage({ file: dataUrl });

			Alert.alert('Success', 'Profile image updated!');
		} catch (error) {
			console.error('Upload failed', error);
			Alert.alert('Error', 'Failed to upload image');

			return null;
		}
	};
	return { handleChangeAvatar };
};

export default changeAvatar;
