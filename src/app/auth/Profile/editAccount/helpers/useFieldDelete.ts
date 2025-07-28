// src/hooks/useFieldDelete.ts
import { useClerk, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';

type Field = 'avatar' | 'name' | 'username' | 'phone' | 'account' | null;

const useFieldDelete = (
	setImage: (val: null) => void,
	setName: (val: string) => void,
	setUsername: (val: string) => void,
	setPhone: (val: string) => void,
	setEditingField: (val: Field) => void
) => {
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
				await user.update({ unsafeMetadata: { ...user.unsafeMetadata, phoneNumber: '' } });
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
