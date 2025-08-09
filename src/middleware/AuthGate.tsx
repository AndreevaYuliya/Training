// src/middleware/AuthGate.tsx
import React, { ReactNode, useEffect } from 'react';

import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

import { router, usePathname } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useAuth, useUser } from '@clerk/clerk-expo';

type Props = {
	children: ReactNode;
	requireAuth?: boolean;
};

const AuthGate: React.FC<Props> = ({ children, requireAuth = false }) => {
	const pathname = usePathname();

	const { isLoaded: authLoaded, isSignedIn } = useAuth();
	const { isLoaded: userLoaded, user } = useUser();

	useEffect(() => {
		if (!authLoaded || !userLoaded) {
			return;
		}

		console.log('AuthGate', { isSignedIn, pathname });

		if (isSignedIn) {
			if (pathname.startsWith('/unauth') || pathname === '/') {
				router.replace('/auth/Profile');
			}
		} else {
			if (requireAuth && !pathname.startsWith('/unauth')) {
				router.replace('/unauth/signIn');
			}
		}
	}, [authLoaded, userLoaded, isSignedIn, user, pathname]);

	if (!authLoaded || !userLoaded) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
				<Text>Loading...</Text>
			</View>
		);
	}

	return <>{children}</>;
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default AuthGate;
