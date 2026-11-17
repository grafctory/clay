/*
 * Copyright © 2020-2026 EC2U Alliance
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
 * Classifying tag.
 *
 * Marks an item with the short values it is classified by, such as a state, a category or a keyword, so a reader
 * scanning a list or a card picks them out at a glance rather than reading them out of the running text.
 *
 * @module pill
 */

import { type ComponentChildren, createElement } from "preact";
import "./pill.css";


/**
 * Creates a pill.
 *
 * Sets a short label in a rounded outline, inline with the content around it, so a value classifying an item reads as
 * a tag rather than as running text. A label outrunning the room it is given wraps rather than being clipped, so it
 * stays readable in full at any text size, though a short one keeps the pill reading as a tag.
 *
 * Assistive technologies meet the label alone, so the wording carries whatever the look and the colour suggest. A pill
 * adds no break of its own to the text read around it: inside a link or a heading, keep a space or punctuation between
 * pills and the neighbouring text, or the accessible name runs them together into a single word.
 *
 * @param options The widget configuration
 *
 * @returns The pill
 */
export function Pill({

	look,
	color,

	children

}: {

	/**
	 * How loud the pill appears among the items it marks; `normal` if omitted. A `subtle` pill recedes behind the
	 * content around it, while a `strong` one is filled so it stands out at a glance.
	 *
	 * The look is emphasis only, never a meaning: forced colours mode drops the dot, the tint and the fill.
	 */
	look?: "subtle" | "normal" | "strong"

	/**
	 * The CSS colour coding the pill, so pills sharing a value are matched at a glance; the page colours if omitted.
	 * The colour marks the label with a dot in the `normal` look, tints the label, border and fill in the `subtle`
	 * look, and fills the pill behind a label in the page colour in the `strong` look.
	 *
	 * The `normal` and `subtle` looks keep the label legible whatever the colour, while a `strong` pill sets the label
	 * in the page colour on the fill, so the consumer picks a fill holding 4.5:1 against the page colour in both
	 * schemes, such as `light-dark(#06C, #4AF)`, darker than a light page and lighter than a dark one.
	 *
	 * The colour is never announced to assistive technologies, so it never codes a meaning the label leaves unsaid.
	 */
	color?: string

	/**
	 * The label set inside the pill.
	 */
	children?: ComponentChildren

}) {

	return createElement("clay-pill", {
		look,
		color,
		style: color === undefined ? undefined : { "--clay-pill-color": color } // attr() can't yet portably read a colour
	}, children);

}
