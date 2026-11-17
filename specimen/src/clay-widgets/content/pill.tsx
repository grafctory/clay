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
 * Pill samples.
 *
 * @module
 */

import { Pill } from "@metreeca/clay-widgets/pill";


/**
 * Creates the pill section.
 *
 * Shows pills in each look, first in the page colours and then coded by series colours, and one wrapped by its room.
 *
 * @returns The pill section
 */
export function Pills() {
	return <>

		<p>A pill sets a short value classifying an item in a rounded outline, inline with the text around it, so it
			reads as a tag rather than as wording.</p>

		<p>
			A subtle pill <Pill look="subtle">Draft</Pill> recedes, a normal pill <Pill>Draft</Pill> reads as a
			tag, and a strong pill <Pill look="strong">Draft</Pill> stands out among the items it marks.
		</p>

		<p>A colour codes the pill with a dot, a tint or a fill as the look decides, so pills sharing a value are
			matched at a glance; the label still says what the colour codes.</p>

		<p>
			<Pill look="subtle" color="var(--skin--color-series-1)">Physics</Pill>{" "}
			<Pill look="subtle" color="var(--skin--color-series-2)">History</Pill>{" "}
			<Pill look="subtle" color="var(--skin--color-series-3)">Law</Pill>
		</p>

		<p>
			<Pill color="var(--skin--color-series-1)">Physics</Pill>{" "}
			<Pill color="var(--skin--color-series-2)">History</Pill>{" "}
			<Pill color="var(--skin--color-series-3)">Law</Pill>
		</p>

		<p>
			<Pill look="strong" color="var(--skin--color-series-1)">Physics</Pill>{" "}
			<Pill look="strong" color="var(--skin--color-series-2)">History</Pill>{" "}
			<Pill look="strong" color="var(--skin--color-series-3)">Law</Pill>
		</p>

		<p>A label outrunning its room wraps, so it stays readable in full.</p>

		<div style={{ maxWidth: "10em" }}>
			<Pill>Comparative Constitutional Law</Pill>
		</div>

	</>;
}
