import Home from "./routes/Home.svelte";
import Assignment from "./routes/Assignment.svelte";
import NotFound from "./routes/NotFound.svelte";
import Login from "./routes/Login.svelte";

export default {
	"/": Home,
	"/assignment/:id": Assignment,
	"/login": Login,
	// The catch-all route must always be last
	"*": NotFound,
};
