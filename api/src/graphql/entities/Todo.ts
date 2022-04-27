import { extendType, objectType, stringArg } from "nexus";
import { Context } from "../../context";

export const Todo = objectType({
	name: "Todo",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.boolean("completed");
		t.string("text");
		t.field("owner", {
			type: "User",
			resolve(parent, args, context: Context) {
				context.prisma.todo
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.owner();
			},
		});
	},
});

export const TodoMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("createTodo", {
			type: "Todo",
			args: {
				text: stringArg(),
			},
			resolve(parent, args, context: Context) {
				return context.prisma.todo.create({
					data: {
						text: args.text,
						completed: false,
						owner: {
							connect: {
								id: context.userId,
							},
						},
					},
				});
			},
		});
		t.nonNull.field("completeTodo", {
			type: "Todo",
			args: {
				id: stringArg(),
			},
			resolve(parent, args, context: Context) {
				return context.prisma.todo.update({
					where: {
						id: args.id,
					},
					data: {
						completed: true,
					},
				});
			},
		});
	},
});
