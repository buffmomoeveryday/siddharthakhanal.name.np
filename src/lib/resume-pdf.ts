import { jsPDF } from 'jspdf';
import { EXPERIENCE, PROJECTS, SITE, USING, type Experience } from './config';

export type ResumePdfInput = {
	name: string;
	location?: string | null;
	company?: string | null;
	githubUrl?: string;
	email?: string;
	website?: string;
	repos?: {
		name: string;
		description: string | null;
		html_url: string;
		language: string | null;
		stargazers_count: number;
	}[];
};

/** Harvard-style resume: Times, 0.75" margins, ruled section heads, letter page. */
export function downloadHarvardResume(input: ResumePdfInput) {
	const doc = new jsPDF({ unit: 'in', format: 'letter', compress: true });
	const pageW = doc.internal.pageSize.getWidth();
	const pageH = doc.internal.pageSize.getHeight();
	const margin = 0.75;
	const contentW = pageW - margin * 2;
	let y = margin;

	const black = '#000000';
	const ensureSpace = (needed: number) => {
		if (y + needed > pageH - margin) {
			doc.addPage();
			y = margin;
		}
	};

	const rule = () => {
		doc.setDrawColor(0);
		doc.setLineWidth(0.012);
		doc.line(margin, y, pageW - margin, y);
		y += 0.12;
	};

	const section = (title: string) => {
		ensureSpace(0.45);
		y += 0.08;
		doc.setFont('times', 'bold');
		doc.setFontSize(11);
		doc.setTextColor(black);
		doc.text(title.toUpperCase(), margin, y);
		y += 0.08;
		rule();
	};

	const wrap = (text: string, fontSize: number, style: 'normal' | 'bold' | 'italic' = 'normal') => {
		doc.setFont('times', style);
		doc.setFontSize(fontSize);
		return doc.splitTextToSize(text, contentW) as string[];
	};

	// —— Header (Harvard: centered name + contact) ——
	doc.setFont('times', 'bold');
	doc.setFontSize(22);
	doc.setTextColor(black);
	doc.text(input.name, pageW / 2, y, { align: 'center' });
	y += 0.28;

	const contactParts = [
		input.location?.trim(),
		input.email ?? SITE.email,
		input.website?.replace(/^https?:\/\//, '') ?? SITE.website.replace(/^https?:\/\//, ''),
		input.githubUrl?.replace(/^https?:\/\//, '')
	].filter(Boolean) as string[];

	doc.setFont('times', 'normal');
	doc.setFontSize(10);
	doc.text(contactParts.join('  ·  '), pageW / 2, y, { align: 'center' });
	y += 0.18;
	rule();

	// —— Experience ——
	if (EXPERIENCE.length) {
		section('Experience');
		for (const job of EXPERIENCE) {
			writeExperience(doc, job, margin, contentW, pageW, () => y, (v) => (y = v), ensureSpace, wrap);
		}
	}

	// —— Skills ——
	if (USING.length) {
		section('Technical Skills');
		const skills = USING.join(', ');
		const lines = wrap(skills, 10);
		ensureSpace(lines.length * 0.16 + 0.05);
		doc.setFont('times', 'normal');
		doc.setFontSize(10);
		doc.text(lines, margin, y);
		y += lines.length * 0.15 + 0.06;
	}

	// —— Projects ——
	const projects = (input.repos ?? []).slice(0, 6);
	if (projects.length) {
		section('Projects');
		for (const repo of projects) {
			const extra = PROJECTS[repo.name];
			const desc = extra?.description ?? repo.description ?? '';
			const tech = extra?.using?.length
				? extra.using.join(', ')
				: repo.language
					? repo.language
					: '';

			ensureSpace(0.55);
			doc.setFont('times', 'bold');
			doc.setFontSize(10.5);
			doc.text(repo.name, margin, y);

			doc.setFont('times', 'normal');
			doc.setFontSize(10);
			const right = repo.html_url.replace(/^https?:\/\//, '');
			doc.text(right, pageW - margin, y, { align: 'right' });
			y += 0.16;

			if (desc) {
				const lines = wrap(desc, 10);
				ensureSpace(lines.length * 0.15);
				doc.text(lines, margin, y);
				y += lines.length * 0.15;
			}
			if (tech) {
				const lines = wrap(`Technologies: ${tech}`, 9.5, 'italic');
				ensureSpace(lines.length * 0.14);
				doc.setFont('times', 'italic');
				doc.setFontSize(9.5);
				doc.text(lines, margin, y);
				y += lines.length * 0.14;
			}
			y += 0.1;
		}
	}

	const filename = `${input.name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`;
	doc.save(filename);
}

function writeExperience(
	doc: jsPDF,
	job: Experience,
	margin: number,
	_contentW: number,
	pageW: number,
	getY: () => number,
	setY: (y: number) => void,
	ensureSpace: (n: number) => void,
	wrap: (text: string, fontSize: number, style?: 'normal' | 'bold' | 'italic') => string[]
) {
	let y = getY();
	ensureSpace(0.7);

	doc.setFont('times', 'bold');
	doc.setFontSize(10.5);
	doc.text(job.company, margin, y);

	const dates = `${job.start} – ${job.end ?? 'Present'}`;
	doc.setFont('times', 'normal');
	doc.setFontSize(10);
	doc.text(dates, pageW - margin, y, { align: 'right' });
	y += 0.16;

	const roleLine = [job.role, job.location].filter(Boolean).join(', ');
	doc.setFont('times', 'italic');
	doc.setFontSize(10);
	doc.text(roleLine, margin, y);
	y += 0.16;

	const bullets = job.summary
		.split(/(?<=\.)\s+/)
		.map((s) => s.trim())
		.filter(Boolean);

	for (const bullet of bullets.length ? bullets : [job.summary]) {
		const lines = wrap(`• ${bullet}`, 10);
		ensureSpace(lines.length * 0.15);
		doc.setFont('times', 'normal');
		doc.setFontSize(10);
		doc.text(lines, margin, y);
		y += lines.length * 0.15;
	}

	if (job.using?.length) {
		const tech = wrap(`Technologies: ${job.using.join(', ')}`, 9.5, 'italic');
		ensureSpace(tech.length * 0.14);
		doc.setFont('times', 'italic');
		doc.setFontSize(9.5);
		doc.text(tech, margin, y);
		y += tech.length * 0.14;
	}

	y += 0.12;
	setY(y);
}
