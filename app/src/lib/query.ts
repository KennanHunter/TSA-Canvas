import { browser, dev } from "$app/env";
import { page } from "$app/stores";
import { goto } from "$app/navigation";
import { Thunder, Zeus, type GraphQLResponse, type ValueTypes } from "$zeus";
import type { LoadOutput } from "@sveltejs/kit/types/internal";

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
		document.cookie = "authentication=" + authorizationHeader;
		setAuthStorage(authorizationHeader);
	}
}

function fromAuthStorage() {
	authorizationHeader = localStorage.getItem("token");
}

function fromCookie(response: Request) {
	authorizationHeader = response.headers["Cookie"]
		.split("; ")
		.find((row) => row.startsWith("authentication="))
		.split("=")[1];
	if (!authorizationHeader) {
		throw Error("No cookie");
	}
}

function setAuthStorage(token: string) {
	localStorage.setItem("token", token);
}

async function postEndpoint(query: string, fetchFunction: typeof fetch) {
	if (!authorizationHeader) {
		if (browser) {
			fromAuthStorage();
		}
	}

	console.log(query);

	const response = await fetchFunction(host + "/api/", {
		body: JSON.stringify({ query }),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + authorizationHeader,
		},
	});

	let jason = (await response.json()) as GQLResponse;
	if (jason.errors) {
		switch (jason.errors[0].extensions.code) {
			case "UNAUTHENTICATED":
				if (browser) {
					goto("/auth/login");
				} else {
					throw new Error("UNAUTHENTICATED");
				}
				break;
		}
	}

	console.log(jason.errors || jason.data);
	return jason.data;
}

function query(query: ValueTypes["Query"], fetchFunction?: typeof fetch) {
	return postEndpoint(Zeus("query", query), fetchFunction || fetch);
}

function mutation(query: ValueTypes["Mutation"], fetchFunction?: typeof fetch) {
	return postEndpoint(Zeus("mutation", query), fetchFunction || fetch);
}

function authRedirect(): LoadOutput<Record<string, any>> {
	return {
		redirect: encodeURIComponent("/auth/login"),
	};
}
export {
	query,
	mutation,
	setAuthorizationHeader,
	authorizationHeader,
	fromCookie,
	authRedirect,
};
