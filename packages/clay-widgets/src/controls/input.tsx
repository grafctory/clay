/*
 * Copyright © 2026 Metreeca srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Single-line field.
 *
 * Takes a value typed on one line, such as a title, an address, a number or a date, checked against the constraints
 * the field states as the reader types it, so a mistake is caught before the form is submitted.
 *
 * @module input
 */

import { createElement } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { report } from "../index.core.js";
import "./input.css";


/**
 * Creates a single-line field.
 *
 * Takes its value on a native input, so the editing keys, the on-screen keyboard suited to `type`, the date and time
 * pickers, and the checking of every constraint come from the platform. A field failing a constraint is marked once
 * the reader has had a say on it, and stops the {@link form!Form Form} around it from being submitted.
 *
 * The value is either held by the caller, which shows `value` and is handed each edit through `onChange`, or left to
 * the field where `value` is omitted, the field then keeping whatever the reader types.
 *
 * @param options The widget configuration
 *
 * @returns The field
 *
 * @see [HTML: The input element][input]
 *
 * [input]: https://html.spec.whatwg.org/multipage/input.html#the-input-element
 */
export function Input({

	name,
	id,
	description,

	disabled,
	grow = false,
	readonly,
	required,

	type = "text",
	autocomplete,

	min,
	max,
	step,
	minLength,
	maxLength,
	pattern,
	error,

	size,

	placeholder,
	value,

	onChange

}: {

	/**
	 * The accessible name, required where no {@link label!Label Label} names the field.
	 */
	name?: string

	/**
	 * The id a split {@link label!Label Label} names the field by; no id if omitted.
	 */
	id?: string

	/**
	 * The id of the element describing the field, such as a hint on the value expected, which assistive technology
	 * reads out along with the accessible name whenever the field takes focus; none if omitted. The id has to resolve
	 * to a rendered element, or the field is described by nothing at all and the hint reaches sighted readers only.
	 */
	description?: string

	/**
	 * Whether the field takes no input, greyed and out of the tab order; editable if omitted.
	 */
	disabled?: boolean

	/**
	 * Whether the field spans the column holding it, or the room left on its line in a {@link strip!Strip Strip};
	 * sized to `size` characters if omitted. A growing field of any type takes that whole room, so a long value such as
	 * an address stays in view. A field wrapped in a {@link label!Label Label} is bounded by the room the label takes
	 * instead, so spanning the column, or the room beside the label text, takes a label told to grow.
	 */
	grow?: boolean

	/**
	 * Whether the field shows its value without taking edits, while staying in the tab order; editable if omitted.
	 */
	readonly?: boolean

	/**
	 * Whether the field fails its constraints while empty; optional if omitted.
	 */
	required?: boolean

	/**
	 * The kind of value the field takes, deciding the constraints checked on it and the keyboard or picker offered to
	 * type it with; `text` if omitted. Whatever the kind, the value is handed over as the text the field holds, as
	 * the platform writes it in every locale: a `date` as `YYYY-MM-DD`, a `time` as `hh:mm`, a `datetime-local` as
	 * `YYYY-MM-DDThh:mm`, a `month` as `YYYY-MM` and a `week` as `YYYY-Www`, with the week number in two digits.
	 */
	// Kept in sync with the date and time types the empty pattern rule in input.css colours as a placeholder.
	type?: "text" | "email" | "url" | "tel" | "password" | "number"
		| "date" | "time" | "datetime-local" | "month" | "week"

	/**
	 * The purpose of the value, as one of the [autofill names][autofill] the platform defines, such as `email` or
	 * `shipping street-address`; none if omitted. The browser offers the data it keeps for that purpose, and assistive
	 * technology states what the field asks for. WCAG SC 1.3.5 requires one on any field asking readers about
	 * themselves, so that a reader is spared typing what the browser already knows.
	 *
	 * [autofill]: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill-field
	 */
	autocomplete?: string

	/**
	 * The least value a `number` field or a date or time field accepts, written as its values are; none if omitted.
	 */
	min?: string

	/**
	 * The greatest value a `number` field or a date or time field accepts, written as its values are; none if omitted.
	 */
	max?: string

	/**
	 * The granularity of the values a `number` field or a date or time field accepts, such as `0.01` for a price or
	 * `60` seconds for a time stated to the minute; the platform default for the type if omitted.
	 */
	step?: string

	/**
	 * The least number of characters a non-empty value holds; no floor if omitted.
	 */
	minLength?: number

	/**
	 * The greatest number of characters the field takes, typing past it being refused; no ceiling if omitted.
	 */
	maxLength?: number

	/**
	 * The regular expression the whole value has to match, read as the platform reads it; any value if omitted.
	 */
	pattern?: string

	/**
	 * The message reported while the field fails its constraints, stating the rule a valid value follows, such as
	 * `Enter an address at a partner university` for an address restricted by `pattern`; the platform message if
	 * omitted. It takes the place of the platform message wherever the platform shows one, and never changes whether
	 * the field or the {@link form!Form Form} around it is valid, which the constraints alone decide.
	 */
	error?: string

	/**
	 * The width the field stands at, in characters, never wider than the column holding it; a `number` field or a
	 * date or time field ignores it, as does a growing field. The platform width, about 20 characters, if omitted.
	 */
	size?: number

	/**
	 * The hint shown in the field while it is empty, such as an example of the value expected. It disappears as soon
	 * as the reader types, so it never stands in for a {@link label!Label Label}; no hint if omitted.
	 *
	 * A date or time field shows no hint: the platform fills it with the pattern of the value instead, such as
	 * `dd/mm/yyyy`, in the order and with the separators of the locale of the reader.
	 */
	placeholder?: string

	/**
	 * The value shown in the field, held by the caller; left to the field if omitted.
	 */
	value?: string

	/**
	 * Receives the value of the field on every edit, as the reader types it.
	 *
	 * @param value The value the field now holds
	 */
	onChange?: (value: string) => void

}) {

	/*
	 * The element tells a stylesheet whether the field holds a value, which a date or time field offers no selector
	 * for, having no placeholder. A value held by the caller settles it; otherwise the last edit of the reader does.
	 */

	const [typed, setTyped] = useState("");

	const empty = (value ?? typed) === "";

	/*
	 * The platform takes a custom message only through setCustomValidity, with no attribute standing for it, so the
	 * message is set on the element after every render, catching a value or an error changed by the caller, and on
	 * every edit, before the form around the field reads its validity and hands it over to its own validation handler.
	 */

	const field = useRef<HTMLInputElement>(null);

	useLayoutEffect(() => {
		if ( field.current ) {
			report(field.current, error);
		}
	});

	return createElement("clay-input", { empty, grow }, <input

		ref={field}

		id={id}

		disabled={disabled}
		readOnly={readonly}
		required={required}

		aria-label={name}
		aria-describedby={description}
		type={type}
		autocomplete={autocomplete}

		min={min}
		max={max}
		step={step}
		minLength={minLength}
		maxLength={maxLength}
		pattern={pattern}

		size={size}

		placeholder={placeholder}
		value={value}

		onInput={event => {
			report(event.currentTarget, error);
			setTyped(event.currentTarget.value);
			onChange?.(event.currentTarget.value);
		}}

	/>);

}
