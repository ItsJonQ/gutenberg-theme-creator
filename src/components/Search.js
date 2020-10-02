import React from "react";
import { SearchInput, View } from "@wp-g2/components";
import { useSearchQuery, useSearchQueryProp } from "../store";

export const ConfigSearch = React.memo(() => {
	const { searchQuery, setSearchQuery } = useSearchQuery();

	return <SearchInput value={searchQuery} onChange={setSearchQuery} />;
});

export const SearchableItem = React.memo(({ prop, children }) => {
	const [isVisible] = useSearchQueryProp(prop);
	if (!isVisible) return null;

	return (
		<View
			css={`
				display: ${isVisible ? "block" : "hidden"};
			`}
		>
			{children}
		</View>
	);
});
