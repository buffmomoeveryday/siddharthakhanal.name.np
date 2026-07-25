import { form } from '$app/server';
import { SITE } from '#lib/config';
import * as v from 'valibot';

const ContactSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.nonEmpty('Please enter your email.'), v.email()),
	name: v.pipe(v.string(), v.trim(), v.nonEmpty('Please enter your name.')),
	message: v.pipe(v.string(), v.trim(), v.nonEmpty('Please enter a message.'))
});

const NTFY_TOPIC = 'siddharthakhanal-contact';
const NTFY_TIMEOUT_MS = 8_000;

async function sendNtfy(body: string) {
	const response = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
		method: 'POST',
		headers: {
			Title: 'New contact message',
			Priority: 'high',
			Tags: 'email'
		},
		body,
		signal: AbortSignal.timeout(NTFY_TIMEOUT_MS)
	});

	if (!response.ok) {
		throw new Error(`ntfy.sh returned ${response.status}`);
	}
}

function logNtfyFailure(error: unknown) {
	const message = error instanceof Error ? error.message : String(error);

	console.error(`Ntfy delivery failed: ${message}`);
}

export const contactForm = form(ContactSchema, async ({ email, name, message }) => {
	const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');

	try {
		await sendNtfy(body);

		return {
			status: 'sent' as const,
			message: 'Message sent through ntfy.sh.'
		};
	} catch (error) {
		logNtfyFailure(error);

		return {
			status: 'error' as const,
			message: `Could not send through ntfy.sh. Email me directly at ${SITE.email}.`
		};
	}
});
