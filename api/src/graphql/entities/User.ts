import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../../context";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../auth";

export const User = objectType({
	name: "User",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.string("name");
		t.string("pronouns");
		t.nonNull.string("email");
		t.nonNull.boolean("isGuest");
	},
});

export const UserMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("Signup", {
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
				const token = jwt.sign(payload, process.env.APP_SECRET);

				console.log(context.userId);

				return {
					user,
					token,
				};
			},
		});
	},
});
