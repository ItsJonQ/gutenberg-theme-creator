import React from "react";
import { FiPlus, FiMinus } from "@wp-g2/icons";
import { faker } from "@wp-g2/protokit";
import { FormControl, TextInput } from "./Controls";
import { ui } from "@wp-g2/styles";
import {
	Button,
	Grid,
	ListGroup,
	View,
	VStack,
	FormGroup
} from "@wp-g2/components";
import { SearchableItem } from "./Search";
import {
	useGradients,
	useConfigProp,
	useAddToList,
	useRemoveFromList
} from "../store";

const gradientSchema = () => {
	const color1 = faker.commerce.color();
	const color2 = faker.commerce.color();

	return {
		slug: `${color1}-${color2}`,
		gradient: `linear-gradient(${ui.color(color1).toHexString()} 0%, ${ui
			.color(color2)
			.toHexString()} 100%)`
	};
};

const GradientColor = React.memo(({ index = 0 }) => {
	const prop = `global.settings.color.gradients[${index}]`;
	const [gradients, update] = useConfigProp(prop);

	const onRemove = useRemoveFromList({
		prop: "config.global.settings.color.gradients",
		index
	});

	const updateSlug = React.useCallback(
		next => {
			update({
				prop,
				value: {
					slug: next,
					gradient: gradients.gradient
				}
			});
		},
		[gradients.gradient, prop, update]
	);

	const updateValue = React.useCallback(
		next => {
			update({
				prop,
				value: {
					slug: gradients.slug,
					gradient: next
				}
			});
		},
		[gradients.slug, prop, update]
	);

	const RemoveIcon = React.useMemo(() => <FiMinus />, []);

	return (
		<VStack>
			<Grid templateColumns="1fr auto">
				<VStack>
					<FormGroup
						label="Slug"
						alignLabel="right"
						templateColumns="120px 1fr"
						gap={5}
					>
						<TextInput
							placeholder="strong-magenta"
							onChange={updateSlug}
							value={gradients.slug}
						/>
					</FormGroup>
					<FormGroup
						label="Gradient"
						alignLabel="right"
						templateColumns="120px 1fr"
						gap={5}
					>
						<TextInput
							onChange={updateValue}
							value={gradients.gradient}
							multiline
							minRows={2}
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

const GradientList = React.memo(() => {
	const [gradients] = useGradients();

	return (
		<ListGroup
			separator
			css={`
				padding-left: 60px;
			`}
		>
			{gradients.map((entry, index) => (
				<GradientColor key={index} index={index} />
			))}
		</ListGroup>
	);
});

const GradientHeader = React.memo(() => {
	const addGradient = useAddToList({
		prop: "config.global.settings.color.gradients",
		createData: gradientSchema
	});

	return (
		<FormControl
			label="Gradients"
			helpText="Add custom gradient presets"
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
	);
});

export const GradientControl = React.memo(() => {
	return (
		<SearchableItem prop="gradient">
			<ListGroup>
				<GradientHeader />
				<GradientList />
			</ListGroup>
		</SearchableItem>
	);
});
