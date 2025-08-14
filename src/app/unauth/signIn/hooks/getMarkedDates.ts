import { WorkoutData } from '../../../auth/Workouts/workoutData';

import { MarkedDates, WorkoutItems, WorkoutStatus } from '../../../auth/Workouts/types';

import COLORS from '@/src/constants/colors';

// массив с цветами по статусу
const STATUS_COLORS: Record<WorkoutStatus, string> = {
	Done: COLORS.green,
	PartialDone: 'orange',
	Missed: COLORS.red,
	Changed: COLORS.yellow,
};

// функция для генерации markedDates для календаря
export const getMarkedDates = (items: WorkoutItems[] = WorkoutData): MarkedDates => {
	const marked: MarkedDates = {};

	const today = new Date().toISOString().split('T')[0];

	items.forEach((item) => {
		if (item.data && item.data.length > 0) {
			const color = STATUS_COLORS[item.status];

			marked[item.title] = {
				selected: true,
				selectedColor: color,
				selectedTextColor: COLORS.white,
			};
		} else {
			marked[item.title] = { disabled: true };
		}
	});

	// Подсветка текущей даты
	if (!marked[today]) {
		// если сегодня нет в agendaItems, добавляем с дефолтным цветом
		marked[today] = {
			selected: true,
			selectedColor: COLORS.baseButtonBGC, // цвет для текущего дня
			selectedTextColor: COLORS.white,
		};
	} else {
		// если сегодня уже есть, можно сменить цвет или добавить рамку
		marked[today].selectedColor = COLORS.baseButtonBGC;
	}

	return marked;
};
