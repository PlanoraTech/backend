import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
	for (let i = 0; i < 100; i++) {
		await prisma.institutions.create({
			data: {
				name: faker.company.name(),
				type: faker.helpers.arrayElements(["SCHOOL", "UNIVERSITY", "COMPANY"], 1)[0],
				access: faker.helpers.arrayElements(["PUBLIC", "PRIVATE"], 1)[0],
				color: faker.internet.color(),
				website: faker.internet.url(),
			}
		});
	}
	
	for (let i = 0; i < 5; i++) {
		await prisma.groups.create({
			data: {
				name: faker.helpers.arrayElements(["13A", "13B", "13C", "13D", "13E"], 1)[0],
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