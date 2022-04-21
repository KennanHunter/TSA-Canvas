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
		.catch(async () => {
			adminUser = await prisma.user.findUnique({
				where: {
					email: "admin@tsa.kennan.tech",
				},
			});
		});
	if (!adminUser) {
		throw new Error();
	}
	let guestClass = await prisma.class
		.create({
			data: {
				name: "Example Class",
				owner: {
					connect: {
						id: adminUser.id,
					},
				},
				color: "",
				assignments: {
					create: {
						name: "Example Assignment",
						description: readFileSync(
							resolve(__dirname, "defaultAssignment.md"),
						).toString(),
						color: "#ffffff",
						dueAt: new Date(2022, 8, 10, 3, 24, 0),
					},
				},
			},
		})
		.catch(async () => {
			guestClass = await prisma.class.findFirst({
				where: {
					name: "Example Class",
					ownerId: (adminUser as User).id,
				},
			});
		});
	if (!guestClass) {
		throw new Error();
	}

	guestClassId = guestClass.id;

	console.log("Population Successful");
	console.log("Guest Class Id is: " + guestClassId);
}
