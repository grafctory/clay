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
 * Collapsible hierarchy.
 *
 * Lays out items nested under one another as an outline the reader unfolds one level at a time, so a deep hierarchy
 * opens on its top level and shows only the branches the reader asks for, however large the whole of it grows.
 *
 * @module tree
 */

import { useModel } from "@grafctory/clay/model";
import { createState } from "@grafctory/core/state";
import { type ComponentChildren, createElement } from "preact";
import { useId } from "preact/hooks";
import { Icon } from "../glyphs/icon.js";
import { isContent } from "../index.js";
import "./tree.css";


/**
 * Creates a tree node.
 *
 * Shows a label beside a toggle that unfolds the nested nodes below it, indented under the label so the depth of each
 * node reads off its position. A tree is built by nesting nodes as children, each unfolding on its own. A top level
 * made of leaves alone sets its labels flush with the content around the tree, so a flat list reads unindented.
 *
 * Nested nodes are rendered only while the node is expanded, so a subtree fetching its own content does so only once
 * the reader opens it. Collapsing a node discards the state of the nodes below it, so on unfolding again each of
 * them starts as its own `expanded` option states, whatever it was showing before.
 *
 * The toggle is a disclosure button: assistive technologies name it after the label and announce whether the node is
 * expanded. The nested nodes form a group named after the label too, so a screen reader entering them hears which
 * branch they belong to. A node with no nested nodes is a leaf: it draws a quiet dot in place of the toggle, and
 * assistive technologies meet its label alone, with no control beside it to take the focus or announce a state.
 *
 * The nodes do not form an ARIA tree, so arrow keys move nothing. Each toggle is a tab stop reached in reading order
 * like any other control on the page, so every branch on show adds a stop to the tab sequence of the page.
 *
 * @param options The widget configuration
 *
 * @returns The tree node
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ ARIA Authoring Practices: Disclosure Pattern}
 */
export function Tree({

	expanded = false,

	label,

	children

}: {

	/**
	 * Whether the node starts expanded; collapsed if omitted. Read on the first render alone, so changing it later
	 * leaves a node already on the page expanded or collapsed as the reader left it.
	 */
	expanded?: boolean

	/**
	 * The content naming the node, its toggle and its nested nodes, wrapping past its room rather than being clipped.
	 * Its text is what assistive technologies announce, so a label drawn as a glyph alone leaves the toggle unnamed.
	 */
	label: ComponentChildren

	/**
	 * The nested nodes, shown below the label while the node is expanded; a leaf if omitted.
	 */
	children?: ComponentChildren

}) {

	const id = useId();

	const branch = isContent(children);

	const { open, toggle } = useModel(() => createState<Fold>({

		open: expanded,

		toggle() {
			return { open: !this.open };
		}

	}));

	const unfolded = branch && open;


	return createElement("clay-tree", { expanded: unfolded }, <>

		<header>

			<button type="button" disabled={!branch}

				aria-hidden={branch ? undefined : true}
				aria-labelledby={branch ? id : undefined}
				aria-expanded={branch ? unfolded : undefined}

				onClick={toggle}

			>{branch && (unfolded ? <Icon.Collapse/> : <Icon.Expand/>)}</button>

			<span id={id}>{label}</span>

		</header>

		{/* no aria-controls: the group is rendered only while expanded, so the reference would dangle when collapsed */}

		{unfolded && <section role="group" aria-labelledby={id}>{children}</section>}

	</>);

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The disclosure state of a tree node.
 */
interface Fold {

	/**
	 * Whether the nested nodes are on show.
	 */
	readonly open: boolean;


	/**
	 * Shows the nested nodes if hidden, or hides them if shown.
	 *
	 * @returns The node as it now stands
	 */
	toggle(): Fold;

}
