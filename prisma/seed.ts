import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
	for (let i = 0; i < 30; i++) {
		await prisma.institutions.create({
			data: {
				name: faker.company.name() + i,
				type: faker.helpers.arrayElements(["SCHOOL", "UNIVERSITY", "COMPANY"], 1)[0],
				access: faker.helpers.arrayElements(["PUBLIC", "PRIVATE"], 1)[0],
				color: faker.internet.color(),
				website: faker.internet.url(),
			}
		});
	}

	for (let i = 0; i < 500; i++) {
		await prisma.presentators.create({
			data: {
				name: faker.person.fullName() + i,
				institution: {
					connect: {
						id: await prisma.institutions.findMany({
							select: {
								id: true,
							},
						}).then((institutions) => {
							return faker.helpers.arrayElements(institutions, 1)[0].id;
						}),
					},
				},
			}
		})
	}

	for (let i = 0; i < 100; i++) {
		await prisma.subjects.create({
			data: {
				name: faker.lorem.word() + i,
				subjectId: faker.lorem.word(),
				institution: {
					connect: {
						id: await prisma.institutions.findMany({
							select: {
								id: true,
							},
						}).then((institutions) => {
							return faker.helpers.arrayElements(institutions, 1)[0].id;
						}),
					},
				},
			}
		});
	}

	for (let i = 0; i < 100; i++) {
		await prisma.rooms.create({
			data: {
				name: faker.commerce.department() + i,
				isAvailable: faker.datatype.boolean(),
				institution: {
					connect: {
						id: await prisma.institutions.findMany({
							select: {
								id: true,
							},
						}).then((institutions) => {
							return faker.helpers.arrayElements(institutions, 1)[0].id;
						}),
					},
				},
			}
		});
	}

	for (let i = 0; i < 100; i++) {
		await prisma.events.create({
			data: {
				title: faker.lorem.word() + i,
				date: faker.date.future(),
			}
		});
	}

	for (let i = 0; i < 100; i++) {
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
						id: await prisma.institutions.findMany({
							select: {
								id: true,
							},
						}).then((institutions) => {
							return faker.helpers.arrayElements(institutions, 1)[0].id;
						}),
					},
				},
			}
		});
	};

	for (let i = 0; i < 1000; i++) {
		let start = Number(faker.date.recent());
		let appointment = await prisma.appointments.create({
			data: {
				subject: {
					connect: {
						id: await prisma.subjects.findMany({
							select: {
								id: true,
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
						}).then((timeTables) => {
							return faker.helpers.arrayElements(timeTables, 1)[0].id;
						}),
					},
				},
				dayOfWeek: faker.helpers.arrayElements(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], 1)[0],
				start: new Date(start + i * 10),
				end: new Date(start + i * 30),
				isCancelled: faker.datatype.boolean(),
			}
		})
		await prisma.presentatorsToAppointments.create({
			data: {
				presentator: {
					connect: {
						id: await prisma.presentators.findMany({
							select: {
								id: true,
							},
						}).then((presentators) => {
							return faker.helpers.arrayElements(presentators, 1)[0].id;
						}),
					}
				},
				appointment: {
					connect: {
						id: appointment.id
					}
				},
				isSubstituted: false,
			}
		});
	}
}

seed()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	});