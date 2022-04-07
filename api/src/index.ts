import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { request } from "express";
import { context, Context } from "./context";

require("dotenv").config({ path: "../.env" });

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
