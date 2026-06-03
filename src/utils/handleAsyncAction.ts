import { showNotification } from '@mantine/notifications';

type HandleAsyncActionOptions = {
	errorTitle: string;
	errorMessage?: string;
	shouldLogError?: boolean;
};

export const handleAsyncAction = (
	action: () => Promise<void>,
	{
		errorTitle,
		errorMessage = 'Sorry, but something went wrong. Please try again.',
		shouldLogError = true,
	}: HandleAsyncActionOptions,
) => {
	void action().catch((error: unknown) => {
		if (shouldLogError) {
			console.error(errorTitle, error);
		}

		showNotification({
			color: 'red',
			title: errorTitle,
			message: errorMessage,
			autoClose: 5000,
		});
	});
};
