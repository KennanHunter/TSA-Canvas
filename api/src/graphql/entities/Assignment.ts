import { ApolloError, AuthenticationError } from "apollo-server-errors";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../../context";
import { Class } from "./Class";

export const Assignment = objectType({
	name: "Assignment",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.string("name");
		t.nonNull.string("description");
		t.nonNull.string("color");
		t.nonNull.int("maxGrade");
		t.nonNull.field("class", {
			type: Class,
			resolve(parent, args, context: Context) {
				context.prisma.assignment
					.findUnique({
						where: {
							id: parent.id,
						},
						include: {
							Class: {
								include: {
									members: true,
									teachers: true,
								},
							},
						},
					})
					.then((value) => {
						value.Class.members.forEach((member) => {
							if (context.userId === member.id) {
								return value.Class;
							}
						});
						value.Class.teachers.forEach((member) => {
							if (context.userId === member.id) {
								return value.Class;
							}
						});
						if (context.userId === value.Class.ownerId) {
							return value.Class;
						}
						throw new AuthenticationError(
							"Must be part of assignment to query",
						);
					});
			},
		});
	},
});

export const AssignmentQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.field("Assignment", {
			type: Assignment,
			args: {
				// classId: nonNull(stringArg()),
				assignmentId: nonNull(stringArg()),
			},
			async resolve(
				parent,
				args: { classId: string; assignmentId: string },
				context: Context,
			) {
				let query = await context.prisma.assignment
					.findUnique({
						where: {
							id: args.assignmentId,
						},
						include: {
							Class: {
								include: {
									members: true,
									teachers: true,
									owner: true,
								},
							},
						},
					})
					.catch(() => {
						throw new ApolloError("Assignment doesn't exist");
					});

				if (query.Class.owner.id === context.userId) {
					return query;
				}

				query.Class.members.forEach((user) => {
					if (user.id === context.userId) {
						return query;
					}
				});

				query.Class.teachers.forEach((user) => {
					if (user.id === context.userId) {
						return query;
					}
				});

				throw new AuthenticationError("Must be part of class to query");
			},
		});
	},
});

export const AssignmentMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("newAssignment", {
			type: Assignment,
			args: {
				classId: nonNull(stringArg()),
				name: nonNull(stringArg()),
				description: stringArg(),
			},
			resolve(parent, args, context: Context) {
				const {
					classId,
					name,
					description,
				}: { classId: string; name: string; description: string } =
					args;

				return context.prisma.assignment.create({
					data: {
						name: name,
						description: description,
						color: "",
						Class: {
							connect: {
								id: classId,
							},
						},
					},
					include: {
						Class: {
							include: {
								teachers: true,
							},
						},
					},
				});
			},
		});
	},
});
