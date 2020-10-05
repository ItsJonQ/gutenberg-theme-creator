import React from "react";
import { FiPlus, FiMinus } from "@wp-g2/icons";
import {
	Button,
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
import { TextInput } from "../components/Controls";
import {
	useConfig,
	useCategories,
	useConfigJson,
	useConfigProp,
	useConfigPropArray,
	useStore
} from "./store";
import _ from "lodash";

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

const TextControl = React.memo(
	({ prop, transform = v => v, templateColumns = "1fr 1fr" }) => {
		const [config, setConfig] = useConfigProp(prop);
		const { label, description, value } = config;

		const onChange = React.useCallback(
			value => {
				setConfig(transform(value));
			},
			[setConfig, transform]
		);

		return (
			<FormControl
				helpText={description}
				label={label}
				templateColumns={templateColumns}
			>
				<View>
					<TextInput value={value} onChange={onChange} />
				</View>
			</FormControl>
		);
	}
);

const TextArrayControl = React.memo(props => {
	const transform = React.useCallback(value => {
		const parsedUnits = value
			.trim()
			.split(",")
			.map(v => `${v.trim()}`)
			.filter(Boolean);

		return parsedUnits;
	}, []);

	return <TextControl transform={transform} {...props} />;
});

const ArrayItemControl = React.memo(props => {
	const { valueOf, index, onChange, onRemove } = props;

	const RemoveIcon = React.useMemo(() => <FiMinus />, []);

	return (
		<>
			<VStack>
				{valueOf.map(entry => {
					const value = props[entry.key];
					const type = entry.type;

					return (
						<FormGroup
							label={entry.label}
							key={entry.key}
							alignment="left"
							templateColumns="120px 1fr"
							alignLabel="right"
							gap={5}
						>
							<TextInput
								type={type}
								value={value}
								onChange={next => {
									onChange({ index, value: { [entry.key]: next } });
								}}
							/>
						</FormGroup>
					);
				})}
			</VStack>
			<View>
				<Button
					icon={RemoveIcon}
					isSubtle
					isControl
					size="small"
					onClick={() => onRemove({ index })}
				/>
			</View>
		</>
	);
});

const ArrayControl = React.memo(({ prop }) => {
	const [config, setConfig, addItem, removeItem] = useConfigPropArray(prop);
	const { label, description, value, valueOf } = config;

	const handleOnChange = React.useCallback(
		({ index, value: next }) => {
			setConfig({ value: next, index });
		},
		[setConfig]
	);

	const handleOnRemove = React.useCallback(
		({ index }) => {
			removeItem({ index });
		},
		[removeItem]
	);

	return (
		<FormControl
			label={config.label}
			helpText={config.description}
			templateColumns="1fr auto"
		>
			<View>
				<Button icon={<FiPlus />} isControl size="small" onClick={addItem} />
			</View>
			{value.map((entry, index) => (
				<ArrayItemControl
					valueOf={valueOf}
					key={index}
					prop={prop}
					index={index}
					onChange={handleOnChange}
					onRemove={handleOnRemove}
					{...entry}
				/>
			))}
		</FormControl>
	);
});

const ControlComponents = {
	textArray: TextArrayControl,
	text: TextControl,
	boolean: BooleanControl,
	array: ArrayControl
};

const ConfigControl = React.memo(({ controlType, type, prop }) => {
	const Component = ControlComponents[controlType || type];
	if (!Component) {
		return null;
	}

	return <Component prop={prop} />;
});

const Preview = React.memo(() => {
	const config = useConfigJson();

	return (
		<pre>
			<code>{JSON.stringify(config, null, 2)}</code>
		</pre>
	);
});

const Section = React.memo(({ prop, type }) => {
	return <ConfigControl type={type} prop={prop} />;
});

const Settings = React.memo(() => {
	const config = useConfig();
	const categories = useCategories();

	const sections = categories.map(section => {
		return {
			...section,
			entries: config.filter(entry => entry.category === section.key)
		};
	});

	return (
		<VStack spacing={10}>
			{sections.map(section => {
				return (
					<ListGroup key={section.key}>
						<ListGroupHeader>{section.label}</ListGroupHeader>
						{section.entries.map((setting, index) => {
							return <Section {...setting} prop={setting.key} />;
						})}
					</ListGroup>
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
