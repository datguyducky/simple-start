// Probably is not the most optimal way to check if the browser is Chrome, but everything else is not working. So this is fine for now.
export const isChrome = (): boolean => {
	return typeof browser === 'undefined';
};
