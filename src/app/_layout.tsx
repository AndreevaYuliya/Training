import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { router, Slot, usePathname } from 'expo-router';
import { useEffect } from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { tokenCache } from '@clerk/clerk-expo/token-cache';

import * as WebBrowser from 'expo-web-browser';
import COLORS from '../constants/colors';
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={styles.container}>
			<ClerkProvider
				publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
				tokenCache={tokenCache}
			>
				<BottomSheetModalProvider>
					<AuthGate>
						<Slot />
					</AuthGate>
				</BottomSheetModalProvider>
			</ClerkProvider>
		</GestureHandlerRootView>
	);
}

function AuthGate({ children }: { children: React.ReactNode }) {
	const { isLoaded, isSignedIn } = useAuth();
	const pathname = usePathname();

	useEffect(() => {
		if (!isLoaded) return;

		if (isSignedIn && (pathname === '/' || pathname === '/auth')) {
			console.log(isSignedIn, pathname);
			console.log('Redirecting to /auth');
			router.push('/auth/Profile');
		}
	}, [isLoaded, isSignedIn, pathname]);

	console.log(isSignedIn, pathname);

	if (!isLoaded) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
				<Text>Loading...</Text>
			</View>
		);
	}

	return <>{children}</>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
});
