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
 * Multi-line field.
 *
 * Takes a value running over several lines, such as a description or a note, expanding to fit the text so that what
 * was typed stays in view without a scroll bar of its own wherever the browser supports it.
 *
 * @module textarea
 */

import { createElement } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import "./textarea.css";


/**
 * Creates a multi-line field.
 *
 * Takes its value on a native text area, so the editing keys and the checking of every constraint come from the
 * platform; `Enter` starts a new line rather than submitting the {@link form!Form Form} around it. The field
 * stands at least `rows` lines tall, and expands to fit the text typed into it where the browser supports it.
 *
 * A field told to grow also takes the height its column leaves, letting a single long text fill the body of a screen.
 * The column is the {@link stack!Stack Stack} or the growing {@link form!Form Form} holding the field, directly or
 * through a growing {@link label!Label Label}, which fills it with the field, keeping the field below its text.
 *
 * The value is either held by the caller, which shows `value` and is handed each edit through `onChange`, or left to
 * the field where `value` is omitted, the field then keeping whatever the reader types.
 *
 * @param options The widget configuration
 *
 * @returns The field
 *
 * @see [HTML: The textarea element][textarea]
 *
 * [textarea]: https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element
 */
export function Textarea({

	name,
	id,
	description,

	disabled,
	readonly,
	required,

	minLength,
	maxLength,
	error,

	grow = false,
	rows,

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
	 * The id of the element describing the field, such as a hint on the text expected, which assistive technology
	 * reads out along with the accessible name whenever the field takes focus; none if omitted. The id has to resolve
	 * to a rendered element, or the field is described by nothing at all and the hint reaches sighted readers only.
	 */
	description?: string

	/**
	 * Whether the field takes no input, greyed and out of the tab order; editable if omitted.
	 */
	disabled?: boolean

	/**
	 * Whether the field shows its value without taking edits, while staying in the tab order; editable if omitted.
	 */
	readonly?: boolean

	/**
	 * Whether the field fails its constraints while empty; optional if omitted.
	 */
	required?: boolean

	/**
	 * The least number of characters a non-empty value holds; no floor if omitted.
	 */
	minLength?: number

	/**
	 * The greatest number of characters the field takes, typing past it being refused; no ceiling if omitted.
	 */
	maxLength?: number

	/**
	 * The message reported while the field fails its constraints, stating the rule a valid value follows, such as
	 * `Describe the issue in at least 20 characters` for a field held to `minLength`; the platform message if omitted.
	 * It takes the place of the platform message wherever the platform shows one, and never changes whether the field
	 * or the {@link form!Form Form} around it is valid, which the constraints alone decide.
	 */
	error?: string

	/**
	 * Whether the field takes the height its column leaves; sized to its lines if omitted. A growing field never stands
	 * shorter than `rows` lines, and a longer text still expands it, lengthening the column around it. A field wrapped
	 * in a {@link label!Label Label} fills the room the label takes instead, and so takes the height its column
	 * leaves only where the label is told to grow as well, whatever the field itself is told.
	 */
	grow?: boolean

	/**
	 * The least number of lines the field stands tall, such as `8` for a report running over several paragraphs; 3
	 * lines if omitted. The field expands past them to fit the text typed into it, where the browser supports it, so
	 * that a long text stays in view as a whole, with no scroll bar of its own hiding the lines typed first.
	 */
	rows?: number

	/**
	 * The hint shown in the field while it is empty, such as an example of the value expected. It disappears as soon
	 * as the reader types, so it never stands in for a {@link label!Label Label}; no hint if omitted.
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
	 * The platform takes a custom message only through setCustomValidity, with no attribute standing for it, so the
	 * message is set on the element after every render, catching a value or an error changed by the caller, and on
	 * every edit, before the form around the field reads its validity and hands it over to its own validation handler.
	 */

	const field = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		if ( field.current ) {
			report(field.current, error);
		}
	});

	return createElement("clay-textarea", { grow }, <textarea

		ref={field}

		id={id}

		disabled={disabled}
		readOnly={readonly}
		required={required}

		aria-label={name}
		aria-describedby={description}

		minLength={minLength}
		maxLength={maxLength}

		style={rows === undefined ? undefined : `--clay-textarea-rows: ${rows}`}

		placeholder={placeholder}
		value={value}

		onInput={event => {
			report(event.currentTarget, error);
			onChange?.(event.currentTarget.value);
		}}

	/>);

}


/**
 * Sets the custom message of a field to the error given while the field fails its own constraints, and clears it
 * otherwise, so the message names the rule a failing value breaks but never decides whether the field is valid.
 */
function report(field: HTMLTextAreaElement, error: undefined | string): void {
	field.setCustomValidity("");
	field.setCustomValidity(error === undefined || field.validity.valid ? "" : error);
}
