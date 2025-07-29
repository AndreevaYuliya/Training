// src/hooks/useFieldDelete.ts
import { useClerk, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';

import { ProfileFormState } from './useProfileFormState';

type Field = 'avatar' | 'name' | 'username' | 'phone' | 'account' | null;

const useFieldDelete = (profileForm: ProfileFormState) => {
	const { setImage, setName, setUsername, setPhone, setEditingField } = profileForm;

	const { signOut } = useClerk();

	const { user } = useUser();

	const [showFieldDeleteModal, setShowFieldDeleteModal] = useState(false);
	const [fieldToDelete, setFieldToDelete] = useState<Field>(null);

	const confirmFieldDelete = async () => {
		if (!user || !fieldToDelete) return;

		try {
			if (fieldToDelete === 'avatar') {
				await user.setProfileImage({ file: null });
				setImage(null);
			} else if (fieldToDelete === 'name') {
				await user.update({ firstName: '' });
				setName('');
			} else if (fieldToDelete === 'username') {
				await user.update({ username: '' });
				setUsername('');
			} else if (fieldToDelete === 'phone') {
				user.update({ unsafeMetadata: { phoneNumber: null } });
				setPhone('');
			} else if (fieldToDelete === 'account') {
				await user.delete();
				await signOut();

				router.replace('/unauth/signIn');
			}
			setEditingField(null);
		} catch (err) {
			console.error(`Failed to delete ${fieldToDelete}`, err);
		} finally {
			setShowFieldDeleteModal(false);
			setFieldToDelete(null);
		}
	};

	return {
		showFieldDeleteModal,
		setShowFieldDeleteModal,
		fieldToDelete,
		setFieldToDelete,
		confirmFieldDelete,
	};
};

export default useFieldDelete;
