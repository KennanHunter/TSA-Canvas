import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./graphql/auth";
import { Request } from "express";
import { Client as MinioClient } from "minio";
import { AuthenticationError } from "apollo-server-errors";

const prisma = new PrismaClient();
const minio = new MinioClient({
	endPoint: "tsa.kennan.tech",
	port: 9000,
	useSSL: true,
	accessKey: process.env.MINIO_ROOT_USER,
	secretKey: process.env.MINIO_ROOT_PASSWORD,
});

(async function minioInit() {
	minio.setRequestOptions({ rejectUnauthorized: false });
	await minio
		.listBuckets()
		.then((value) => {
			console.log(value);
		})
		.catch(() => {
			console.error("Cannot connect to minio");
		});
})();

export interface Context {
	prisma: PrismaClient;
	minio: MinioClient;
	userId?: string;
}

export const context = ({ req }: { req: Request }): Context => {
	const token =
		req && req.headers.authorization
			? decodeAuthHeader(req.headers.authorization)
			: null;

	return {
		prisma,
		minio,
		userId: token?.userId,
	} as Context;
};
