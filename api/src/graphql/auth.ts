import { objectType } from "nexus";
import * as jwt from "jsonwebtoken";

export const AuthPayload = objectType({
	name: "AuthPayload",
	definition(t) {
		t.nonNull.string("token");
		t.nonNull.field("user", {
			type: "User",
		});
	},
});

export interface AuthTokenPayload {
	userId: string;
	isGuest: boolean;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
	const token = authHeader.replace("Bearer ", "");

	if (!token) {
		throw new Error("No token found");
	}
	return jwt.verify(token, process.env.APP_SECRET) as AuthTokenPayload;
}
