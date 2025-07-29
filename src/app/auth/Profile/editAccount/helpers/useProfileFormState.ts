// useProfileFormState.ts
import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { EmailAddressResource } from '@clerk/types';

export type ProfileFormState = {
	image: string | null;
	setImage: (val: string | null) => void;

	name: string;
	setName: (val: string) => void;

	username: string;
	setUsername: (val: string) => void;

	email: string;
	setEmail: (val: string) => void;

	phone: string;
	setPhone: (val: string) => void;

	emailToVerify: EmailAddressResource | null;
	setEmailToVerify: (val: EmailAddressResource | null) => void;

	verificationCode: string;
	setVerificationCode: (val: string) => void;

	pendingVerification: boolean;
	setPendingVerification: (val: boolean) => void;

	error: string;
	setError: (val: string) => void;

	editingField: 'avatar' | 'name' | 'username' | 'phone' | 'account' | null;
	setEditingField: (val: ProfileFormState['editingField']) => void;
};

const useProfileFormState = (): ProfileFormState => {
	const { user } = useUser();

	const [image, setImage] = useState<string | null>(null);
	const [name, setName] = useState(user?.firstName ?? '');
	const [username, setUsername] = useState(user?.username ?? '');
	const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress ?? '');
	const [phone, setPhone] = useState(user?.unsafeMetadata?.phoneNumber?.toString() ?? '');

	const [emailToVerify, setEmailToVerify] = useState<EmailAddressResource | null>(null);
	const [verificationCode, setVerificationCode] = useState('');
	const [pendingVerification, setPendingVerification] = useState(false);
	const [error, setError] = useState('');

	const [editingField, setEditingField] = useState<
		'avatar' | 'name' | 'username' | 'phone' | 'account' | null
	>(null);

	return {
		image,
		setImage,
		name,
		setName,
		username,
		setUsername,
		email,
		setEmail,
		phone,
		setPhone,
		emailToVerify,
		setEmailToVerify,
		verificationCode,
		setVerificationCode,
		pendingVerification,
		setPendingVerification,
		error,
		setError,
		editingField,
		setEditingField,
	};
};

export default useProfileFormState;
