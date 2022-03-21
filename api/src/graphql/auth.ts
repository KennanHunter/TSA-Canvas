import { objectType } from "nexus";
import * as jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-errors";

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

export function decodeAuthHeader(
	authHeader: String,
): AuthTokenPayload | AuthenticationError {
	const token = authHeader.replace("Bearer ", "");

	if (!token) {
		throw new Error("No token found");
	}
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		return verified as AuthTokenPayload;
	} catch {
		return new AuthenticationError("Not logged in");
	}
}
