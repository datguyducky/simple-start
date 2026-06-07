import type { MantineColorsTuple } from '@mantine/core';

export interface CustomTheme {
	name: string;
	colors: {
		background: MantineColorsTuple;
		'custom-primary': MantineColorsTuple;
	};
	other: {
		text: string;
	};
}

export type CustomThemeColors = CustomTheme['colors'];

export type CustomThemeSaveValues = CustomThemeColors & {
	text: string;
};

export type CustomThemesByName = Record<string, CustomTheme>;
