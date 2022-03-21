import { browser, dev } from "$app/env";
import { page } from "$app/stores";
import { Thunder } from "$zeus";
import { onMount } from "svelte";

let authorizationHeader: string = undefined;

let host: string = "https://localhost";

let thunder = Thunder(async (query) => {
	if (!browser) {
		throw new Error("Can't run queries on server");
	}

	if (!authorizationHeader) {
		fromAuthStorage();
	}
	console.log(query);

	const response = await fetch(host + "/api/", {
		body: JSON.stringify({ query }),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + authorizationHeader,
		},
	});

	if (!response.ok) {
		return new Promise((resolve, reject) => {
			response
				.text()
				.then((text) => {
					try {
						reject(JSON.parse(text));
					} catch (err) {
						reject(text);
					}
				})
				.catch(reject);
		});
	}

	const json = await response.json();
	console.log(json);
	return json.data;
});

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

const query = thunder("query");

const mutation = thunder("mutation");

export { query, setAuthorizationHeader, mutation, authorizationHeader };
