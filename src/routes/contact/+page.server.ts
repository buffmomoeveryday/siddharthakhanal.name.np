import { fail } from '@sveltejs/kit';
import { SITE } from '#lib/config';
import type { Actions } from './$types';

const NTFY_TOPIC = 'siddharthakhanal-contact';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const message = String(formData.get('message') ?? '').trim();

		if (!name || !email || !message) {
			return fail(400, {
				status: 'error',
				message: 'Please fill out your name, email, and message.'
			});
		}

		const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');

		try {
			const response = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
				method: 'POST',
				headers: {
					Title: 'New contact message',
					Priority: 'default',
					Tags: 'email'
				},
				body
			});

			if (!response.ok) throw new Error(`ntfy.sh returned ${response.status}`);

			return {
				status: 'sent',
				message: 'Message sent through ntfy.sh.'
			};
		} catch {
			return fail(502, {
				status: 'error',
				message: `Could not send through ntfy.sh. Email me directly at ${SITE.email}.`
			});
		}
	}
};
