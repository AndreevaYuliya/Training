import React, { useEffect } from 'react';

import { Stack, usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useAuth } from '@clerk/clerk-expo';

const UnauthLayout = () => {
	const { isLoaded, isSignedIn } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const checkProvider = async () => {
			if (isLoaded && isSignedIn) {
				router.replace('/auth/Profile'); // or lowercase if needed
			}
		};

		checkProvider();
	}, [isLoaded, isSignedIn]);

	return <Stack screenOptions={{ headerShown: false }}></Stack>;
};

export default UnauthLayout;
