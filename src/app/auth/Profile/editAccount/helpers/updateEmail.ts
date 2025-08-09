import { useRef } from 'react';

import { useUser } from '@clerk/clerk-expo';

import updateUserEmail from '@/src/hooks/updateUserEmail';

import { BottomSheetModalMethods } from '@/src/components/BaseBottomSheetModal';

import useProfileFormState from './useProfileFormState';

const updateEmail = () => {
	const {
		email,
		emailToVerify,
		setEmailToVerify,
		verificationCode,
		setPendingVerification,
		setError,
	} = useProfileFormState();

	const { user } = useUser();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	const onConfirmEmail = async () => {
		if (!user) {
			return;
		}

		try {
			const newEmailObj = await updateUserEmail(user, email);

			if (newEmailObj) {
				setEmailToVerify(newEmailObj);
				setPendingVerification(true);

				bottomSheetRef.current?.show('changeEmail');
			}
		} catch (err: any) {
			console.error('Failed to send verification code:', err);
			setError(err.errors?.[0]?.message || 'Something went wrong');
		}
	};

	const handleVerifyEmail = async () => {
		if (!user || !emailToVerify || !verificationCode) {
			return;
		}

		try {
			await emailToVerify.attemptVerification({ code: verificationCode });

			await user.update({ primaryEmailAddressId: emailToVerify.id });

			// Delete old emails
			for (const e of user.emailAddresses.filter((e) => e.id !== emailToVerify.id)) {
				await e.destroy();
			}

			setPendingVerification(false);
			setEmailToVerify(null);

			bottomSheetRef.current?.close();
		} catch (err: any) {
			console.error('Verification error:', err);
			setError(err.errors?.[0]?.message || 'Invalid code');
		}
	};

	return { onConfirmEmail, handleVerifyEmail };
};

export default updateEmail;
