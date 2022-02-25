import { ApolloServer } from "apollo-server";
import { context } from "./context";

import { schema } from "./schema";

const server = new ApolloServer({
	schema,
	context,
});

server.listen().then(({ url }) => {
	console.log("Server online");
});
