import { AuthenticationError } from "apollo-server";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../../context";

export const Class = objectType({
	name: "Class",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.string("name");
		t.string("color");

		t.nonNull.list.field("members", {
			type: "User",
			async resolve(parent, args, context: Context) {
				return (
					await context.prisma.class.findUnique({
						where: {
							id: parent.id,
						},
						include: {
							members: true,
						},
					})
				).members;
			},
		});
		t.nonNull.list.field("teachers", {
			type: "User",
			async resolve(parent, args, context: Context) {
				return (
					await context.prisma.class.findUnique({
						where: {
							id: parent.id,
						},
						include: {
							teachers: true,
						},
					})
				).teachers;
			},
		});
		t.nonNull.field("owner", {
			type: "User",
			resolve(parent, args, context) {
				return context.prisma.class
					.findUnique({
						where: { id: parent.id },
					})
					.owner();
			},
		});
		t.list.field("assignments", {
			type: "Assignment",
			resolve(parent, args, context: Context) {
				return context.prisma.class
					.findUnique({
						where: { id: parent.id },
					})
					.assignments();
			},
		});
		t.nonNull.boolean("hasPerms", {
			async resolve(parent, args, context: Context) {
				console.log("parent id: " + parent.owner.id);
				return context.userId === parent.owner.id;
			},
		});
	},
});

export const ClassQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.field("Class", {
			type: Class,
			args: {
				classId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				let allowed = false;
				const query = await context.prisma.class.findUnique({
					where: {
						id: args.classId,
					},
					include: {
						members: true,
						owner: true,
						teachers: true,
					},
				});
				if (query.owner.id === context.userId) {
					allowed = true;
					return query; // Minor Optimization
				}

				query.members.forEach((user) => {
					if (user.id === context.userId) {
						allowed = true;
					}
				});

				query.teachers.forEach((user) => {
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

export const ClassMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("createClass", {
			type: Class,
			args: {
				name: nonNull(stringArg()),
				color: nonNull(stringArg()),
			},
			resolve(parent, args, context: Context) {
				const { name, color } = args;

				const newClass = context.prisma.class.create({
					data: {
						name,
						color,
						owner: { connect: { id: context.userId } },
					},
				});

				return newClass;
			},
			// });
			// t.nonNull.field("addMember", {
			// 	type: Class,
			// 	args: {
			// 		classId: nonNull(stringArg()),
			// 		studentId: nonNull(stringArg()),
			// 	},
			// 	async resolve(parent, args, context: Context) {
			// 		const { classId, studentId } = args;

			// 		if (
			// 			(
			// 				await context.prisma.class
			// 					.findUnique({
			// 						where: {
			// 							id: classId,
			// 						},
			// 					})
			// 					.owner()
			// 			).id !== context.userId
			// 		) {
			// 			throw new AuthenticationError("User does not own class");
			// 		}

			// 	const newClass = context.prisma.class.update({
			// 		where: {
			// 			id: classId,
			// 		},
			// 		data: {
			// 			members: {
			// 				connect: {
			// 					id: studentId,
			// 				},
			// 			},
			// 		},
			// 	});

			// 	return newClass;
			// },
		});

		/**
		 * Adds Teacher
		 */
		t.nonNull.field("addTeacher", {
			type: Class,
			args: {
				classId: nonNull(stringArg()),
				teacherId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				const { classId, teacherId } = args;

				if (
					(
						await context.prisma.class
							.findUnique({
								where: {
									id: classId,
								},
							})
							.owner()
					).id !== context.userId
				) {
					throw new AuthenticationError("User does not own class");
				}

				const newClass = context.prisma.class.update({
					where: {
						id: classId,
					},
					data: {
						members: {
							connect: {
								id: teacherId,
							},
						},
					},
				});

				return newClass;
			},
		});

		/**
		 * Removes student from class
		 */
		t.nonNull.field("removeMember", {
			type: Class,
			args: {
				classId: nonNull(stringArg()),
				studentId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				const { classId, studentId } = args;

				if (
					(
						await context.prisma.class
							.findUnique({
								where: {
									id: classId,
								},
							})
							.owner()
					).id !== context.userId
				) {
					throw new AuthenticationError("User does not own class");
				}

				const newClass = context.prisma.class.update({
					where: {
						id: classId,
					},
					data: {
						members: {
							disconnect: {
								id: studentId,
							},
						},
					},
				});

				return newClass;
			},
		});

		/**
		 * Removes teacher from class
		 */
		t.nonNull.field("removeTeacher", {
			type: Class,
			args: {
				classId: nonNull(stringArg()),
				teacherId: nonNull(stringArg()),
			},
			async resolve(parent, args, context: Context) {
				const { classId, teacherId } = args;

				if (
					(
						await context.prisma.class
							.findUnique({
								where: {
									id: classId,
								},
							})
							.owner()
					).id !== context.userId
				) {
					throw new AuthenticationError("User does not own class");
				}

				const newClass = context.prisma.class.update({
					where: {
						id: classId,
					},
					data: {
						members: {
							connect: {
								id: teacherId,
							},
						},
					},
				});

				return newClass;
			},
		});
	},
});
