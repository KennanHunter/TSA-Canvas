import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./graphql/auth";
import { Request } from "express";
import { Client as MinioClient } from "minio";

const prisma = new PrismaClient();
const minio = new MinioClient({
	endPoint: "192.168.0.203",
	port: 9000,
	useSSL: true,
	accessKey: process.env.MINIO_ROOT_USER,
	secretKey: process.env.MINIO_ROOT_PASSWORD,
});

(async function minioInit() {
	minio.setRequestOptions({ rejectUnauthorized: false });
	console.log(await minio.listBuckets());
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
