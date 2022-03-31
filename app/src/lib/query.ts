import { browser, dev } from "$app/env";
import { page } from "$app/stores";
import { goto } from "$app/navigation";
import { Thunder, Zeus, type GraphQLResponse, type ValueTypes } from "$zeus";

interface GQLResponse extends GraphQLResponse {
	errors?: Array<{
		message: string;
		extensions: {
			code: String;
		};
	}>;
}
let authorizationHeader: string = undefined;

let host: string = "https://localhost";

function setAuthorizationHeader(data: string, remember: boolean) {
	authorizationHeader = data;
	if (remember) {
		setAuthStorage(authorizationHeader);
	}
}

function fromAuthStorage() {
	authorizationHeader = localStorage.getItem("token");
}

function setAuthStorage(token: string) {
	localStorage.setItem("token", token);
}

async function postEndpoint(query: string, fetchFunction: typeof fetch) {
	if (!authorizationHeader) {
		if (browser) {
			fromAuthStorage();
		} else {
		}
	}

	const response = await fetchFunction(host + "/api/", {
		body: JSON.stringify({ query }),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + authorizationHeader,
		},
	});

	let jason = (await response.json()) as GQLResponse;
	console.log(jason);
	if (jason.errors) {
		switch (jason.errors[0].extensions.code) {
			case "UNAUTHENTICATED":
				goto("/auth/login");
				break;
		}
	}
	return jason.data;
}

function query(query: ValueTypes["Query"], fetchFunction?: typeof fetch) {
	return postEndpoint(Zeus("query", query), fetchFunction || fetch);
}

function mutation(query: ValueTypes["Mutation"], fetchFunction?: typeof fetch) {
	return postEndpoint(Zeus("mutation", query), fetchFunction || fetch);
}

export { query, mutation, setAuthorizationHeader, authorizationHeader };
