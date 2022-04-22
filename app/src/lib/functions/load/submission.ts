import { query } from "$lib/functions/query";
import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

export async function load({
	params,
	fetch,
}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
	let data = await query(
		{
			getSubmission: [
				{
					assignmentId: params.assignmentId,
				},
				{
					submittedAt: true,
					grade: true,
					markdownData: true,
					assignment: {
						class: {
							hasPerms: true,
						},
					},
					user: {
						id: true,
					},
				},
			],
		},
		fetch,
	);

	let userData = await query({
		self: {
			id: true,
			ownedClasses: {
				id: true,
			},
		},
	});

	if (data.getSubmission) {
		return {
			status: 302,
			redirect: userData.self.id,
		};
	} else {
		let isOwner = false;
		(userData.self.ownedClasses as { id: string }[]).forEach((value) => {
			if (value.id === params.id) {
				isOwner = true;
			}
		});

		if (isOwner) {
			let value = await getAllSubmissions(params);

			return {
				props: {
					submissions: value.getAllSubmissions,
				},
			};
		} else {
			return {
				status: 302,
				redirect: "create",
			};
		}
	}
}

function getAllSubmissions(params) {
	return query({
		getAllSubmissions: [
			{
				assignmentId: params.assignmentId,
			},
			{
				user: {
					name: true,
				},
				grade: true,
			},
		],
	});
}
