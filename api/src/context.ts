import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient;
	userId?: number;
}

export const context = ({ req }: { req: Request }): Context => {
	const token = null;
	// req && req.headers.authorization
	// 	? decodeAuthHeader(req.headers.authorization)
	// 	: null;

	return {
		prisma,
		userId: token?.userId,
	};
};
