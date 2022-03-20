import { Thunder } from "$zeus";

let authorizationHeader: string =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbDB5ZWszOXQwMDA0OGFwZm53MzBmam9yIiwiaXNHdWVzdCI6ZmFsc2UsImlhdCI6MTY0NzcyNzc0N30.v1I05w0M2Jo-ZtWjog6ztNcuRILafA3jgbKzye-FtZQ";

let thunder = Thunder(async (query) => {
	const response = await fetch("https://localhost/api", {
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
	return json.data;
});

function setAuthorizationHeader(data: string) {
	authorizationHeader = data;
}

const query = thunder("query");

const mutation = thunder("mutation");

export { query, setAuthorizationHeader, mutation, authorizationHeader };
