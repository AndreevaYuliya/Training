// src/app/auth/_layout.tsx
import React from 'react';

import { Stack } from 'expo-router';

import AuthGate from '../../middleware/AuthGate';

const AuthLayout = () => {
	return (
		<AuthGate requireAuth={true}>
			<Stack screenOptions={{ headerShown: false }} />
		</AuthGate>
	);
};

export default AuthLayout;
