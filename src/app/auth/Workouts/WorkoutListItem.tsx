import React, { FC, memo, useCallback } from 'react';

import { StyleSheet, Alert, View, Text, Pressable } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import TextButton from '@/src/components/buttons/TextButton';

import { WorkoutItems } from './types';

import COLORS from '@/src/constants/colors';

type Props = {
	item: WorkoutItems;
};

const WorkoutListItem: FC<Props> = (props) => {
	const { item } = props;

	const itemPressed = useCallback(() => {
		Alert.alert(item.title);
	}, [item]);

	if (item === null) {
		return null;
	}

	return (
		<Pressable
			style={({ pressed }) => [styles.container, { opacity: pressed ? 0.5 : 1 }]}
			onPress={() => null}
		>
			<View style={styles.gap}>
				<Text style={styles.text}>{item.title}</Text>

				<TextButton
					title="Last Result"
					onPress={() => null}
				/>
			</View>

			<MaterialIcons
				name="chevron-right"
				size={32}
				color={COLORS.white}
			/>
		</Pressable>
	);
};

export default memo(WorkoutListItem);

const styles = StyleSheet.create({
	gap: {
		gap: 8,
	},

	container: {
		flexDirection: 'row',
		paddingBottom: 16,
		justifyContent: 'space-between',
	},

	text: {
		color: COLORS.white,
		fontSize: 20,
	},
});
