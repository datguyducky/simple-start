import { useContext, useLayoutEffect, useState } from 'react';

import { constants } from '../common/constants';

import { ExtensionViewContext } from '../context/extensionView';

export const useExtensionView = () => {
	const { currentView, setCurrentView } = useContext(ExtensionViewContext);
	const [viewLoading, setViewLoading] = useState<boolean>(true);

	useLayoutEffect(() => {
		const getStoredView = async () => {
			const savedView = await browser.storage.sync.get('currentViewId');
			if (savedView?.currentViewId) {
				setCurrentView(savedView.currentViewId);
				setViewLoading(false);
			}
		};

		getStoredView();
	}, []);

	const handleNextView = async () => {
		const currentViewIndex = constants.availableViews.findIndex(
			(view) => view.id === currentView,
		);

		// when switching from last view to another one - switch to the first view in an array
		if (currentViewIndex === constants.availableViews.length - 1) {
			setCurrentView(constants.availableViews[0].id);
			await browser.storage.sync.set({ currentViewId: constants.availableViews[0].id });
		}
		// next view in an array
		else {
			setCurrentView(constants.availableViews[currentViewIndex + 1].id);
			await browser.storage.sync.set({
				currentViewId: constants.availableViews[currentViewIndex + 1].id,
			});
		}
	};

	return {
		currentView,
		handleNextView,
		viewLoading,
	};
};
