export const isChrome = (): boolean => {
	return import.meta.env.BROWSER === 'chrome';
};
