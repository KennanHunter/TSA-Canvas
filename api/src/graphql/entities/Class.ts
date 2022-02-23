import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../../context";

export const Class = objectType({
	name: "Class",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.string("name");
		// t.nonNull.color("color");
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
	},
});

export const ClassFeed = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.list.nonNull.field("classFeed", {
			type: "Class",
			resolve(parent, args, context) {
				return context.prisma.class.findMany();
			},
		});
	},
});

export const ClassMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("create", {
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
		});
	},
});
