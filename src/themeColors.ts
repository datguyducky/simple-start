/**
 * theme colors used across the whole extension:
 * - "background":
 * 		[0] - main background color
 * 		[1] - color for bookmarks cards (list and capsules), also used for accordion (opened title, closed)
 * 		[2] - hover, select and borders
 * 		[3] - another borders (mostly accordion) and also hover on ActionIcons
 * 		[4] - inputs border color
 * 		[5] - "nothing found" for the Select and input placeholders
 * 		[6] - "dimmed" text color, and Select chevron color
 * 		[7] - color for up and down icon on the Select component
 * 		[8] - looks like is not used for now
 * 		[9] - looks like is not used for now
 *
 * 	- "primary" - 10 shades of a color, used for buttons, checkboxes, highlights etc,
 * 	basically as name suggests a primary color of the extension.
 * 	NOT used for pre-defined "light" and "dark" themes (there we use Mantine's built-in blue color)
 *
 * - "text" - main text color
 */

export const themeColors = {
	light: {
		colors: {
			background: [
				'#ffffff', // [0]
				'#f3f3f3', // [1]
				'#e9ecef', // [2]
				'#dee2e6', // [3]
				'#ced4da', // [4]
				'#adb5bd', // [5]
				'#868e96', // [6]
				'#495057', // [7]
				'pink', // [8]
				'pink', // [9]
			],

			text: '#101113',
		},
	},
	dark: {
		colors: {
			background: [
				'#181818', // [0]
				'#2f2f2f', // [1]
				'#464646', // [2]
				'#5d5d5d', // [3]
				'#747474', // [4]
				'#8c8c8c', // [5]
				'#a3a3a3', // [6]
				'#bababa', // [7]
				'#d1d1d1', // [8]
				'#e8e8e8', // [9]
			],

			text: '#ffffff',
		},
	},
};
