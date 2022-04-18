import { prisma, PrismaClient } from "@prisma/client";
import { hashIterations } from "../auth";
import * as bcrypt from "bcrypt";

export let guestClassId = "";

export function populate() {
	const prisma = new PrismaClient();

	(async () => {
		const adminUser = await prisma.user.create({
			data: {
				name: "admin",
				email: "admin@tsa.kennan.tech",
				password: await bcrypt.hash("admin", hashIterations),
				isGuest: false,
				avatar: "",
			},
		});
		const guestClass = await prisma.class.create({
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
						description:
							"This is a example assignment pre-populated to show the capabilities of Red Panda LMS",
						color: "",
						dueAt: new Date(2022, 8, 10, 3, 24, 0),
					},
				},
			},
		});

		console.log("Population Successful");
	})().catch(() => {
		prisma.class
			.findFirst({
				where: {
					AND: [
						{
							name: "Example Class",
						},
						{
							owner: {
								email: "admin@tsa.kennan.tech",
							},
						},
					],
				},
			})
			.then((value) => {
				guestClassId = value.id;
				console.log("Population Already Occured");
				console.log("Guest Class Id is: " + guestClassId);
			});
	});
}
