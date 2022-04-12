import { browser } from "$app/env";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { Zeus, type GraphQLResponse, type ValueTypes } from "$zeus";
import type { LoadOutput } from "@sveltejs/kit/types/internal";

interface GQLResponse extends GraphQLResponse {
	errors?: Array<{
		message: string;
		extensions: {
			code: String;
		};
	}>;
}

export let authorizationHeader: string = undefined;

export let host: string = "https://tsa.kennan.tech";

let inited = false;

export function queryInit(hostValue?: string) {
	if (!inited) {
		inited = true;
		if (hostValue) {
			host = hostValue;
		} else {
			page.subscribe((value) => {
				host = value.url.origin;
			});
		}
	}
}

export function setAuthorizationHeader(data: string, remember: boolean) {
	authorizationHeader = data;
	if (remember) {
		document.cookie = "authentication=" + authorizationHeader;
		setAuthStorage(authorizationHeader);
	}
}

function fromAuthStorage() {
	authorizationHeader = localStorage.getItem("token");
}

export function fromCookie(response: Request) {
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
	if (browser) {
		// queryInit();
		if (!authorizationHeader) {
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

export function query(
	query: ValueTypes["Query"],
	fetchFunction?: typeof fetch,
) {
	return postEndpoint(Zeus("query", query), fetchFunction || fetch);
}

export function mutation(
	query: ValueTypes["Mutation"],
	fetchFunction?: typeof fetch,
) {
	return postEndpoint(Zeus("mutation", query), fetchFunction || fetch);
}

function authRedirect(): LoadOutput<Record<string, any>> {
	return {
		redirect: encodeURIComponent("/auth/login"),
	};
}
