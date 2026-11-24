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
 * Tree samples.
 *
 * @module
 */

import { Tree } from "@grafctory/clay-widgets/tree";


/**
 * Creates the tree section.
 *
 * Shows a hierarchy opening on its top level, with one branch already unfolded and leaves at every depth.
 *
 * @returns The tree section
 */
export function Trees() {
	return <>

		<p>A tree lays out items nested under one another as an outline the reader unfolds one level at a time, the
			nested nodes indented under the label of the node holding them. A node with nothing nested is a leaf, and
			draws a quiet dot where a branch draws its toggle, so the labels beside it line up at every depth.</p>

		<Tree expanded label="Sciences">

			<Tree expanded label="Physics">
				<Tree label="Mechanics"/>
				<Tree label="Optics"/>
			</Tree>

			<Tree label="Chemistry">
				<Tree label="Organic Chemistry"/>
				<Tree label="Inorganic Chemistry"/>
			</Tree>

			<Tree label="Mathematics"/>

		</Tree>

		<Tree label="Humanities">

			<Tree label="History">
				<Tree label="Ancient History"/>
				<Tree label="Modern History"/>
			</Tree>

			<Tree label="Comparative Constitutional Law and the Theory of Federal Systems"/>

		</Tree>

	</>;
}
