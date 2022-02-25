import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../../context";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../auth";
import { AuthenticationError } from "apollo-server";
import { prisma, User as Userobject } from "@prisma/client";

export const User = objectType({
	name: "User",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.string("name");
		t.string("pronouns");
		t.nonNull.string("email");
		t.nonNull.boolean("isGuest");
		t.list.field("ownedClasses", {
			type: "Class",
			async resolve(parent, args, context: Context) {
				if (parent.id === context.userId) {
					return (
						await context.prisma.user.findUnique({
							where: { id: parent.id },
							include: {
								ownedClasses: true,
							},
						})
					).ownedClasses;
				} else {
					throw new AuthenticationError(
						"You are not allowed to see this data",
					);
				}
			},
		});
		t.list.field("memberClasses", {
			type: "Class",
			async resolve(parent, args, context: Context) {
				if (parent.id === context.userId) {
					return (
						await context.prisma.user.findUnique({
							where: { id: parent.id },
							include: {
								memberClasses: true,
							},
						})
					).memberClasses;
				} else {
					throw new AuthenticationError(
						"You are not allowed to see this data",
					);
				}
			},
		});
		t.list.field("taughtClasses", {
			type: "Class",
			async resolve(parent, args, context: Context) {
				if (parent.id === context.userId) {
					return (
						await context.prisma.user.findUnique({
							where: { id: parent.id },
							include: {
								taughtClasses: true,
							},
						})
					).taughtClasses;
				} else {
					throw new AuthenticationError(
						"You are not allowed to see this data",
					);
				}
			},
		});
	},
});

export const UserMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("signup", {
			type: "AuthPayload",
			args: {
				email: nonNull(stringArg()),
				password: nonNull(stringArg()),
				name: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				const { email, name } = args;

				const password = await bcrypt.hash(args.password, 10);

				const user = await context.prisma.user.create({
					data: {
						email,
						name,
						password,
						isGuest: false,
						avatar: "",
					},
				});

				const payload: AuthTokenPayload = {
					userId: user.id,
					isGuest: user.isGuest,
				};
				const token = jwt.sign(payload, process.env.JWT_SECRET);

				return {
					user,
					token,
				};
			},
		});
		t.nonNull.field("login", {
			type: "AuthPayload",
			args: {
				email: nonNull(stringArg()),
				password: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				const user = await context.prisma.user.findUnique({
					where: {
						email: args.email,
					},
				});

				const valid = await bcrypt.compare(
					args.password,
					user.password,
				);

				if (!user || !valid) {
					throw new Error("Invalid Username or Password");
				}

				const payload: AuthTokenPayload = {
					userId: user.id,
					isGuest: user.isGuest,
				};

				const token = jwt.sign(payload, process.env.JWT_SECRET);

				return {
					user,
					token,
				};
			},
		});

		t.nonNull.field("update", {
			type: "User",
			args: {
				pronouns: stringArg(),
				avatar: stringArg(),
			},
			async resolve(parent, args, context: Context): Promise<Userobject> {
				if (!context.userId) {
					throw new AuthenticationError(
						"Must be signed in to update user",
					);
				}

				let updatedData: any = {};

				if (args.pronouns) {
					updatedData.pronouns = args.pronouns;
				}
				if (args.avatar) {
					updatedData.avatar = args.avatar;
				}

				const user = context.prisma.user.update({
					where: {
						id: context.userId,
					},
					data: updatedData,
				});

				return user as Promise<Userobject>;
			},
		});
		/**
		 * Deleting is impossible without having to deal with relations
		 */
		// t.nonNull.field("delete", {
		// 	type: "User",
		// 	resolve(parent, args, context: Context) {
		// 		const deletedUser = context.prisma.user.delete({
		// 			where: {
		// 				id: context.userId,
		// 			},
		// 		});

		// 		return deletedUser;
		// 	},
		// });
	},
});

export const selfQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.field("self", {
			type: "User",
			resolve(parent, args, context: Context) {
				if (!context.userId) {
					throw new AuthenticationError(
						"Cannot do query while not logged in",
					);
				}
				return context.prisma.user.findUnique({
					where: {
						id: context.userId,
					},
					include: {
						memberClasses: true,
						ownedClasses: true,
						taughtClasses: true,
					},
				});
			},
		});
	},
});
