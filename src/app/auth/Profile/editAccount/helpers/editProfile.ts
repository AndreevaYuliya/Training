import { Alert, Keyboard } from 'react-native';

import { useUser } from '@clerk/clerk-expo';

import { ProfileFormState } from './useProfileFormState';

const editProfile = (profileForm: ProfileFormState) => {
	const { user } = useUser();

	const handleEditProfile = async () => {
		const { name, username, phone, editingField, setEditingField } = profileForm;

		if (!user) {
			return;
		}

		try {
			if (editingField === 'name' && name) {
				await user.update({ firstName: name });
			} else if (editingField === 'username' && username) {
				await user.update({ username });
			} else if (editingField === 'phone' && phone) {
				await user.update({
					unsafeMetadata: {
						...user.unsafeMetadata,
						phoneNumber: phone,
					},
				});
			}

			Keyboard.dismiss(); // Optional: hide keyboard after save

			setEditingField(null);
		} catch (error: unknown) {
			let message = 'Unknown error occurred';

			if (error instanceof Error) {
				message = error.message;
			}
			Alert.alert('Update Failed', message);
		}
	};

	return { handleEditProfile };
};

export default editProfile;
