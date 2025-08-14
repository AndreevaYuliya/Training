import React, { useRef, useCallback, useState, useMemo } from 'react';

import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExpandableCalendar, AgendaList, CalendarProvider, DateData } from 'react-native-calendars';
import { Positions } from 'react-native-calendars/src/expandableCalendar';

import WorkoutListItem from './WorkoutListItem';

import { getMarkedDates } from '../../unauth/signIn/hooks/getMarkedDates';

import { WorkoutData } from './workoutData';
import { MarkedDates, WorkoutItems } from './types';

import COLORS from '@/src/constants/colors';
import Header from '@/src/components/Header';
import IconButton from '@/src/components/buttons/IconButton';
import { router } from 'expo-router';

const ExpandableCalendarScreen = () => {
	const insets = useSafeAreaInsets();
	const today = new Date().toISOString().split('T')[0];

	const [longPressMarks, setLongPressMarks] = useState<MarkedDates>(getMarkedDates(WorkoutData));
	const [selectedDate, setSelectedDate] = useState<string | null>(today);

	const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);

	// const onDateChanged = useCallback((date, updateSource) => {
	//   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
	// }, []);

	// const onMonthChange = useCallback(({dateString}) => {
	//   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
	// }, []);

	// фильтруем массив, чтобы показывать только выбранный день
	const filteredItems = selectedDate
		? WorkoutData.filter((item) => item.title === selectedDate)
		: [];

	// 	// Formatted string like "ПОНЕДЕЛЬНИК, 13 АВГУСТА 2025"
	const formattedDate = useMemo(() => {
		if (!selectedDate) return '';

		const dateObj = new Date(selectedDate);
		if (isNaN(dateObj.getTime())) return '';

		// Day of week in Russian
		const dayName = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(dateObj);

		const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(dateObj);
		const dayNumber = dateObj.getDate();
		const yearNumber = dateObj.getFullYear();

		return `${dayName}, ${dayNumber} ${monthName}a ${yearNumber}`;
	}, [selectedDate]);

	const renderItem = useCallback(({ item }: { item: WorkoutItems }) => {
		return <WorkoutListItem item={item} />;
	}, []);

	const handleDayPress = useCallback(
		(day: DateData) => {
			setSelectedDate(day.dateString);
		},
		[setSelectedDate],
	);
	// Handle long press: toggle yellow "Missed" mark
	const handleDayLongPress = (day: DateData) => {
		setLongPressMarks((prev) => {
			const prevColor = prev[day.dateString]?.selectedColor;

			const updated = { ...prev };

			if (prevColor === COLORS.yellow) {
				delete updated[day.dateString];
			} else {
				updated[day.dateString] = {
					selected: true,
					selectedColor: COLORS.yellow,
					selectedTextColor: COLORS.white,
				};
			}

			return updated;
		});
	};

	return (
		<CalendarProvider
			date={today}
			// onDateChanged={onDateChanged}
			// onMonthChange={onMonthChange}
			// disabledOpacity={0.6}

			//   theme={todayBtnTheme.current}

			// todayBottomMargin={16}
			// disableAutoDaySelection={[ExpandableCalendar.navigationTypes.MONTH_SCROLL, ExpandableCalendar.navigationTypes.MONTH_ARROWS]}

			style={[
				styles.container,
				{
					paddingTop: Platform.OS === 'ios' ? insets.top : 32,
					paddingBottom: Platform.OS === 'ios' ? insets.bottom : 15,
				},
			]}
		>
			<View style={styles.calendarContainer}>
				<Header title="Workouts schedule">
					<IconButton
						iconName="profile"
						onPress={() => router.push('/auth/Profile')}
					/>
				</Header>
				<ExpandableCalendar
					ref={calendarRef}
					// horizontal={false}
					// hideArrows
					// disablePan
					// hideKnob
					initialPosition={Positions.OPEN}
					// headerStyle={styles.header} // for horizontal only
					// disableWeekScroll
					// disableAllTouchEventsForDisabledDays
					firstDay={1}
					markedDates={longPressMarks}
					// leftArrowImageSource={leftArrowIcon}
					// rightArrowImageSource={rightArrowIcon}
					// animateScroll

					calendarWidth={Dimensions.get('window').width - 32}
					closeOnDayPress={false}
					theme={{
						arrowColor: COLORS.textButton,
						textMonthFontSize: 22,
						monthTextColor: COLORS.textButton,
						textSectionTitleColor: COLORS.baseButtonBGC,
						textDayHeaderFontSize: 15,
						selectedDayTextColor: COLORS.textButton,
						todayTextColor: COLORS.white,
						todayBackgroundColor: COLORS.baseButtonBGC,
						dayTextColor: COLORS.textButton,
						textDisabledColor: COLORS.grey,

						selectedDayBackgroundColor: COLORS.white,
					}}
					onDayPress={handleDayPress}
					onDayLongPress={handleDayLongPress}
				/>
			</View>
			{filteredItems.length > 0 && (
				<Text
					style={{
						marginTop: 16,
						textAlign: 'center',
						fontSize: 22,
						fontWeight: '500',
						color: COLORS.white,
						textTransform: 'capitalize',
					}}
				>
					{formattedDate}
				</Text>
			)}
			<AgendaList
				sections={filteredItems}
				renderItem={renderItem}
				renderSectionHeader={() => null}
				// scrollToNextEvent
				sectionStyle={styles.section}
				// dayFormat={'yyyy-MM-d'}
			/>
		</CalendarProvider>
	);
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: COLORS.background,
	},

	calendarContainer: {
		gap: 16,
		alignSelf: 'center',
		borderRadius: 16,
		overflow: 'hidden',
	},

	section: {
		backgroundColor: 'transparent',
		textAlign: 'center',
		fontSize: 22,
		fontWeight: '500',
		color: COLORS.white,
		textTransform: 'capitalize',
	},
});
