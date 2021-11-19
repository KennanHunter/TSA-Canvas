import Home from "./routes/Home.svelte";
import Assignment from "./routes/Assignment.svelte";
import NotFound from "./routes/NotFound.svelte";

export default {
	"/": Home,
	"/assignment/:id": Assignment,
	// The catch-all route must always be last
	"*": NotFound,
};
