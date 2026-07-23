const STORAGE_KEY = 'theme';

export type ThemePreference = 'system' | 'light' | 'dark';

function isBrowser() {
	return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getStoredPreference(): ThemePreference {
	if (!isBrowser()) return 'system';
	const value = localStorage.getItem(STORAGE_KEY);
	if (value === 'light' || value === 'dark' || value === 'system') return value;
	return 'system';
}

export function systemPrefersDark(): boolean {
	if (!isBrowser()) return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveDark(preference: ThemePreference): boolean {
	if (preference === 'dark') return true;
	if (preference === 'light') return false;
	return systemPrefersDark();
}

export function applyTheme(preference: ThemePreference) {
	if (!isBrowser()) return;
	const dark = resolveDark(preference);
	document.documentElement.classList.toggle('dark', dark);
	document.documentElement.dataset.theme = preference;
	document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

export function setPreference(preference: ThemePreference) {
	if (!isBrowser()) return;
	localStorage.setItem(STORAGE_KEY, preference);
	applyTheme(preference);
}

export function cyclePreference(current: ThemePreference): ThemePreference {
	const order: ThemePreference[] = ['system', 'light', 'dark'];
	const next = order[(order.indexOf(current) + 1) % order.length]!;
	setPreference(next);
	return next;
}

export function themeLabel(preference: ThemePreference): string {
	if (preference === 'system') return 'System';
	if (preference === 'light') return 'Light';
	return 'Dark';
}
