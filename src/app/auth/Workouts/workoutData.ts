import { WorkoutItems } from './types';

// массив данных
export const WorkoutData: WorkoutItems[] = [
	{
		title: '2025-08-25',
		status: 'Done',
		data: [{ title: 'Ex 1' }, { title: 'Ex 2' }, { title: 'Ex 3' }, { title: 'Ex 4' }],
	},
	{
		title: '2025-08-12',
		status: 'PartialDone',
		data: [
			{ title: 'Ex 5', status: 'Done' },
			{ title: 'Ex 6', status: 'Done' },
			{ title: 'Ex 7', status: 'Missed' },
			{ title: 'Ex 8', status: 'Done' },
			{ title: 'Ex 9', status: 'Missed' },
		],
	},
	{
		title: '2025-08-14',
		status: 'PartialDone',
		data: [
			{ title: 'Ex 115', status: 'Done' },
			{ title: 'Ex 116', status: 'Done' },
			{ title: 'Ex 117', status: 'Missed' },
			{ title: 'Ex 118', status: 'Done' },
			{ title: 'Ex 119', status: 'Missed' },
		],
	},
	{
		title: '2025-08-07',
		status: 'Missed',
		data: [{ title: 'Ex 10' }, { title: 'Ex 11' }, { title: 'Ex 12' }, { title: 'Ex 13' }],
	},
	{
		title: '2025-08-15',
		status: 'Changed',
		data: [
			{ title: 'Ex 14', status: 'Changed' },
			{ title: 'Ex 15', status: 'Done' },
			{ title: 'Ex 16', status: 'Done' },
			{ title: 'Ex 17', status: 'Done' },
		],
	},
];
