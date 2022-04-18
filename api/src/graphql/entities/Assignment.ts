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
		t.int("dueAt");
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
		t.nonNull.string("grade");
		t.nonNull.int("submittedAt");
		t.nonNull.field("assignment", {
			type: "Assignment",
			async resolve(parent, args, context: Context) {
				console.log(parent);
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
				fileId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				return await context.prisma.assignmentSubmission.create({
					data: {
						file: {
							connect: {
								id: args.fileId,
							},
						},
						assignment: {
							connect: { id: args.assignmentId },
						},
						member: {
							connect: {
								id: context.userId,
							},
						},
						submitted: true,
					},
				});
			},
		});
	},
});
