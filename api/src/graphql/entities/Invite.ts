import { Context } from "../../context";
import { extendType, nonNull, stringArg } from "nexus";
import { AuthenticationError } from "apollo-server";

export const queryInvite = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.field("getInvite", {
			type: "Class",
			args: {
				inviteId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				let data = await context.prisma.classInvites
					.findUnique({
						where: { id: args.inviteId },
					})
					.Class();
				return data;
			},
		});
	},
});

export const genInvite = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("genInvite", {
			type: "String",
			args: {
				classId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				return (
					await context.prisma.classInvites.create({
						data: {
							Class: {
								connect: {
									id: args.classId,
								},
							},
						},
					})
				).id;
			},
		});

		t.nonNull.field("acceptInvite", {
			type: "Class",
			args: {
				inviteId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				if (context.userId) {
					let invite = await context.prisma.classInvites.findUnique({
						where: {
							id: args.inviteId,
						},
					});

					return await context.prisma.class.update({
						where: {
							id: invite.classId,
						},
						data: {
							members: {
								connect: {
									id: context.userId,
								},
							},
						},
					});
				} else {
					return new AuthenticationError("Must be logged in");
				}
			},
		});
	},
});
