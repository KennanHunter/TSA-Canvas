import { goto } from "$app/navigation";
import { authorizationHeader, fromCookie } from "$lib/query";
import type { ExternalFetch, Handle } from "@sveltejs/kit";
import type {
	LoadOutput,
	RequestEvent,
	ResolveOptions,
} from "@sveltejs/kit/types/internal";

export async function externalFetch(request) {
	if (request.url.startsWith("https://localhost/api")) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace(
				"https://localhost/api",
				"http://tsa-canvas-api-1:8000/api",
			),
			request,
		);
	}

	return fetch(request);
}

export function handle({
	event,
	resolve,
}: {
	event: RequestEvent;
	resolve(event: RequestEvent, opt?: ResolveOptions);
}) {
	try {
		fromCookie(event.request as Request);
	} catch {
		return resolve(event, {
			ssr: false,
		});
	}
	return resolve(event);
}
