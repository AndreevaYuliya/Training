import React from 'react';

import { Platform, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import { AuthCredentialsProvider } from '../services/AuthCredentialsContext';

import COLORS from '../constants/colors';

WebBrowser.maybeCompleteAuthSession();

const RootLayout = () => {
	const insets = useSafeAreaInsets();

	if (!tokenCache) {
		return <Text style={styles.loader}>Loading</Text>;
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<ClerkProvider
				publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
				tokenCache={tokenCache}
			>
				<AuthCredentialsProvider>
					<BottomSheetModalProvider>
						<Slot />
					</BottomSheetModalProvider>
				</AuthCredentialsProvider>
			</ClerkProvider>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},

	loader: {
		fontSize: 48,
		alignItems: 'center',
		justifyContent: 'center',
		color: COLORS.white,
	},
});

export default RootLayout;
