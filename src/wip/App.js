import React from "react";
import {
	Grid,
	Container,
	ControlLabel,
	FormGroup,
	ListGroup,
	ListGroupHeader,
	Switch,
	Text,
	VStack,
	View
} from "@wp-g2/components";
import { useConfig, useConfigProp, useConfigJson, useStore } from "./store";

const FormControl = React.memo(
	({ children, label, helpText, templateColumns = "1fr 35%" }) => {
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
);

const BooleanControl = React.memo(({ prop, templateColumns = "1fr 35%" }) => {
	const [config, setConfig] = useConfigProp(prop);
	const { label, description, value } = config;

	return (
		<FormControl
			helpText={description}
			label={label}
			templateColumns={templateColumns}
		>
			<Switch checked={!!value} onChange={setConfig} />
		</FormControl>
	);
});

const ConfigControl = React.memo(({ type, prop }) => {
	switch (type) {
		case "boolean":
			return <BooleanControl prop={prop} />;
		default:
			return null;
	}
});

const Preview = React.memo(() => {
	const store = useStore();

	return (
		<pre>
			<code>{JSON.stringify(store.config, null, 2)}</code>
		</pre>
	);
});

const Section = React.memo(({ label, settings, prop }) => {
	return (
		<ListGroup>
			<ListGroupHeader>{label}</ListGroupHeader>
			{settings.map((setting, index) => {
				return (
					<ConfigControl
						type={setting.type}
						prop={`${prop}.settings[${index}]`}
						key={setting.key}
					/>
				);
			})}
		</ListGroup>
	);
});

const Settings = React.memo(() => {
	const config = useConfig();
	const settings = config.global.settings;

	return (
		<VStack spacing={10}>
			{settings.map((setting, index) => {
				return (
					<Section
						key={index}
						{...setting}
						prop={`global.settings[${index}]`}
					/>
				);
			})}
		</VStack>
	);
});

function App() {
	return (
		<Grid
			css={`
				padding: 20vh;
			`}
		>
			<Container width={400}>
				<Settings />
			</Container>
			<Container width={400}>
				<Preview />
			</Container>
		</Grid>
	);
}

export default App;
