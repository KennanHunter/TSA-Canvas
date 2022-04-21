import { goto } from "$app/navigation";
import { setAuthorizationHeader } from "./query";
import { toast } from "@zerodevx/svelte-toast";

export function logout() {
	setAuthorizationHeader("", true);
	goto("/auth/login");
	toast.push("Logout Successful");
}
