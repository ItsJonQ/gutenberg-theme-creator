import React from "react";
import { get, set as resolve } from "lodash";

import { createStore, shallowCompare } from "@wp-g2/substate";

const DATA_TYPES = {
	boolean: "boolean"
};

/**
 * Source:
 * https://github.com/WordPress/gutenberg/blob/d4d083083306de27675eee3eed24c8cfd9bd80d5/docs/designers-developers/developers/themes/theme-json.md#settings
 */
const __initialState__ = {
	global: {
		settings: [
			{
				label: "Color",
				key: "color",
				settings: [
					{
						key: "custom",
						type: DATA_TYPES.boolean,
						value: true,
						label: "Custom",
						description: "Enable custom colors"
					},
					{
						key: "customGradient",
						type: DATA_TYPES.boolean,
						value: true,
						label: "Custom Gradient",
						description: "Enable custom gradient colors"
					},
					{
						key: "link",
						type: DATA_TYPES.boolean,
						value: true,
						label: "Link",
						description: "Enable custom link colors"
					}
				]
			}
		]
	}
};

const initialState = JSON.parse(JSON.stringify(__initialState__));

export const useStore = createStore(set => ({
	config: initialState,
	setState: next => set(prev => ({ ...prev, ...next })),
	update: key => next => {
		set(prev => {
			return { ...resolve(prev, `config.${key}`, next) };
		});
	},
	updateProp: ({ prop: key, value: next }) => {
		set(prev => {
			return { ...resolve(prev, `config.${key}`, next) };
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

export const useConfig = () => {
	return useStore(
		React.useCallback(state => state.config, []),
		shallowCompare
	);
};

export const useConfigProp = prop => {
	return useStore(
		React.useCallback(
			state => {
				const value = get(state, `config.${prop}`);
				const update = next => {
					state.updateProp({ prop: `${prop}.value`, value: next });
				};

				return [value, update];
			},
			[prop]
		),
		shallowCompare
	);
};

function convert(obj) {
	const keys = Object.keys(obj);

	return keys.reduce((props, k) => {
		let v = obj[k];

		return { ...props, [k]: v };
	}, {});
}

export const useConfigJson = () => {
	return useStore(
		React.useCallback(state => {
			return state.config;
		}, []),
		shallowCompare
	);
};
