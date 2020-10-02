import React from "react";
import { FiPlus, FiMinus } from "@wp-g2/icons";
import { faker } from "@wp-g2/protokit";
import { get, set as resolve } from "lodash";
import { FormControl, TextInput } from "./Controls";
import {
	Button,
	ControlLabel,
	Grid,
	HStack,
	ListGroup,
	View,
	VStack
} from "@wp-g2/components";
import {
	useFontSizes,
	useConfig,
	useConfigProp,
	useSearchQueryProp
} from "../store";

const fontSizeSchema = () => {
	const data = faker.random.arrayElement([
		{
			slug: "x-small",
			size: 10
		},
		{
			slug: "small",
			size: 14
		},
		{
			slug: "medium",
			size: 16
		},
		{
			slug: "large",
			size: 20
		},
		{
			slug: "x-large",
			size: 32
		}
	]);

	return data;
};

const FontSizeItem = React.memo(({ index = 0 }) => {
	const store = useConfig;
	const prop = `global.settings.typography.fontSizes[${index}]`;
	const [fontSize, update] = useConfigProp(prop);

	const onRemove = React.useCallback(() => {
		store.setState(prev => {
			const prevData = get(prev, "config.global.settings.typography.fontSizes");
			const next = resolve(
				prev,
				"config.global.settings.typography.fontSizes",
				prevData.filter((item, i) => i !== index)
			);

			return { ...next };
		});
	}, [store, index]);

	const updateSlug = React.useCallback(
		next => {
			update({
				prop,
				value: {
					slug: next,
					size: fontSize.size
				}
			});
		},
		[fontSize.size, prop, update]
	);

	const updateValue = React.useCallback(
		next => {
			update({
				prop,
				value: {
					slug: fontSize.slug,
					size: Number(next)
				}
			});
		},
		[fontSize.slug, prop, update]
	);

	const RemoveIcon = React.useMemo(() => <FiMinus />, []);

	return (
		<VStack>
			<Grid templateColumns="0.75fr 1fr auto">
				<HStack alignment="left">
					<ControlLabel>Slug</ControlLabel>
					<TextInput
						placeholder="strong-magenta"
						onChange={updateSlug}
						value={fontSize.slug}
					/>
				</HStack>
				<HStack alignment="left">
					<ControlLabel>Size</ControlLabel>
					<TextInput
						onChange={updateValue}
						value={fontSize.size}
						validate={/^[0-9]*$/gi}
					/>
				</HStack>
				<View>
					<Button
						icon={RemoveIcon}
						isSubtle
						isControl
						size="small"
						onClick={onRemove}
					/>
				</View>
			</Grid>
		</VStack>
	);
});

const FontSizeList = React.memo(() => {
	const [fontSizes] = useFontSizes();

	return (
		<ListGroup
			separator
			css={`
				padding-left: 60px;
			`}
		>
			{fontSizes.map((entry, index) => (
				<FontSizeItem key={index} index={index} />
			))}
		</ListGroup>
	);
});

export const FontSizeControl = React.memo(() => {
	const [isVisible] = useSearchQueryProp("fontsize");
	const store = useConfig;

	const addFontSize = React.useCallback(() => {
		store.setState(prev => {
			const prevData = get(prev, "config.global.settings.typography.fontSizes");
			const next = resolve(
				prev,
				"config.global.settings.typography.fontSizes",
				[...prevData, fontSizeSchema()]
			);

			return { ...next, hasChange: true };
		});
	}, [store]);

	if (!isVisible) return null;

	return (
		<View>
			<ListGroup>
				<FormControl
					label="Font Sizes"
					helpText="Add custom font sizes"
					templateColumns="1fr auto"
				>
					<View>
						<Button
							icon={<FiPlus />}
							isControl
							size="small"
							onClick={addFontSize}
						/>
					</View>
				</FormControl>
				<FontSizeList />
			</ListGroup>
		</View>
	);
});
