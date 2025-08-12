import React from 'react';

import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const UnauthLayout = () => {
	return <Stack screenOptions={{ headerShown: false }}></Stack>;
};

export default UnauthLayout;
