import React from "react";
import { get, set as resolve } from "lodash";
import queryString from "query-string";

import { createStore, shallowCompare } from "@wp-g2/substate";

/**
 * Source:
 * https://github.com/WordPress/gutenberg/blob/d4d083083306de27675eee3eed24c8cfd9bd80d5/docs/designers-developers/developers/themes/theme-json.md#settings
 */
const __initialState__ = {
	settings: {
		defaults: {
			color: {
				custom: true /* false to opt-out, as in add_theme_support('disable-custom-colors') */,
				customGradient: true /* false to opt-out, as in add_theme_support('disable-custom-gradients') */,
				gradients: [] /* gradient presets, as in add_theme_support('editor-gradient-presets',) */,
				link: false /* true to opt-in, as in add_theme_support('experimental-link-color') */,
				palette: [] /* color presets, as in add_theme_support('editor-color-palette',) */
			},
			spacing: {
				customPadding: false /* true to opt-in, as in add_theme_support('experimental-custom-spacing') */,
				units: [
					"px",
					"em",
					"rem",
					"vh",
					"vw"
				] /* filter values, as in add_theme_support('custom-units',) */
			},
			typography: {
				customFontSize: true /* false to opt-out, as in add_theme_support( 'disable-custom-font-sizes' ) */,
				customLineHeight: false /* true to opt-in, as in add_theme_support( 'custom-line-height' ) */,
				dropCap: true /* false to opt-out */,
				fontSizes: [] /* font size presets, as in add_theme_support('editor-font-sizes',) */
			}
		}
	}
};

const initialState = JSON.parse(JSON.stringify(__initialState__));

export const useSearchQuery = createStore(set => ({
	searchQuery: "",
	setSearchQuery: next => set({ searchQuery: next })
}));

export const useConfig = createStore(set => ({
	config: initialState,
	searchQuery: "",
	hasChange: false,
	setState: next => set(prev => ({ ...prev, ...next })),
	update: key => next => {
		set(prev => {
			return { ...resolve(prev, `config.${key}`, next), hasChange: true };
		});
	},
	updateProp: ({ prop: key, value: next }) => {
		set(prev => {
			return { ...resolve(prev, `config.${key}`, next), hasChange: true };
		});
	},
	reset: () => {
		set(prev => {
			return {
				...resolve(
					prev,
					"config",
					JSON.parse(JSON.stringify(__initialState__))
				),
				hasChange: false
			};
		});
	}
}));

export const useUrlSync = () => {
	const store = useConfig;

	React.useEffect(() => {
		const { config } = queryString.parse(window.location.search);

		if (config) {
			let encoded = decodeURIComponent(config);
			try {
				encoded = JSON.parse(atob(encoded));
				store.setState(prev => ({ ...prev, config: encoded, hasChange: true }));
			} catch (err) {
				console.log("Could not load config");
			}
		}

		const unsubSync = store.subscribe(state => {
			if (!state.hasChange) {
				window.history.pushState(null, null, `?config`);
			} else {
				const nextConfig = encodeURIComponent(
					btoa(JSON.stringify(state.config))
				);
				window.history.pushState(null, null, `?config=${nextConfig}`);
			}
		});

		return () => {
			unsubSync();
		};
	}, [store]);
};

export const useSearchQueryProp = prop => {
	const { searchQuery } = useSearchQuery();
	let isVisible = true;

	if (prop && searchQuery) {
		isVisible = prop?.toLowerCase().includes(searchQuery.toLowerCase());
	}

	return [isVisible, searchQuery];
};

export const useConfigProp = prop => {
	return useConfig(
		React.useCallback(
			state => {
				const { config, updateProp } = state;
				return [get(config, prop), updateProp];
			},
			[prop]
		),
		/**
		 * This makes a big difference!
		 * https://github.com/pmndrs/zustand#selecting-multiple-state-slices
		 */
		shallowCompare
	);
};

export const usePalette = () => {
	return useConfigProp(`settings.defaults.color.palette`);
};

export const useGradients = () => {
	return useConfigProp(`settings.defaults.color.gradients`);
};

export const useFontSizes = () => {
	return useConfigProp(`settings.defaults.typography.fontSizes`);
};

export const useAddToList = ({ prop, createData }) => {
	const store = useConfig;

	const onAdd = React.useCallback(() => {
		store.setState(prev => {
			const prevData = get(prev, prop);
			const next = resolve(prev, prop, [
				...prevData,
				createData && createData()
			]);

			return { ...next, hasChange: true };
		});
	}, [createData, prop, store]);

	return onAdd;
};

export const useRemoveFromList = ({ prop, index }) => {
	const store = useConfig;

	const onRemove = React.useCallback(() => {
		store.setState(prev => {
			const prevData = get(prev, prop);
			const next = resolve(
				prev,
				prop,
				prevData.filter((item, i) => i !== index)
			);

			return { ...next };
		});
	}, [store, prop, index]);

	return onRemove;
};
