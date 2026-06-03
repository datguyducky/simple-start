import { type Browser } from 'wxt/browser';

export type BookmarkTreeNode = Browser.bookmarks.BookmarkTreeNode;

export type ExtensionCategoryTreeNode = Omit<BookmarkTreeNode, 'children'> & {
	bookmarks: BookmarkTreeNode[];
};

export type BookmarkMoveInfo = {
	parentId: string;
	index: number;
	oldParentId: string;
	oldIndex: number;
};

export type BookmarkRemoveInfo = {
	parentId: string;
	index: number;
	node: BookmarkTreeNode;
};

export type BookmarkChangeInfo = {
	title: string;
	url?: string | undefined;
};
