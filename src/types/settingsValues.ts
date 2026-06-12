export interface AllExtensionSettings extends CapsuleSettings, ListSettings, GeneralSettings {
	currentView: number;
	defaultCategory?: string | null;
}

export interface GeneralSettings {
	oneView: boolean;
	oneViewHeadingGap: number;
	oneViewCategoriesGap: number;
}

export interface CapsuleSettings {
	capsuleSpacing: number;
	capsuleSize: number;
	capsuleIconSize: number;
	capsuleLabelSize: number;
	capsuleLabelItalic: boolean;
	capsuleLabelBold: boolean;
	capsuleLabelColor: string | null;
	capsuleHiddenName: boolean;
	capsuleIsHeart?: boolean;
}

export interface ListSettings {
	listHiddenName: boolean;
	listHiddenUrl: boolean;
	listNameItalic: boolean;
	listNameBold: boolean;
	listUrlItalic: boolean;
	listUrlBold: boolean;
	listUrlColor: string | null;
	listNameColor: string | null;
	listVerticalPadding: number;
	listHorizontalPadding: number;
	listSpacing: number;
	listIconSize: number;
	listNameSize: number;
	listUrlSize: number;
	listUseStrippedRows: boolean;
}
