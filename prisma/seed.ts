import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const numberOfItems = {
	institutions: 25,
	presentators: 100,
	subjects: 30,
	rooms: 60,
	events: 30,
	timeTables: 10,
	appointments: 300,
	presentatorsToAppointments: 2,
}

let progress = 0;
let interval = setInterval(getProgress, 100)

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

async function presentatorsToAppointments(appointmentId: string, institutionId: string): Promise<void> {
	await prisma.presentatorsToAppointments.create({
		data: {
			appointment: {
				connect: {
					id: appointmentId,
				},
			},
			presentator: {
				connect: {
					id: await prisma.presentators.findMany({
						select: {
							id: true,
						},
						where: {
							institutionId: institutionId,
						},
					}).then((presentators) => {
						return faker.helpers.arrayElements(presentators, 1)[0].id;
					}),
				},
			},
			isSubstituted: faker.datatype.boolean(),
		}
	}).catch(async (e) => {
		console.log("\n");
		console.info("------------	START OF MESSAGE THAT CAN BE IGNORED	------------")
		console.error(e);
		console.info("------------	END OF MESSAGE THAT CAN BE IGNORED		------------")
		await presentatorsToAppointments(appointmentId, institutionId);
	});
}

async function seed(): Promise<void> {
	for (let a = 0; a < numberOfItems.institutions; a++) {
		let institution = await prisma.institutions.create({
			data: {
				name: faker.company.name() + a,
				type: faker.helpers.arrayElements(["SCHOOL", "UNIVERSITY", "COMPANY"], 1)[0],
				access: faker.helpers.arrayElements(["PUBLIC", "PRIVATE"], 1)[0],
				color: faker.internet.color(),
				website: faker.internet.url(),
			}
		});

		for (let i = 0; i < numberOfItems.presentators; i++) {
			await prisma.presentators.create({
				data: {
					name: faker.person.fullName() + i,
					institution: {
						connect: {
							id: institution.id,
						},
					},
				}
			})
		}

		for (let i = 0; i < numberOfItems.subjects; i++) {
			await prisma.subjects.create({
				data: {
					name: faker.lorem.word() + i,
					subjectId: faker.lorem.word(),
					institution: {
						connect: {
							id: institution.id,
						},
					},
				}
			});
		}

		for (let i = 0; i < numberOfItems.rooms; i++) {
			await prisma.rooms.create({
				data: {
					name: faker.commerce.department() + i,
					institution: {
						connect: {
							id: institution.id,
						},
					},
				}
			});
		}

		for (let i = 0; i < numberOfItems.events; i++) {
			await prisma.events.create({
				data: {
					title: faker.lorem.word() + i,
					date: faker.date.future(),
				}
			});
		}

		for (let i = 0; i < numberOfItems.timeTables; i++) {
			await prisma.timeTables.create({
				data: {
					name: faker.lorem.word() + i,
					events: {
						connect: {
							id: await prisma.events.findMany({
								select: {
									id: true,
								},
							}).then((events) => {
								return faker.helpers.arrayElements(events, 1)[0].id;
							}),
						},
					},
					institution: {
						connect: {
							id: institution.id,
						},
					},
				}
			});
		};

		let start = Number(faker.date.recent());
		for (let i = 0; i < numberOfItems.appointments; i++) {
			start += i * 1000;
			let appointment = await prisma.appointments.create({
				data: {
					subject: {
						connect: {
							id: await prisma.subjects.findMany({
								select: {
									id: true,
								},
								where: {
									institutionId: institution.id,
								},
							}).then((subjects) => {
								return faker.helpers.arrayElements(subjects, 1)[0].id;
							}),
						},
					},
					rooms: {
						connect: {
							id: await prisma.rooms.findMany({
								select: {
									id: true,
								},
								where: {
									institutionId: institution.id,
								},
							}).then((rooms) => {
								return faker.helpers.arrayElements(rooms, 1)[0].id;
							}),
						},
					},
					timetables: {
						connect: {
							id: await prisma.timeTables.findMany({
								select: {
									id: true,
								},
								where: {
									institutionId: institution.id,
								},
							}).then((timeTables) => {
								return faker.helpers.arrayElements(timeTables, 1)[0].id;
							}),
						},
					},
					start: new Date(start),
					end: new Date(start + i * 1000),
					isCancelled: faker.datatype.boolean(),
				}
			})
			for (let y = 0; y < numberOfItems.presentatorsToAppointments; y++) {
				await presentatorsToAppointments(appointment.id, institution.id);
			}
		}
		progress += 100 / numberOfItems.institutions;
	}
}