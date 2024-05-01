export type ColorsArray = [
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
];

export interface CustomThemeColors {
	background: ColorsArray;
	'custom-primary': ColorsArray;
	text: string;
}

export interface CustomThemeFormColors extends CustomThemeColors {
	'background-local': ColorsArray;
}

export interface CustomTheme {
	name: string;
	colors: CustomThemeColors;
}
