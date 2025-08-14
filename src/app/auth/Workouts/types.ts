export type MarkedDates = Record<string, any>;

export type WorkoutItemData = {
	title: string;
	status?: WorkoutStatus; // статус для упражнения, необязательный
};

// тип статуса для дня или упражнения
export type WorkoutStatus = 'Done' | 'PartialDone' | 'Missed' | 'Changed';

// тип отдельного упражнения
type WorkoutItem = {
	title: string;
	status?: WorkoutStatus;
};

// тип дня с упражнениями
export type WorkoutItems = {
	title: string; // дата в формате YYYY-MM-DD
	status: WorkoutStatus; // статус дня
	data: WorkoutItem[];
};
