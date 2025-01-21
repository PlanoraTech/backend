export interface IService {
  findAll(institutionsId: string, select?: {
    groups?: {
			select: {
				id?: boolean,
				name?: boolean,
				timetables?: {
					select: {
						id?: boolean,
						name?: boolean,
						groups?: boolean,
						appointments?: {
							select: {
								id?: boolean,
								subject?: boolean,
								presentators?: boolean,
								rooms?: boolean,
								dayOfWeek?: boolean,
								start?: boolean,
								end?: boolean,
								isCancelled?: boolean,
								timetables?: boolean,
							},
						},
						institution?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		presentators?: {
			select: {
				id?: boolean,
				name?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		subjects?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		timetables?: {
			select: {
				id?: boolean,
				name?: boolean,
				groups?: boolean,
				appointments?: {
					select: {
						id?: boolean,
						subject?: boolean,
						presentators?: boolean,
						rooms?: boolean,
						dayOfWeek?: boolean,
						start?: boolean,
						end?: boolean,
						isCancelled?: boolean,
						timetables?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		users?: {
			select: {
				id?: boolean,
				email?: boolean,
				role?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
  });
  findOne(institutionsId: string, id: string, select?: {
    groups?: {
			select: {
				id?: boolean,
				name?: boolean,
				timetables?: {
					select: {
						id?: boolean,
						name?: boolean,
						groups?: boolean,
						appointments?: {
							select: {
								id?: boolean,
								subject?: boolean,
								presentators?: boolean,
								rooms?: boolean,
								dayOfWeek?: boolean,
								start?: boolean,
								end?: boolean,
								isCancelled?: boolean,
								timetables?: boolean,
							},
						},
						institution?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		presentators?: {
			select: {
				id?: boolean,
				name?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		subjects?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		timetables?: {
			select: {
				id?: boolean,
				name?: boolean,
				groups?: boolean,
				appointments?: {
					select: {
						id?: boolean,
						subject?: boolean,
						presentators?: boolean,
						rooms?: boolean,
						dayOfWeek?: boolean,
						start?: boolean,
						end?: boolean,
						isCancelled?: boolean,
						timetables?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		users?: {
			select: {
				id?: boolean,
				email?: boolean,
				role?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
  });
}