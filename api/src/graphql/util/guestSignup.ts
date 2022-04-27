import { extendType } from "nexus";
import { Context } from "../../context";
import { hashIterations } from "../auth";
import { guestClassId } from "./defaultData";
import * as bcrypt from "bcrypt";

export const guestMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("signUpGuest", {
			type: "User",
			async resolve(parent, args, context: Context) {
				let number = Math.round(Math.random() * 10000).toString();
				let user = await context.prisma.user.create({
					data: {
						name: "Guest " + number,
						email:
							"Guest_" +
							Buffer.from(number).toString("base64") +
							"@tsa.kennan.tech",
						password: await bcrypt.hash(
							"GuestPassword",
							hashIterations,
						),
						isGuest: true,
						avatar: "",
						Todo: {
							createMany: {
								data: [
									{
										text: "Check out this sick Todo",
										completed: false,
									},
								],
							},
						},
					},
				});
				await context.prisma.class.update({
					where: {
						id: guestClassId,
					},
					data: {
						members: {
							connect: [{ id: user.id }],
						},
					},
				});
				return user;
			},
		});
	},
});
