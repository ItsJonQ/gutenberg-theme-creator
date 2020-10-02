import React from "react";
import {
	ControlLabel,
	FormGroup,
	Switch as BaseSwitch,
	TextInput as BaseTextInput,
	Text,
	VStack
} from "@wp-g2/components";
import { is, noop } from "@wp-g2/utils";
import { useSubState } from "@wp-g2/substate";
import { SearchableItem } from "./Search";
import { useConfigProp } from "../store";

export const FormControl = React.memo(
	({ label, helpText, children, templateColumns = "1fr 35%", prop }) => {
		return (
			<SearchableItem prop={prop}>
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
			</SearchableItem>
		);
	}
);

const Switch = React.memo(({ prop }) => {
	const [checked, update] = useConfigProp(prop);
	const onChange = React.useCallback(value => update({ prop, value }), [
		prop,
		update
	]);

	return <BaseSwitch checked={checked} onChange={onChange} />;
});

export const SwitchControl = React.memo(({ label, helpText, prop }) => {
	return (
		<FormControl label={label} helpText={helpText} prop={prop}>
			<Switch prop={prop} />
		</FormControl>
	);
});

export const TextInput = React.memo(
	({
		onChange = noop,
		onUpdate = noop,
		validate,
		value: initialValue,
		multiline,
		...props
	}) => {
		const textControl = useTextControl({
			onChange,
			validate,
			onUpdate,
			value: initialValue,
			multiline
		});

		return (
			<BaseTextInput
				autoComplete="off"
				spellCheck={false}
				multiline={multiline}
				{...textControl}
				{...props}
			/>
		);
	}
);

/**
 * All of this should be part of the base G2 TextInput
 */
function useTextControl({
	onBlur = noop,
	onChange = noop,
	validate,
	value: initialValue,
	onKeyDown = noop,
	onUpdate = noop,
	multiline
}) {
	const store = useSubState(set => ({
		value: initialValue,
		setValue: next => set({ value: next })
	}));

	const { setValue, value } = store();
	const undoTimeoutRef = React.useRef();

	React.useEffect(() => {
		if (initialValue !== store.getState().value) {
			onUpdate(initialValue, store.getState().value);
			store.setState({ value: initialValue });
		}
	}, [initialValue, onUpdate, store]);

	React.useEffect(() => {
		return () => {
			if (undoTimeoutRef.current) {
				clearTimeout(undoTimeoutRef.curremt);
			}
		};
	}, []);

	const handleOnCommit = React.useCallback(
		next => {
			return setValue(next);
		},
		[setValue]
	);

	const handleOnChange = React.useCallback(() => {
		const next = store.getState().value;
		if (next === initialValue) return;

		if (validate) {
			try {
				const regex = new RegExp(validate);

				if (is.function(validate)) {
					if (validate(next)) {
						onChange(next);
					} else {
						store.setState({ value: initialValue });
					}
					return;
				}

				if (regex.test(next)) {
					onChange(next);
				} else {
					store.setState({ value: initialValue });
				}
			} catch (err) {
				store.setState({ value: initialValue });
			}
		} else {
			onChange(next);
		}
	}, [initialValue, onChange, store, validate]);

	const handleOnKeyDown = React.useCallback(
		event => {
			// Enter press
			if (event.keyCode === 13 && !event.shiftKey) {
				event.preventDefault();
				handleOnChange();
			}
			// Undo press
			if (event.keyCode === 90 && (event.metaKey || event.ctrlKey)) {
				if (undoTimeoutRef.current) {
					clearTimeout(undoTimeoutRef.current);
				}
				event.persist();
				undoTimeoutRef.current = setTimeout(() => {
					onChange(event.target.value);
				}, 60);
			}

			onKeyDown(event);
		},
		[handleOnChange, onChange, onKeyDown]
	);

	const handleOnBlur = React.useCallback(
		event => {
			handleOnChange();
			onBlur(event);
		},
		[handleOnChange, onBlur]
	);
	return {
		onBlur: handleOnBlur,
		onKeyDown: handleOnKeyDown,
		onChange: handleOnCommit,
		value
	};
}
