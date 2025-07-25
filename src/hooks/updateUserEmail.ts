import { EmailAddressResource, UserResource } from '@clerk/types';

// Update user email with retries
const updateUserEmail = async (
	user: UserResource,
	newEmail: string,
): Promise<EmailAddressResource | null> => {
	try {
		const currentPrimary = user.primaryEmailAddress?.emailAddress;

		if (newEmail && newEmail !== currentPrimary) {
			console.log('Creating new email address...');
			const newEmailObj = await user.createEmailAddress({ email: newEmail });
			console.log('Create email result:', newEmailObj);

			await newEmailObj.prepareVerification({ strategy: 'email_code' });

			return newEmailObj;
		}

		return null;
	} catch (error) {
		console.error('Email update error:', error);
		throw error;
	}
};

export default updateUserEmail;
