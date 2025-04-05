import { Appointments, Events, Institutions, Permissions, Presentators, Prisma, PrismaClient, Roles, Rooms, SpecialPermissions, Subjects, TimeTables } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { select } from '@inquirer/prompts';
import { readdirSync, readFileSync } from 'fs';
import { DefaultArgs, PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { hash } from 'bcrypt';

type ExtendedPresentators = (Presentators & {
	isSubstituted?: boolean,
});

type ExtendedAppointments = (Appointments & {
	timetables: (TimeTables | undefined)[],
	subject: Subjects,
	rooms: (Rooms | undefined)[],
	presentators: (ExtendedPresentators | undefined)[],
});

type ExtendedInstitutions = (Institutions & {
	presentators: Presentators[],
	subjects: Subjects[],
	rooms: Rooms[],
	events: Events[],
	timetables: TimeTables[],
	appointments: (ExtendedAppointments & {
		recurringTill?: Date,
	})[],
	users: {
		name: string,
		email: string,
		role: Roles,
		password: string,
	}[],
});

const prisma = new PrismaClient();

const numberOfItems = {
	institutions: 2,
	presentators: 20,
	subjects: 10,
	rooms: 10,
	events: 10,
	timeTables: 10,
	appointments: 50,
	presentatorsToAppointments: 2,
};

const folderPath = 'prisma/predefinedDatas';

let progress = 0;
let interval;

seed()
	.then(async () => {
		await prisma.$disconnect()
		clearInterval(interval)
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect()
		process.exit(1)
	});

function getProgress(): void {
	process.stdout.cursorTo(0);
	process.stdout.write(`Progress: ${Math.floor(progress)}%`);
}

async function seed(): Promise<void> {
	const answer = await select({
		message: 'Choose what kind of data the database should be filled up with.',
		choices: [
			{
				name: 'Pre-defined (fastest)',
				value: 'predefined',
			},
			{
				name: 'Random data (slow, could take up to 15 minutes, especially to a remote server)',
				value: 'random',
			},
		]
	});
	switch (answer) {
		case 'predefined':
			interval = setInterval(getProgress, 100)
			const files: string[] = readdirSync(folderPath);
			const predefinedData: ExtendedInstitutions[] = files.map((file) => {
				return JSON.parse(readFileSync(`${folderPath}/${file}`, 'utf8'));
			})
			for (let i = 0; i < predefinedData.length; i++) {
				await prisma.$transaction(async (tx) => {
					await createRolesToPermissions(tx);
					const institution: Institutions = await createInstitution(tx, {
						id: '',
						name: predefinedData[i]!.name,
						type: predefinedData[i]!.type,
						access: predefinedData[i]!.access,
						color: predefinedData[i]!.color,
						website: predefinedData[i]!.website,
					});
					await createEvents(tx, institution.id, predefinedData[i]!.events);
					progress += (100 / predefinedData.length) / 7;
					console.log("\nEvents created");
					const presentators: Presentators[] = await createPresentators(tx, institution.id, predefinedData[i]!.presentators);
					progress += (100 / predefinedData.length) / 7;
					console.log("\nPresentators created");
					const subjects: Subjects[] = await createSubjects(tx, institution.id, predefinedData[i]!.subjects);
					progress += (100 / predefinedData.length) / 7;
					console.log("\nSubjects created");
					const rooms: Rooms[] = await createRooms(tx, institution.id, predefinedData[i]!.rooms);
					progress += (100 / predefinedData.length) / 7;
					console.log("\nRooms created");
					const timetables: TimeTables[] = await createTimeTables(tx, institution.id, predefinedData[i]!.timetables);
					progress += (100 / predefinedData.length) / 7;
					console.log("\nTimetables created");
					const appointments: ExtendedAppointments[] = new Array<ExtendedAppointments>();
					for (let j = 0; j < predefinedData[i]!.appointments.length; j++) {
						const connectedSubject: Subjects | undefined = subjects.find((subject) => subject.subjectId === predefinedData[i]!.appointments[j]!.subject.subjectId);
						if (connectedSubject) {
							if (predefinedData[i]!.appointments[j]!.recurringTill) {
								let start: Date = new Date(predefinedData[i]!.appointments[j]!.start);
								let end: Date = new Date(predefinedData[i]!.appointments[j]!.end);
								let recurringTill: Date = new Date(predefinedData[i]!.appointments[j]!.recurringTill ?? start);
								while (start <= recurringTill) {
									appointments.push({
										start: start,
										end: end,
										isCancelled: predefinedData[i]!.appointments[j]!.isCancelled,
										presentators: predefinedData[i]!.appointments[j]!.presentators.map((presentator) => presentators.find((p) => p.name === presentator?.name)),
										subject: connectedSubject,
										rooms: predefinedData[i]!.appointments[j]!.rooms.map((room) => rooms.find((r) => r.name === room?.name)),
										timetables: predefinedData[i]!.appointments[j]!.timetables.map((timetable) => timetables.find((t) => t.name === timetable?.name)),
										id: '',
										subjectId: ''
									});
									start = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
									end = new Date(end.getTime() + 7 * 24 * 60 * 60 * 1000);
								}
							}
						}
						else {
							throw new Error("Cannot find subject for appointment. It may be due to a mistype. Error occured at " + j);
						}
					}
					await createAppointments(tx, institution.id, appointments);
					progress += (100 / predefinedData.length) / 7;
					console.log("\nAppointments created");
					await createUsers(tx, institution.id, predefinedData[i]!.users);
					progress += (100 / predefinedData.length) / 7;
					console.log("\nUsers created");
				},
				{
					maxWait: 1000000,
					timeout: 2000000,
				});
			}
			break;
		case 'random':
			interval = setInterval(getProgress, 100)
			for (let i = 0; i < numberOfItems.institutions; i++) {
				await prisma.$transaction(async (tx) => {
					const institution: Institutions = await createInstitution(tx, {
						id: '',
						name: faker.company.name(),
						type: faker.helpers.arrayElements(["SCHOOL", "UNIVERSITY", "COMPANY"], 1)[0]!,
						access: faker.helpers.arrayElements(["PUBLIC", "PRIVATE"], 1)[0]!,
						color: faker.internet.color(),
						website: faker.internet.url(),
					});
					await createEvents(tx, institution.id, Array.from({ length: numberOfItems.events }, () => ({ title: faker.lorem.word(), date: faker.date.future() })));
					console.log("\nEvents created");
					const presentators: Presentators[] = await createPresentators(tx, institution.id, Array.from({ length: numberOfItems.presentators }, () => ({ name: faker.person.fullName() })));
					console.log("\nPresentators created");
					const subjects: Subjects[] = await createSubjects(tx, institution.id, Array.from({ length: numberOfItems.subjects }, () => ({ name: faker.lorem.word(), subjectId: faker.lorem.word() + faker.number.int() })));
					console.log("\nSubjects created");
					const rooms: Rooms[] = await createRooms(tx, institution.id, Array.from({ length: numberOfItems.rooms }, () => ({ name: faker.lorem.word() })));
					console.log("\nRooms created");
					const timetables: TimeTables[] = await createTimeTables(tx, institution.id, Array.from({ length: numberOfItems.timeTables }, () => ({ name: faker.lorem.word() })));
					console.log("\nTimetables created");
					const appointments: ExtendedAppointments[] = new Array<ExtendedAppointments>();
					for (let i = 0; i < numberOfItems.appointments; i++) {
						appointments.push({
							start: faker.date.anytime(),
							end: faker.date.anytime(),
							isCancelled: faker.datatype.boolean(),
							subject: faker.helpers.arrayElements(subjects, 1)[0]!,
							timetables: faker.helpers.arrayElements(timetables, 1),
							rooms: faker.helpers.arrayElements(rooms, 2),
							presentators: faker.helpers.arrayElements(presentators, 2).map((presentator) => {
								return {
									id: presentator.id,
									name: presentator.name,
									isSubstituted: faker.datatype.boolean(),
								};
							}),
							id: '',
							subjectId: ''
						});
					}
					await createAppointments(tx, institution.id, appointments);
					console.log("\nAppointments created");
					progress += 100 / numberOfItems.institutions;
				},
				{
					maxWait: 300000,
					timeout: 600000,
				});
			}
			break;
		default:
			process.exit(1);
	}
}

async function createRolesToPermissions(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">): Promise<void> {
	await prisma.rolesToPermissions.createMany({
		data: [
			{
				role: Roles.USER,
				permissions: [
					Permissions.READ,
				],
			},
			{
				role: Roles.PRESENTATOR,
				permissions: [
					Permissions.READ,
				],
				specialPermissions: [
					SpecialPermissions.SUBSTITUTE,
					SpecialPermissions.CHANGE_ROOM,
				]
			},
			{
				role: Roles.DIRECTOR,
				permissions: [
					Permissions.READ,
					Permissions.WRITE,
				],
				specialPermissions: Object.values(SpecialPermissions),
			},
		],
	}).catch((e) => {
		if (e instanceof PrismaClientKnownRequestError) {
			switch(e.code) {
				case 'P2002':
					return;
			}
		}
		throw e;
	});
}

async function createInstitution(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institution: Institutions): Promise<Institutions> {
	return await prisma.institutions.create({
		data: {
			name: institution.name,
			type: institution.type,
			access: institution.access,
			color: institution.color,
			website: institution.website,
		},
	}).catch(async (e) => {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2002':
					return await prisma.institutions.findUniqueOrThrow({
						where: {
							name: institution.name,
						},
					});
			}
		}
		throw new Error("\nCannot create institution. It may be due to a mistype. Error: " + e);
	});
}

async function createPresentators(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, presentators: { name: string }[]): Promise<Presentators[]> {
	try {
		const result: Presentators[] = await Promise.all(presentators.map(async (presentator: { name: string }, index) => {
			return await prisma.presentators.create({
				data: {
					name: presentator.name,
					institutions: {
						connect: {
							id: institutionId,
						},
					},
				},
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					switch (e.code) {
						case 'P2002':
							return;
					}
				}
				throw new Error("\nCannot create presentator. It may be due to a mistype. Error occurued at: " + index + "\nError: " + e);
			});
		})) as Presentators[];
		return result.filter((presentator: Presentators): presentator is Presentators => presentator !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more presentator. It may be due to not defining any. Error: " + e);
	}
}

async function createSubjects(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, subjects: { name: string, subjectId: string }[]): Promise<Subjects[]> {
	try {
		const result: Subjects[] = await Promise.all(subjects.map(async (subject: { name: string, subjectId: string }, index) => {
			return await prisma.subjects.create({
				data: {
					name: subject.name,
					subjectId: subject.subjectId,
					institution: {
						connect: {
							id: institutionId,
						},
					},
				},
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					switch (e.code) {
						case 'P2002':
							return;
					}
				}
				throw new Error("\nCannot create subject. It may be due to a mistype. Error occurued at: " + index + "\nError: " + e);
			});
		})) as Subjects[];
		return result.filter((subject: Subjects): subject is Subjects => subject !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more subject. It may be due to not defining any. Error: " + e);
	}
}

async function createRooms(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, rooms: { name: string }[]): Promise<Rooms[]> {
	try {
		const result: Rooms[] = await Promise.all(rooms.map(async (room: { name: string }, index) => {
			return await prisma.rooms.create({
				data: {
					name: room.name,
					institution: {
						connect: {
							id: institutionId,
						},
					},
				},
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					switch (e.code) {
						case 'P2002':
							return;
					}
				}
				throw new Error("\nCannot create room. It may be due to a mistype. Error occurued at: " + index + "\nError: " + e);
			});
		})) as Rooms[];
		return result.filter((room: Rooms): room is Rooms => room !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more room. It may be due to not defining any. Error: " + e);
	}
}

async function createEvents(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, events: { title: string, date: Date }[]): Promise<Events[]> {
	try {
		const result: Events[] = await Promise.all(events.map(async (event: { title: string, date: Date }, index) => {
			return await prisma.events.create({
				data: {
					title: event.title,
					date: new Date(event.date),
					institution: {
						connect: {
							id: institutionId,
						},
					},
				},
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					switch (e.code) {
						case 'P2002':
							return;
					}
				}
				throw new Error("\nCannot create event. It may be due to a mistype. Error occurued at: " + index + "\nError: " + e);
			});
		})) as Events[];
		return result.filter((event: Events): event is Events => event !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more event. It may be due to not defining any. Error: " + e);
	}
}

async function createTimeTables(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, timeTables: { name: string }[]): Promise<TimeTables[]> {
	try {
		const result: TimeTables[] = await Promise.all(timeTables.map(async (timeTable: { name: string }, index) => {
			return await prisma.timeTables.create({
				data: {
					name: timeTable.name,
					institution: {
						connect: {
							id: institutionId,
						},
					},
				},
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					switch (e.code) {
						case 'P2002':
							return;
					}
				}
				throw new Error("\nCannot create timetable. It may be due to a mistype. Error occurued at: " + index + "\nError: " + e);
			});
		})) as TimeTables[];
		return result.filter((timeTable: TimeTables): timeTable is TimeTables => timeTable !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more timetable. It may be due to not defining any. Error: " + e);
	}
}

async function createAppointments(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, appointments: ExtendedAppointments[]): Promise<void> {
	for (let i = 0; i < appointments.length; i++) {
		const appointment: Appointments = await prisma.appointments.create({
			data: {
				subject: {
					connect: {
						id: appointments[i]!.subject.id,
						institutionId: institutionId,
					}
				},
				rooms: {
					connect: appointments[i]!.rooms.map((room) => {
						return {
							id: room?.id,
							institutionId: institutionId,
						}
					}),
				},
				timetables: {
					connect: appointments[i]!.timetables.map((timetable) => {
						return {
							id: timetable?.id,
							institutionId: institutionId,
						}
					}),
				},
				start: new Date(appointments[i]!.start),
				end: new Date(appointments[i]!.end),
				isCancelled: appointments[i]!.isCancelled,
			}
		}).catch((e) => {
			console.log("\n");
			throw new Error("Cannot create appointment. It may be due to not defining any. Error occured at " + i + "\nError: " + e);
		})
		if (appointments[i]!.presentators.length > 0 && appointment) {
			await presentatorsToAppointments(prisma, institutionId, appointment.id, appointments[i]!.presentators);
		}
	}
}

async function presentatorsToAppointments(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, appointmentId: string, presentators: (ExtendedPresentators | undefined)[]): Promise<void> {
	for (let i = 0; i < presentators.length; i++) {
		await prisma.presentatorsToAppointments.create({
			data: {
				appointment: {
					connect: {
						id: appointmentId,
					},
				},
				presentator: {
					connect: {
						id: presentators[i]?.id,
					},
				},
				isSubstituted: presentators[i]?.isSubstituted || false,
			}
		}).catch(async (e) => {
			if (e instanceof PrismaClientKnownRequestError) {
				switch (e.code) {
					case 'P2002':
						await presentatorsToAppointments(prisma, appointmentId, institutionId, presentators);
				}
			}
			console.log("\n");
			throw new Error("Cannot connect presentator to an appointment. It may be due to a mistype. Error occured at " + i + "\nError: " + e);
		});
	}
}

async function createUsers(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, users: { name: string, email: string, role: Roles, password: string }[]): Promise<void> {
	try {
		for (let i = 0; i < users.length; i++) {
			await prisma.users.create({
				data: {
					email: users[i]!.email,
					password: await hash(users[i]!.password, 10),
				}
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					switch (e.code) {
						case 'P2002':
							return;
					}
				}
				console.log("\n");
				throw new Error("Cannot create user. It may be due to not defining any. Error occured at " + i + "\nError: " + e);
			})
			await prisma.usersToInstitutions.create({
				data: {
					role: users[i]!.role,
					user: {
						connect: {
							email: users[i]!.email,
						},
					},
					institution: {
						connect: {
							id: institutionId,
						},
					},
					presentator: (users[i]!.name) ? {
						connect: {
							name: users[i]!.name,
						}
					} : undefined,
				}
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					switch (e.code) {
						case 'P2002':
							return;
					}
				}
				console.log("\n");
				throw new Error("Cannot connect user to an institution. It may be due to a mistype. Error occured at " + i + "\nError: " + e);
			});
		}
	}
	catch (e) {
		console.log("\n");
		throw new Error("Cannot create one or more user. It may be due to not defining any. Error: " + e);
	}
}