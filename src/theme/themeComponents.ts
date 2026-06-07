import {
	Accordion,
	ActionIcon,
	Checkbox,
	ColorInput,
	Input,
	InputWrapper,
	Menu,
	Modal,
	NumberInput,
	Overlay,
	Select,
} from '@mantine/core';

import classes from './theme.module.css';

export const componentsOverrides = {
	Select: Select.extend({
		classNames: {
			option: classes.selectOption,
			dropdown: classes.selectDropdown,
			empty: classes.selectEmpty,
			section: classes.selectSection,
		},
		defaultProps: {
			withCheckIcon: false,
		},
	}),
	Modal: Modal.extend({
		classNames: {
			close: classes.modalClose,
			content: classes.modalContent,
			header: classes.modalHeader,
			title: classes.modalTitle,
		},
	}),
	Input: Input.extend({
		classNames: {
			input: classes.input,
			section: classes.inputSection,
		},
	}),
	NumberInput: NumberInput.extend({
		classNames: {
			control: classes.numberInputControl,
		},
	}),
	InputWrapper: InputWrapper.extend({
		styles: {
			label: {
				color: 'var(--mantine-color-text)',
			},
		},
	}),
	Checkbox: Checkbox.extend({
		classNames: {
			input: classes.checkboxInput,
			label: classes.checkboxLabel,
		},
	}),
	Menu: Menu.extend({
		styles: {
			itemLabel: {
				color: 'var(--mantine-color-text)',
			},
			item: {
				color: 'var(--mantine-color-text)',
			},
		},
	}),
	Accordion: Accordion.extend({
		classNames: {
			root: classes.accordionRoot,
			chevron: classes.accordionChevron,
			control: classes.accordionControl,
			item: classes.accordionItem,
			panel: classes.accordionPanel,
			label: classes.accordionLabel,
		},
	}),
	ActionIcon: ActionIcon.extend({
		classNames: {
			root: classes.actionIconRoot,
		},
	}),
	Overlay: Overlay.extend({
		defaultProps: {
			opacity: 0.6,
		},
	}),
	ColorInput: ColorInput.extend({
		classNames: {
			dropdown: classes.colorInputDropdown,
		},
	}),
};
