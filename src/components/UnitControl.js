import React from "react";
import { FormControl, TextInput } from "./Controls";
import { View } from "@wp-g2/components";
import { useConfigProp, useSearchQueryProp } from "../store";

export const UnitControl = React.memo(() => {
	const [isVisible] = useSearchQueryProp("units");
	const prop = `global.settings.spacing.units`;
	const [value, update] = useConfigProp(prop);

	const onChange = React.useCallback(
		value => {
			const parsedUnits = value
				.trim()
				.split(",")
				.map(v => `${v.trim()}`);
			update({ prop, value: parsedUnits });
		},
		[prop, update]
	);

	if (!isVisible) return null;

	return (
		<FormControl
			label="Units"
			helpText="Filters unit values"
			templateColumns="1fr 1fr"
		>
			<View>
				<TextInput value={value} onChange={onChange} />
			</View>
		</FormControl>
	);
});
