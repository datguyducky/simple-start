const HTTP_PROTOCOL_REGEX = /^https?:\/\//i;
const ANY_SCHEME_REGEX = /^[a-z][a-z\d+\-.]*:/i;

export const normalizeBookmarkUrl = (bookmarkUrl: string): string => {
	const trimmedBookmarkUrl = bookmarkUrl.trim();

	if (trimmedBookmarkUrl === '' || HTTP_PROTOCOL_REGEX.test(trimmedBookmarkUrl)) {
		return trimmedBookmarkUrl;
	}

	return `https://${trimmedBookmarkUrl}`;
};

export const isSupportedBookmarkUrl = (bookmarkUrl: string): boolean => {
	const trimmedBookmarkUrl = bookmarkUrl.trim();

	if (trimmedBookmarkUrl === '') {
		return false;
	}

	if (
		ANY_SCHEME_REGEX.test(trimmedBookmarkUrl) &&
		!HTTP_PROTOCOL_REGEX.test(trimmedBookmarkUrl)
	) {
		return false;
	}

	const normalizedBookmarkUrl = normalizeBookmarkUrl(trimmedBookmarkUrl);

	try {
		const parsedUrl = new URL(normalizedBookmarkUrl);
		return (
			(parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
			parsedUrl.hostname.length > 0
		);
	} catch {
		return false;
	}
};
