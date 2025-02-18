import { Appointments, Events, Institutions, Presentators, Prisma, PrismaClient, Rooms, Subjects, TimeTables } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { select } from '@inquirer/prompts';
import { readdirSync, readFileSync } from 'fs';
import { DefaultArgs, PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type ExtendedInstitutions = Institutions & {
	presentators: Partial<Presentators>[],
	subjects: Partial<Subjects>[],
	rooms: Partial<Rooms>[],
	events: Partial<Events>[],
	timetables: Partial<TimeTables>[],
	appointments: Partial<ExtendedAppointments>[],
};

type ExtendedAppointments = Appointments & {
	timetables: Partial<TimeTables>[],
	subject: Partial<Subjects>,
	rooms: Partial<Rooms>[],
	presentators: Partial<Presentators & {
		isSubstituted: boolean,
	}>[]
}

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
			const files = readdirSync(folderPath);
			const predefinedData: ExtendedInstitutions[] = files.map((file) => {
				return JSON.parse(readFileSync(`${folderPath}/${file}`, 'utf8'));
			})
			for (let i = 0; i < predefinedData.length; i++) {
				await prisma.$transaction(async (tx) => {
					let institution: Partial<Institutions> = await createInstitution(tx, {
						name: predefinedData[i].name,
						type: predefinedData[i].type,
						access: predefinedData[i].access,
						color: predefinedData[i].color,
						website: predefinedData[i].website,
					});
					await createEvents(tx, institution.id, predefinedData[i].events);
					let presentators: Partial<Presentators>[] = await createPresentators(tx, institution.id, predefinedData[i].presentators);
					let subjects: Partial<Subjects>[] = await createSubjects(tx, institution.id, predefinedData[i].subjects);
					let rooms: Partial<Rooms>[] = await createRooms(tx, institution.id, predefinedData[i].rooms);
					let timetables: Partial<TimeTables>[] = await createTimeTables(tx, institution.id, predefinedData[i].timetables);
					let appointments: Partial<ExtendedAppointments>[] = new Array<Partial<ExtendedAppointments>>();
					for (let j = 0; j < predefinedData[i].appointments.length; j++) {
						appointments.push({
							start: predefinedData[i].appointments[j].start,
							end: predefinedData[i].appointments[j].end,
							isCancelled: predefinedData[i].appointments[j].isCancelled,
							subject: subjects.find((subject) => subject.subjectId === predefinedData[i].appointments[j].subject.subjectId),
							timetables: predefinedData[i].appointments[j].timetables.map((timetable) => timetables.find((t) => t.name === timetable.name)),
							rooms: predefinedData[i].appointments[j].rooms.map((room) => rooms.find((r) => r.name === room.name)),
							presentators: predefinedData[i].appointments[j].presentators.map((presentator) => presentators.find((p) => p.name === presentator.name)),
						});
					}
					await createAppointments(tx, institution.id, appointments);
					progress += 100 / predefinedData.length;
				},
				{
					maxWait: 100000,
					timeout: 200000,
				});
			}
			break;
		case 'random':
			interval = setInterval(getProgress, 100)
			for (let a = 0; a < numberOfItems.institutions; a++) {
				await prisma.$transaction(async (tx) => {
					let institution: Partial<Institutions> = await createInstitution(tx, {
						name: faker.company.name(),
						type: faker.helpers.arrayElements(["SCHOOL", "UNIVERSITY", "COMPANY"], 1)[0],
						access: faker.helpers.arrayElements(["PUBLIC", "PRIVATE"], 1)[0],
						color: faker.internet.color(),
						website: faker.internet.url(),
					});
					await createEvents(tx, institution.id, Array.from({ length: numberOfItems.events }, () => ({ title: faker.lorem.word(), date: faker.date.future() })));
					console.log("\nEvents created")
					let presentators: Partial<Presentators>[] = await createPresentators(tx, institution.id, Array.from({ length: numberOfItems.presentators }, () => ({ name: faker.person.fullName() })));
					console.log("\nPresentators created")
					let subjects: Partial<Subjects>[] = await createSubjects(tx, institution.id, Array.from({ length: numberOfItems.subjects }, () => ({ name: faker.lorem.word(), subjectId: faker.lorem.word() + faker.number.int() })));
					console.log("\nSubjects created")
					let rooms: Partial<Rooms>[] = await createRooms(tx, institution.id, Array.from({ length: numberOfItems.rooms }, () => ({ name: faker.lorem.word() })));
					console.log("\nRooms created")
					let timetables: Partial<TimeTables>[] = await createTimeTables(tx, institution.id, Array.from({ length: numberOfItems.timeTables }, () => ({ name: faker.lorem.word() }))) as Partial<TimeTables>[];
					console.log("\nTimetables created")
					let appointments: Partial<ExtendedAppointments>[] = new Array<Partial<ExtendedAppointments>>();
					for (let i = 0; i < numberOfItems.appointments; i++) {
						appointments.push({
							start: faker.date.anytime(),
							end: faker.date.anytime(),
							isCancelled: faker.datatype.boolean(),
							subject: faker.helpers.arrayElements(subjects, 1)[0],
							timetables: faker.helpers.arrayElements(timetables, 1),
							rooms: faker.helpers.arrayElements(rooms, 2),
							presentators: faker.helpers.arrayElements(presentators, 2).map((presentator) => {
								return {
									id: presentator.id,
									isSubstituted: faker.datatype.boolean(),
								}
							}),
						});
					}
					await createAppointments(tx, institution.id, appointments);
					console.log("\nAppointments created")
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

async function createInstitution(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institution: Partial<Institutions>): Promise<Partial<Institutions>> {
	return await prisma.institutions.create({
		select: {
			id: true,
		},
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
						select: {
							id: true,
						},
						where: {
							name: institution.name,
						},
					});
			}
		}
		throw new Error("\nCannot create institution. It may be due to a mistype. Error: " + e);
	});
}

async function createPresentators(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, presentators: Partial<Presentators>[]): Promise<Partial<Presentators>[]> {
	try {
		let result: (void | Partial<Presentators>)[] = await Promise.all(presentators.map(async (presentator, index) => {
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
		}));
		return result.filter((presentator: Presentators): presentator is Presentators => presentator !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more presentator. It may be due to not defining any. Error: " + e);
	}
}

async function createSubjects(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, subjects: Partial<Subjects>[]): Promise<Partial<Subjects>[]> {
	try {
		let result: (void | Partial<Subjects>)[] = await Promise.all(subjects.map(async (subject: Subjects, index) => {
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
		}));
		return result.filter((subject: Subjects): subject is Subjects => subject !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more subject. It may be due to not defining any. Error: " + e);
	}
}

async function createRooms(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, rooms: Partial<Rooms>[]): Promise<Partial<Rooms>[]> {
	try {
		let result: (void | Partial<Rooms>)[] = await Promise.all(rooms.map(async (room, index) => {
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
		}));
		return result.filter((room: Rooms): room is Rooms => room !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more room. It may be due to not defining any. Error: " + e);
	}
}

async function createEvents(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, events: Partial<Events>[]): Promise<Partial<Events>[]> {
	try {
		let result: (void | Partial<Events>)[] = await Promise.all(events.map(async (event, index) => {
			return await prisma.events.create({
				data: {
					title: event.title,
					date: event.date,
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
		}));
		return result.filter((event: Events): event is Events => event !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more event. It may be due to not defining any. Error: " + e);
	}
}

async function createTimeTables(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, timeTables: Partial<TimeTables>[]): Promise<Partial<TimeTables>[]> {
	try {
		let result = await Promise.all(timeTables.map(async (timeTable, index) => {
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
		}));
		return result.filter((timeTable: TimeTables): timeTable is TimeTables => timeTable !== undefined);
	}
	catch (e) {
		throw new Error("\nCannot create one or more timetable. It may be due to not defining any. Error: " + e);
	}
}

async function createAppointments(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, appointments: Partial<ExtendedAppointments>[]): Promise<void> {
	try {
		for (let i = 0; i < appointments.length; i++) {
			let appointment: Partial<ExtendedAppointments> = await prisma.appointments.create({
				select: {
					id: true,
					timetables: {
						select: {
							name: true,
						}
					},
					subject: {
						select: {
							id: true,
							subjectId: true,
						}
					}
				},
				data: {
					subject: {
						connect: {
							id: appointments[i].subject.id,
							institutionId: institutionId,
						}
					},

					timetables: {
						connect: appointments[i].timetables.map((timetable) => {
							return {
								id: timetable.id,
								institutionId: institutionId,
							}
						}),
					},
					start: appointments[i].start,
					end: appointments[i].end,
					isCancelled: appointments[i].isCancelled,
				}
			}).catch((e) => {
				console.log("\n");
				throw new Error("Cannot create appointment. It may be due to not defining any. Error occured at " + i + "\nError: " + e);
			})
			if (appointments[i].presentators.length > 0 && appointment) {
				await presentatorsToAppointments(prisma, institutionId, appointment.id, appointments[i].presentators);
			}
		}
	}
	catch (e) {
		console.log("\n");
		throw new Error("Cannot create one or more appointment. It may be due to not defining any. Error: " + e);
	}
}

async function presentatorsToAppointments(prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, institutionId: string, appointmentId: string, presentators: Partial<Presentators & {
	isSubstituted: boolean,
}>[]): Promise<void> {
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
						id: presentators[i].id,
					},
				},
				isSubstituted: presentators[i].isSubstituted || false,
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

async function updateSubjectId() {
	/*
	await prisma.subjects.update({
		data: {
			subjectId: appointment.timetable.name + "-" + appointment.subject.subjectId,
		},
		where: {
			id: appointment.subject.id,
			appointments: {
				some: {
					id: appointment.id,
				}
			}
		}
	}).catch((e) => {
		if (e instanceof PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2002':
					return;
			}
		}
		console.log("\n");
		console.error("Cannot update subject. It may be due to a mistype. Error: ", e);
		console.info("Continuing...");
	})
	*/
}