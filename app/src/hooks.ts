import cookie from "cookie";
import { v4 as uuid } from "@lukeed/uuid";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get("cookie") || "");
	event.locals.userid = cookies.userid || uuid();

	const response = await resolve(event);

	console.log(Date.now());
	return response;
};
