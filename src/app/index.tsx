// src/app/index.tsx
import React from 'react';

import { Text, ActivityIndicator, View, StyleSheet } from 'react-native';

import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useAuth } from '@clerk/clerk-expo';

const Index = () => {
	const { isLoaded, isSignedIn } = useAuth();

	if (!isLoaded) {
		return (
			<View style={styles.container}>
				<ActivityIndicator />
				<Text>Loading...</Text>
			</View>
		);
	}

	if (isSignedIn) {
		return <Redirect href="/auth/Workouts" />;
	} else {
		return <Redirect href="/unauth/signIn" />;
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Index;
