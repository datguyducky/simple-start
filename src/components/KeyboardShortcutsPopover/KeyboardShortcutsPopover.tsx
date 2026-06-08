import { useHotkeys } from '@mantine/hooks';
import { useState } from 'react';
import { Button, Group, Kbd, Popover, Stack, Text, Title } from '@mantine/core';
import { IconPlus, IconQuestionMark } from '@tabler/icons-react';

import classes from '@/components/NewTabHeader/NewTabHeader.module.css';
import { ALL_SHORTCUTS, SHORTCUTS } from '@/common/constants.tsx';

export const KeyboardShortcutsPopover = () => {
	const [opened, setOpened] = useState(false);

	useHotkeys([
		[
			SHORTCUTS.displayShortcuts.keys,
			() => {
				setOpened((o) => !o);
			},
		],
	]);

	function renderKeys(keys: string) {
		return keys.split(' + ').map((key) => {
			const normalized = key.trim();

			if (normalized === 'mod') {
				const platform = navigator.platform || '';
				return /mac|iphone|ipad|ipod/i.test(platform) ? '⌘' : 'Ctrl';
			}

			return normalized;
		});
	}

	return (
		<Popover opened={opened} onChange={setOpened} width={320} position="bottom-end" withArrow>
			<Popover.Target>
				<Button
					variant="subtle"
					color="text"
					size="compact-md"
					leftSection={<IconQuestionMark size={18} />}
					className={classes.headerButton}
					onClick={() => {
						setOpened((o) => !o);
					}}
				>
					<Text inline size="sm" fw={600}>
						Help
					</Text>
				</Button>
			</Popover.Target>

			<Popover.Dropdown>
				<Stack gap="xs">
					<Title order={4}>Keyboard Shortcuts</Title>

					{ALL_SHORTCUTS.map((shortcut) => (
						<Group key={shortcut.label} justify="space-between">
							<Text size="sm">{shortcut.label}</Text>

							<Group gap={4}>
								{renderKeys(shortcut.keys).map((key, index, arr) => (
									<Group
										key={`${key}-${index.toString()}`}
										gap={4}
										align="center"
									>
										<Kbd>{key}</Kbd>

										{index < arr.length - 1 && (
											<IconPlus size={10} stroke={2} />
										)}
									</Group>
								))}
							</Group>
						</Group>
					))}
				</Stack>
			</Popover.Dropdown>
		</Popover>
	);
};
