import React from "react";
import { FiPlus, FiMinus } from "@wp-g2/icons";
import { faker } from "@wp-g2/protokit";
import { ui } from "@wp-g2/styles";
import { FormControl, TextInput } from "./Controls";
import {
	Button,
	Grid,
	FormGroup,
	ListGroup,
	View,
	VStack
} from "@wp-g2/components";
import { SearchableItem } from "./Search";
import {
	useConfigProp,
	useAddToList,
	usePalette,
	useRemoveFromList
} from "../store";

const colorSchema = () => {
	const color = faker.commerce.color();
	return {
		slug: color,
		color: ui.color(color).toHexString()
	};
};

const PaletteColor = React.memo(({ index = 0 }) => {
	const prop = `settings.defaults.color.palette[${index}]`;
	const [palette, update] = useConfigProp(prop);

	const onRemove = useRemoveFromList({
		prop: "config.settings.defaults.color.palette",
		index
	});

	const updateSlug = React.useCallback(
		next => {
			update({
				prop,
				value: {
					slug: next,
					color: palette.color
				}
			});
		},
		[palette.color, prop, update]
	);

	const updateValue = React.useCallback(
		next => {
			update({
				prop,
				value: {
					slug: palette.slug,
					color: next
				}
			});
		},
		[palette.slug, prop, update]
	);

	const RemoveIcon = React.useMemo(() => <FiMinus />, []);

	return (
		<VStack>
			<Grid templateColumns="1fr auto">
				<VStack>
					<FormGroup
						alignment="left"
						templateColumns="120px 1fr"
						label="Slug"
						alignLabel="right"
						gap={5}
					>
						<TextInput
							placeholder="strong-magenta"
							onChange={updateSlug}
							value={palette.slug}
						/>
					</FormGroup>
					<FormGroup
						alignment="left"
						templateColumns="120px 1fr"
						label="Color"
						alignLabel="right"
						gap={5}
					>
						<TextInput
							type="color"
							onChange={updateValue}
							value={palette.color}
						/>
					</FormGroup>
				</VStack>
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

const PaletteList = React.memo(() => {
	const [palette] = usePalette();

	return (
		<ListGroup
			separator
			css={`
				padding-left: 60px;
			`}
		>
			{palette.map((entry, index) => (
				<PaletteColor key={index} index={index} />
			))}
		</ListGroup>
	);
});

const PaletteHeader = React.memo(() => {
	const addColor = useAddToList({
		prop: "config.settings.defaults.color.palette",
		createData: colorSchema
	});

	return (
		<FormControl
			label="Palette"
			helpText="Add custom color presets"
			templateColumns="1fr auto"
		>
			<View>
				<Button icon={<FiPlus />} isControl size="small" onClick={addColor} />
			</View>
		</FormControl>
	);
});

export const PaletteControl = React.memo(() => {
	return (
		<SearchableItem prop="palette">
			<ListGroup>
				<PaletteHeader />
				<PaletteList />
			</ListGroup>
		</SearchableItem>
	);
});
