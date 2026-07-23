import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	GITHUB_TOKEN: {
		description: 'Optional GitHub personal access token for higher API rate limits',
		schema: (value: string | undefined) => value
	}
});
