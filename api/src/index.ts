import { ApolloServer } from "apollo-server";
import { context } from "./context";

import { schema } from "./schema";
// import { populate } from "./data/populate";

const server = new ApolloServer({
	schema,
	context,
});

server.listen(process.env.PORT || 4000).then(({ url }) => {
	console.log(`Server online at ${url}`);
});

// populate()
