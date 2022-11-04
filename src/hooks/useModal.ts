import { useState } from 'react';

type UseModal = {
	args?: Record<string, unknown>;
	isOpen: boolean;
	open: (args?: Record<string, unknown>) => void;
	close: (args?: Record<string, unknown>) => void;
};

export const useModal = (): UseModal => {
	const [isOpen, setIsOpen] = useState(false);
	const [modalArgs, setModalArgs] = useState<Record<string, unknown>>();

	const open = (args?: Record<string, unknown>) => {
		setModalArgs(args);
		setIsOpen(true);
	};

	const close = () => {
		setModalArgs({});
		setIsOpen(false);
	};

	return {
		args: modalArgs,
		isOpen,
		open,
		close,
	};
};
