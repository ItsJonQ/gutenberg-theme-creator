import React from "react";
import { FormControl, TextInput } from "./Controls";
import { View } from "@wp-g2/components";
import { SearchableItem } from "./Search";
import { useConfigProp } from "../store";

export const UnitControl = React.memo(() => {
	const prop = `settings.spacing.units`;
	const [value, update] = useConfigProp(prop);

	const transform = React.useCallback(value => {
		const parsedUnits = value
			.trim()
			.split(",")
			.map(v => `${v.trim()}`)
			.filter(Boolean);

		return parsedUnits;
	}, []);

	const onChange = React.useCallback(
		value => {
			update({ prop, value: transform(value) });
		},
		[prop, transform, update]
	);

	return (
		<SearchableItem prop="units">
			<FormControl
				label="Units"
				helpText="Filters unit values"
				templateColumns="1fr 1fr"
			>
				<View>
					<TextInput value={value} onChange={onChange} />
				</View>
			</FormControl>
		</SearchableItem>
	);
});
