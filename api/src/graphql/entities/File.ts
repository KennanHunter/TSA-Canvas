import { extendType, objectType, stringArg } from "nexus";
import { Context } from "../../context";

export function processMinioLink(link: string): string {
	return link;
	// .replace(
	// 	"http://tsa-canvas-minio-1:9000/",
	// 	"https://localhost/minio/",
	// )
}

export const FileEntity = objectType({
	name: "File",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.field("owner", {
			type: "User",
			async resolve(parent, args, context: Context) {
				return (
					await context.prisma.fileObject.findUnique({
						where: {
							id: parent.id,
						},
						include: {
							owner: true,
						},
					})
				).owner;
			},
		});
	},
});

export const FileReturnEntity = objectType({
	name: "FileReturn",
	definition(t) {
		t.nonNull.string("link");
		t.nonNull.field("file", {
			type: "File",
			resolve(parent, args, context: Context) {
				return context.prisma.fileObject.findUnique({
					where: {
						id: (parent.link as string).split("/")[4].split("?")[0],
					},
				});
			},
		});
	},
});

export const FileMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("uploadFile", {
			type: "FileReturn",
			async resolve(parent, args, context: Context) {
				let objectId = (
					await context.prisma.fileObject.create({
						data: {
							owner: {
								connect: {
									id: context.userId,
								},
							},
						},
					})
				).id;
				console.log(objectId);

				let returnUrl = await context.minio.presignedPutObject(
					"upload",
					objectId,
				);
				console.log(processMinioLink(returnUrl));

				return {
					link: processMinioLink(returnUrl),
					objectId: { id: objectId },
				};
			},
		});
	},
});

export const FileQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.field("queryFile", {
			type: "File",
			args: {
				id: stringArg(),
			},
			async resolve(parent, args, context: Context) {
				return context.prisma.fileObject.findUnique({
					where: {
						id: args.id,
					},
					include: {
						owner: true,
					},
				});
			},
		});
		t.nonNull.list.field("allFiles", {
			type: "File",
			async resolve(parent, args, context: Context) {
				return await context.prisma.fileObject
					.findMany({
						where: {
							ownerId: context.userId,
						},
					})
					.then((value) => {
						console.log(value);
					});
			},
		});
	},
});
