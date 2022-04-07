import { extendType, objectType, stringArg } from "nexus";
import { Context } from "../../context";

export const FileEntity = objectType({
	name: "File",
	definition(t) {
		t.nonNull.string("id");
		t.nonNull.field("owner", {
			type: "User",
			async resolve(parent, args, context: Context) {
				context.prisma.user.findUnique({
					where: {
						id: parent.id,
					},
				});
			},
		});
	},
});

export const FileReturnEntity = objectType({
	name: "FileReturn",
	definition(t) {
		t.nonNull.string("link");
		t.nonNull.string("id");
		t.nonNull.field("file", {
			type: "File",
			resolve(parent, args, context: Context) {
				return context.prisma.fileObject.findUnique({
					where: {
						id: parent.id,
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

				let returnUrl = await context.minio
					.presignedPutObject("upload", objectId)
					.catch((err) => {
						throw new Error(err);
					});
				console.log(returnUrl);

				return {
					link: returnUrl,
					objectId: objectId,
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
				context.prisma.fileObject.findUnique({
					where: {
						id: args.id,
					},
				});
			},
		});
	},
});
