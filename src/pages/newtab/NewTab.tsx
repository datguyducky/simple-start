import { Button, Grid, Group, Text, Title } from '@mantine/core';
import { CogIcon, PlusIcon } from '@heroicons/react/outline';

import { NewTabLayout } from './NewTab.styles';

export const NewTab = () => {
	return (
		<NewTabLayout>
			<Grid columns={3} style={{ marginBottom: 32 }}>
				<Grid.Col span={1}>
					<Title>Simple Start</Title>
				</Grid.Col>

				<Grid.Col span={1} offset={1}>
					<Group position="right" spacing="xs">
						<Button
							variant="subtle"
							leftIcon={<PlusIcon style={{ width: 14, height: 14 }} />}
							compact
							color="dark"
						>
							Add
						</Button>

						<Button
							variant="subtle"
							leftIcon={<CogIcon style={{ width: 14, height: 14 }} />}
							compact
							color="dark"
						>
							Settings
						</Button>
					</Group>
				</Grid.Col>
			</Grid>

			<div>
				<Text color="dimmed">
					Click "add" button to add your first bookmark to this view.
				</Text>
			</div>
		</NewTabLayout>
	);
};
