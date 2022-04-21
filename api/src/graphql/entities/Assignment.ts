import { ApolloError, AuthenticationError } from "apollo-server-errors";
import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
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
		t.string("createdAt");
		t.string("dueAt");
		t.nonNull.field("class", {
			type: Class,
			async resolve(parent, args, context: Context) {
				let allowed = false;

				let query = await context.prisma.assignment.findUnique({
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
				});
				if (query.Class.ownerId === context.userId) {
					allowed = true;
					return query.Class; // Minor Optimization
				}

				query.Class.members.forEach((user) => {
					if (user.id === context.userId) {
						allowed = true;
					}
				});

				query.Class.teachers.forEach((user) => {
					if (user.id === context.userId) {
						allowed = true;
					}
				});

				if (allowed) {
					return query.Class;
				} else {
					throw new AuthenticationError(
						"Must be part of Assignment to query",
					);
				}
			},
		});
	},
});

export const AssignmentSubmission = objectType({
	name: "AssignmentSubmission",
	definition(t) {
		t.int("grade");
		t.nonNull.string("submittedAt");
		t.nonNull.string("markdownData");
		t.nonNull.field("assignment", {
			type: "Assignment",
			async resolve(parent, args, context: Context) {
				return await context.prisma.assignment.findUnique({
					where: {
						id: parent.assignmentId,
					},
				});
			},
		});
		t.nonNull.field("user", {
			type: "User",
			async resolve(parent, args, context: Context) {
				return await context.prisma.user.findUnique({
					where: {
						id: parent.userId,
					},
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
				let allowed = false;
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
					allowed = true;

					return query;
				}

				query.Class.members.forEach((user) => {
					if (user.id === context.userId) {
						allowed = true;
					}
				});

				query.Class.teachers.forEach((user) => {
					if (user.id === context.userId) {
						allowed = true;
					}
				});

				if (allowed) {
					return query;
				} else {
					throw new AuthenticationError(
						"Must be part of class to query",
					);
				}
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
				dueAt: stringArg(),
			},
			resolve(parent, args, context: Context) {
				const {
					classId,
					name,
					description,
					dueAt,
				}: {
					classId: string;
					name: string;
					description: string;
					dueAt: number;
				} = args;

				return context.prisma.assignment.create({
					data: {
						name: name,
						description: description,
						color: "",
						dueAt: new Date(dueAt),
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

export const SubmissionQuery = extendType({
	type: "Query",
	definition(t) {
		t.field("getSubmission", {
			type: "AssignmentSubmission",
			args: {
				assignmentId: nonNull(stringArg()),
			},
			async resolve(parents, args, context: Context) {
				return await context.prisma.assignmentSubmission.findFirst({
					where: {
						AND: [
							{ assignmentId: args.assignmentId },
							{ userId: context.userId },
						],
					},
				});
			},
		});
	},
});

export const SubmissionMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.field("submitAssignment", {
			type: "AssignmentSubmission",
			args: {
				assignmentId: nonNull(stringArg()),
				value: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				return await context.prisma.assignmentSubmission.upsert({
					where: {
						assignmentId_userId: {
							assignmentId: args.assignmentId,
							userId: context.userId,
						},
					},
					create: {
						assignment: {
							connect: { id: args.assignmentId },
						},
						member: {
							connect: {
								id: context.userId,
							},
						},
						markdownData: args.value,
						submitted: true,
					},
					update: {
						markdownData: args.value,
						submitted: true,
					},
				});
			},
		});
	},
});
