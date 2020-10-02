import React from "react";
import { get, set as resolve } from "lodash";
import queryString from "query-string";

import { createStore } from "@wp-g2/substate";

/**
 * Source:
 * https://github.com/WordPress/gutenberg/blob/d4d083083306de27675eee3eed24c8cfd9bd80d5/docs/designers-developers/developers/themes/theme-json.md#settings
 */
const __initialState__ = {
	global: {
		settings: {
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
				store.setState(prev => ({ ...prev, config: encoded }));
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

export const useSearchQuery = () => {
	return useConfig(
		React.useCallback(state => {
			const { searchQuery, setState } = state;
			const update = next => setState({ searchQuery: next });

			return [searchQuery, update];
		}, [])
	);
};

export const useSearchQueryProp = prop => {
	return useConfig(
		React.useCallback(
			state => {
				const { searchQuery } = state;
				let isVisible = true;

				if (prop && searchQuery) {
					isVisible = prop?.toLowerCase().includes(searchQuery.toLowerCase());
				}

				return [isVisible, searchQuery];
			},
			[prop]
		)
	);
};

export const useConfigProp = prop => {
	return useConfig(
		React.useCallback(
			state => {
				const { config, updateProp } = state;
				return [get(config, prop), updateProp];
			},
			[prop]
		)
	);
};

export const usePalette = () => {
	return useConfig(
		React.useCallback(state => {
			const { config, updateProp } = state;
			return [
				get(config, `global.settings.color.palette`).map(
					(entry, index) => index
				),
				updateProp
			];
		}, [])
	);
};

export const useGradients = () => {
	return useConfig(
		React.useCallback(state => {
			const { config, updateProp } = state;
			return [
				get(config, `global.settings.color.gradients`).map(
					(entry, index) => index
				),
				updateProp
			];
		}, [])
	);
};

export const useFontSizes = () => {
	return useConfig(
		React.useCallback(state => {
			const { config, updateProp } = state;
			return [
				get(config, `global.settings.typography.fontSizes`).map(
					(entry, index) => index
				),
				updateProp
			];
		}, [])
	);
};
