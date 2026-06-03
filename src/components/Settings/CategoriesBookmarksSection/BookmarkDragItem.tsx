import { Draggable } from '@hello-pangea/dnd';

import { BookmarkRow } from '@/components/Settings/BookmarkRow';

type BookmarkDragItemProps = {
	title: string;
	id: string;
	bookmarkIndex: number;
	onEditAction: () => void;
	onRemoveAction: () => void;
};

export const BookmarkDragItem = ({
	title,
	id,
	bookmarkIndex,
	onEditAction,
	onRemoveAction,
}: BookmarkDragItemProps) => {
	return (
		<Draggable index={bookmarkIndex} draggableId={id}>
			{(bookmarkProvided, snapshot) => (
				<div
					{...bookmarkProvided.draggableProps}
					{...bookmarkProvided.dragHandleProps}
					ref={bookmarkProvided.innerRef}
				>
					<BookmarkRow
						name={title}
						onEditAction={onEditAction}
						onRemoveAction={onRemoveAction}
						isBeingMoved={snapshot.isDragging}
					/>
				</div>
			)}
		</Draggable>
	);
};
