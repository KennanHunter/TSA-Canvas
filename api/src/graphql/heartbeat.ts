import { extendType, objectType } from "nexus";
import { Context } from "../context";

export const heartbeat = extendType({
	type: "Query",
	definition(t) {
		t.field("heartbeat", {
			type: "Boolean",
			async resolve(parent, args, context: Context) {
				return true;
			},
		});
	},
});
