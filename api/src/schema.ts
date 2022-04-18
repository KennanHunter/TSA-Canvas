import * as types from "./graphql";
import { makeSchema } from "nexus";
import { join } from "path";

export const schema = makeSchema({
	types,
	outputs: {
		typegen: join(process.cwd(), "./dist/nexus-typegen.ts"),
		schema: join(process.cwd(), "./dist/schema.graphql"),
	},
	contextType: {
		module: join(process.cwd(), "./src/context.ts"),
		export: "Context",
	},
});

console.log("GraphQL Schema Generated");
