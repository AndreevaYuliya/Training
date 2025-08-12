import { useRef } from 'react';

import { useUser } from '@clerk/clerk-expo';

import updateUserEmail from '@/src/hooks/updateUserEmail';

import { BottomSheetModalMethods } from '@/src/components/bottomSheetModals/EmailVerificationBottomSheetModal';

import { ProfileFormState } from './useProfileFormState';

const updateEmail = (params: ProfileFormState) => {
	const {
		email,
		emailToVerify,
		setEmailToVerify,
		verificationCode,
		setPendingVerification,
		setError,
	} = params;

	const { user } = useUser();

	const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

	const onConfirmEmail = async () => {
		if (!user) {
			return null;
		}

		try {
			console.log('email', email);
			const newEmailObj = await updateUserEmail(user, email);

			if (newEmailObj) {
				setEmailToVerify(newEmailObj);
				setPendingVerification(true);

				bottomSheetRef.current?.show();
			}
		} catch (err: any) {
			console.error('Failed to send verification code:', err);
			console.log('444', err.errors?.[0]?.longMesssage || err.message);
			setError(err.errors?.[0]?.longMesssage || err.message);
		}
	};

	const handleVerifyEmail = async () => {
		console.log('verificationCode', verificationCode);

		if (!user || !emailToVerify || !verificationCode) {
			return null;
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
			setError(err.errors?.[0]?.message);
		}
	};

	return { bottomSheetRef, onConfirmEmail, handleVerifyEmail };
};

export default updateEmail;
