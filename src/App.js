import React from 'react';
import { FiPlus, FiMinus } from '@wp-g2/icons';
import { get, set as resolve } from 'lodash';
import { faker } from '@wp-g2/protokit';
import {
	Badge,
	Button,
	Container,
	ControlLabel,
	FormGroup,
	Grid,
	Heading,
	HStack,
	ListGroup,
	Panel,
	PanelBody,
	PanelHeader,
	Spacer,
	Subheading,
	Surface,
	Switch,
	Text,
	TextInput,
	View,
	VStack,
} from '@wp-g2/components';
import { createStore } from '@wp-g2/substate';

const colorSchema = () => {
	return {
		slug: faker.lorem.word(),
		color: faker.internet.color(),
	};
};

const gradientSchema = () => {
	return {
		slug: faker.lorem.word(),
		gradient: '',
	};
};

const useConfig = createStore((set) => ({
	config: {
		global: {
			settings: {
				color: {
					custom: true,
					customGradient: true,
					link: false,
					palette: [],
					gradients: [],
				},
			},
		},
	},
	update: (key) => (next) => {
		set((prev) => {
			return { ...resolve(prev, `config.${key}`, next) };
		});
	},
}));

const useConfigProp = (prop) => {
	return useConfig((state) => {
		const { config, update } = state;
		return [get(config, prop), update(prop)];
	});
};

function App() {
	return (
		<Layout>
			<Spacer mb={8}>
				<Logo />
			</Spacer>
			<Panel visible>
				<PanelHeader>Color</PanelHeader>
				<PanelBody>
					<ListGroup>
						<SwitchControl
							label="Custom"
							helpText="Enable custom colors"
							prop="global.settings.color.custom"
						/>
						<SwitchControl
							label="Custom Gradient"
							helpText="Enable custom gradients"
							prop="global.settings.color.customGradient"
						/>
						<SwitchControl
							label="Link"
							helpText="Enables custom link color controls"
							prop="global.settings.color.link"
						/>
						<PaletteControl />
						<GradientControl />
					</ListGroup>
				</PanelBody>
			</Panel>
			<Panel visible>
				<PanelHeader>Color</PanelHeader>
			</Panel>
		</Layout>
	);
}

function Layout({ children }) {
	const { config } = useConfig();

	return (
		<Grid
			css={`
				position: fixed;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
			`}
			templateColumns="1fr 35%"
		>
			<Surface
				borderRight
				css={`
					padding: 40px;
				`}
			>
				<Container width={640}>{children}</Container>
			</Surface>
			<Surface>
				<pre>
					<code>{JSON.stringify(config, null, 2)}</code>
				</pre>
			</Surface>
		</Grid>
	);
}

function Logo() {
	return (
		<VStack>
			<HStack alignment="left">
				<Subheading>WordPress</Subheading>
				<Badge color="purple" isBold>
					Experimental
				</Badge>
			</HStack>
			<Heading>Theme.json Creator</Heading>
		</VStack>
	);
}

function FormControl({
	label,
	helpText,
	children,
	templateColumns = '1fr 35%',
}) {
	return (
		<FormGroup templateColumns={templateColumns}>
			<VStack spacing={0}>
				<ControlLabel>{label}</ControlLabel>
				{helpText && (
					<Text size="12" variant="muted" css="opacity: 0.4;">
						{helpText}
					</Text>
				)}
			</VStack>
			{children}
		</FormGroup>
	);
}

function SwitchControl({ label, helpText, prop }) {
	const [checked, onChange] = useConfigProp(prop);

	return (
		<FormControl label={label} helpText={helpText}>
			<Switch checked={checked} onChange={onChange} />
		</FormControl>
	);
}

function PaletteColor({ index = 0, onRemove }) {
	const [palette, update] = useConfigProp(
		`global.settings.color.palette[${index}]`
	);

	return (
		<VStack css="padding-left: 60px;">
			<Grid templateColumns="0.75fr 1fr auto">
				<HStack alignment="left">
					<ControlLabel>Slug</ControlLabel>
					<TextInput
						placeholder="strong-magenta"
						onChange={(next) => {
							update({
								slug: next,
								color: palette.color,
							});
						}}
						value={palette.slug}
					/>
				</HStack>
				<HStack alignment="left">
					<ControlLabel>Color</ControlLabel>
					<input
						type="color"
						onChange={(event) =>
							update({
								slug: palette.slug,
								color: event.target.value,
							})
						}
						value={palette.color}
					/>
				</HStack>
				<View>
					<Button
						icon={<FiMinus />}
						isSubtle
						isControl
						size="small"
						onClick={onRemove}
					/>
				</View>
			</Grid>
		</VStack>
	);
}

function PaletteControl() {
	const store = useConfig;
	const [palette] = useConfigProp(`global.settings.color.palette`);

	const addColor = () => {
		store.setState((prev) => {
			const prevData = get(prev, 'config.global.settings.color.palette');
			const next = resolve(prev, 'config.global.settings.color.palette', [
				...prevData,
				colorSchema(),
			]);

			return { ...next };
		});
	};

	const removeColor = (index) => {
		store.setState((prev) => {
			const prevData = get(prev, 'config.global.settings.color.palette');
			const next = resolve(
				prev,
				'config.global.settings.color.palette',
				prevData.filter((item, i) => i !== index)
			);

			return { ...next };
		});
	};

	return (
		<View>
			<ListGroup>
				<FormControl
					label="Palette"
					helpText="Enables color presets"
					templateColumns="1fr auto"
				>
					<View>
						<Button
							icon={<FiPlus />}
							isControl
							size="small"
							onClick={addColor}
						/>
					</View>
				</FormControl>
				{palette.map((entry, index) => (
					<PaletteColor
						key={index}
						index={index}
						onRemove={() => removeColor(index)}
					/>
				))}
			</ListGroup>
		</View>
	);
}

function GradientColor({ index = 0, onRemove }) {
	const [gradients, update] = useConfigProp(
		`global.settings.color.gradients[${index}]`
	);

	return (
		<VStack css="padding-left: 60px;">
			<Grid templateColumns="0.75fr 1fr auto">
				<HStack alignment="left">
					<ControlLabel>Slug</ControlLabel>
					<TextInput
						placeholder="strong-magenta"
						onChange={(next) => {
							update({
								slug: next,
								gradient: gradients.gradient,
							});
						}}
						value={gradients.slug}
					/>
				</HStack>
				<HStack alignment="left">
					<ControlLabel>Gradient</ControlLabel>
					<TextInput
						onChange={(next) => {
							update({
								slug: gradients.slug,
								gradient: next,
							});
						}}
						value={gradients.gradient}
					/>
				</HStack>
				<View>
					<Button
						icon={<FiMinus />}
						isSubtle
						isControl
						size="small"
						onClick={onRemove}
					/>
				</View>
			</Grid>
		</VStack>
	);
}

function GradientControl() {
	const store = useConfig;
	const [gradients] = useConfigProp(`global.settings.color.gradients`);

	const addGradient = () => {
		store.setState((prev) => {
			const prevData = get(
				prev,
				'config.global.settings.color.gradients'
			);
			const next = resolve(
				prev,
				'config.global.settings.color.gradients',
				[...prevData, gradientSchema()]
			);

			return { ...next };
		});
	};

	const removeGradient = (index) => {
		store.setState((prev) => {
			const prevData = get(
				prev,
				'config.global.settings.color.gradients'
			);
			const next = resolve(
				prev,
				'config.global.settings.color.gradients',
				prevData.filter((item, i) => i !== index)
			);

			return { ...next };
		});
	};

	return (
		<View>
			<ListGroup>
				<FormControl
					label="Gradients"
					helpText="Enables gradient presets"
					templateColumns="1fr auto"
				>
					<View>
						<Button
							icon={<FiPlus />}
							isControl
							size="small"
							onClick={addGradient}
						/>
					</View>
				</FormControl>
				{gradients.map((entry, index) => (
					<GradientColor
						key={index}
						index={index}
						onRemove={() => removeGradient(index)}
					/>
				))}
			</ListGroup>
		</View>
	);
}

export default App;
