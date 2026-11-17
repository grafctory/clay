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
 * Field label.
 *
 * Names a form control, so assistive technology announces the control by the text the reader sees beside it, and a
 * press on that text reaches the control as a press on the control itself would.
 *
 * @module label
 */

import { type ComponentChildren, createElement, toChildArray, type VNode } from "preact";
import "./label.css";


/**
 * Creates a label.
 *
 * Names its control in either of two ways, the placement of the text and the control being left to the caller:
 *
 * - **wrapped**: the control is given among the children, with the text before or after it, and is named without
 *   any id, as in `<Label>Title <Input/></Label>` or `<Label><Checkbox/> Remember me</Label>`
 * - **split**: the label stands apart from its control, such as in another column of a grid, and names it by the id
 *   given as `control`, which the control carries as its own `id` wherever on the screen it stands
 *
 * A label naming a control the reader has to fill in shows an asterisk after its text from the start, so the reader
 * knows what to fill in before submitting. A wrapped control marks its label through its own `required` state while
 * it takes input; a split label is marked through `required`. Assistive technology skips the asterisk and announces
 * the requirement from the control itself. A radio button is never marked: the caption of the
 * {@link fieldset!Fieldset Fieldset} grouping it is marked instead, so a single pick is marked once. The screen
 * states what the asterisk stands for, for instance in a note opening the form, before the reader reaches any field.
 *
 * A label stands at the size of its text and control unless told to `grow`, whatever the field it wraps: a growing
 * field never stretches the label around it, while a growing label stretches the {@link input!Input Input},
 * {@link textarea!Textarea Textarea} or {@link select!Select Select} it wraps to fill the room it takes.
 *
 * @param options The widget configuration
 *
 * @returns The label
 *
 * @see [HTML: The label element][label]
 *
 * [label]: https://html.spec.whatwg.org/multipage/forms.html#the-label-element
 */
export function Label({

	orientation = "vertical",
	grow = false,

	control,
	required,

	children

}: {

	/**
	 * How a wrapped control and its text are arranged: `vertical`, the default, stacks them one over the other, each
	 * aligned to the start, as a field stands under the text naming it; `horizontal` sets them side by side on one
	 * line, centred on each other, as a checkbox, a radio button or a switch stands beside the text naming it.
	 */
	orientation?: "vertical" | "horizontal"

	/**
	 * Whether the label spans the column holding it, a vertical label also taking the height the column leaves, or
	 * takes the room left on its line in a {@link strip!Strip Strip}; sized to its text and control if omitted. The
	 * field wrapped by a growing label fills that room, below the text or beside it, whether told to `grow` or not.
	 */
	grow?: boolean

	/**
	 * The id of the control the label names where the label stands apart from it; the control wrapped among the
	 * children if omitted. The id has to resolve to a rendered control, or the label names nothing at all.
	 */
	control?: string

	/**
	 * Whether the control named by `control` must be filled in, marking the label with an asterisk; unmarked if
	 * omitted. The setting marks the label only: the control still states the requirement through its own `required`,
	 * which the platform checks on submission and assistive technology announces on reaching the control.
	 */
	required?: boolean

	/**
	 * The text naming the control, and the control itself where the label wraps it.
	 *
	 * Plain text may be given as it stands, but text mixing in markup, such as a link to the terms being accepted,
	 * goes inside a single `span`: each run of text and each element is otherwise laid out as a part of its own.
	 */
	children?: ComponentChildren

}) {

	return createElement("clay-label", { orientation, grow, required }, <label for={control}>{parts(children)}</label>);

}


/**
 * Wraps each run of bare text in a span, so the text and the control are laid out as one part each, and the mark of
 * a required control follows the text rather than the control standing after it in the label.
 */
function parts(children: ComponentChildren): readonly VNode[] {

	return toChildArray(children)

		.reduce<readonly (string | VNode)[]>((runs, child) => {

			const last = runs.at(-1);

			return typeof child === "object" ? [...runs, child]
				: typeof last === "string" ? [...runs.slice(0, -1), `${last}${child}`]
					: [...runs, `${child}`];

		}, [])

		.map(run => typeof run === "string" ? <span>{run}</span> : run);

}
