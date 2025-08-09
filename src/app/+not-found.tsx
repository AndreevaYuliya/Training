import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Link, Stack } from 'expo-router';

const NotFoundScreen = () => {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View style={styles.container}>
				<Text>This screen does not exist.</Text>
				<Link
					href="/unauth/signIn"
					style={styles.link}
				>
					<Text>Go to home screen!</Text>
				</Link>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
});

export default NotFoundScreen;
