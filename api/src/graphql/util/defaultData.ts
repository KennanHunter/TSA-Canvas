import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { resolve } from "path";
import { hashIterations } from "../auth";

export let guestClassId = "";

export async function populate() {
	const prisma = new PrismaClient();

	let adminUser = await prisma.user
		.create({
			data: {
				name: "admin",
				email: "admin@tsa.kennan.tech",
				password: await bcrypt.hash("admin", hashIterations),
				isGuest: false,
				avatar: "",
			},
		})
		.catch(() => {});
	if (!adminUser) {
		adminUser = await prisma.user.findUnique({
			where: {
				email: "admin@tsa.kennan.tech",
			},
		});
	}

	let guestClass = await prisma.class
		.findFirst({
			where: {
				name: "Example Class",
				ownerId: (adminUser as User).id,
			},
		})
		.catch(() => {});
	if (!guestClass) {
		guestClass = await prisma.class
			.create({
				data: {
					name: "Example Class",
					owner: {
						connect: {
							id: adminUser.id,
						},
					},
					description: readFileSync(
						resolve(__dirname, "defaultClassDescription.md"),
					).toString(),
					color: "",
					assignments: {
						create: {
							name: "Example Assignment",
							description: readFileSync(
								resolve(__dirname, "defaultAssignment.md"),
							).toString(),
							color: "#ffffff",
							dueAt: new Date(2022, 8, 10, 3, 24, 0),
							maxGrade: 100,
						},
					},
				},
			})
			.catch(async () => {});
	}
	if (!guestClass) {
		throw new Error();
	}
	guestClassId = guestClass.id;

	console.log("Population Successful");
	console.log("Guest Class Id is: " + guestClassId);
}
