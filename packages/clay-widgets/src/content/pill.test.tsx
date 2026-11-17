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

import { type JSX, render } from "preact";
import { describe, expect, it } from "vitest";
import { Pill } from "./pill.js";


describe("Pill", () => {

	const pill = (element: JSX.Element): HTMLElement => {

		const container = document.createElement("div");

		render(element, container);

		const child = container.firstElementChild;

		if ( !(child instanceof HTMLElement) ) {
			throw new Error("missing pill element");
		}

		return child;

	};


	describe("label", () => {

		it("sets the label inside the pill", async () => {

			const element = pill(<Pill><em>Draft</em></Pill>);

			expect(element.tagName.toLowerCase()).toBe("clay-pill");
			expect(element.innerHTML).toBe("<em>Draft</em>");

		});

	});

	describe("look", () => {

		it("states the look given", async () => {

			expect(pill(<Pill look="subtle">Draft</Pill>).getAttribute("look")).toBe("subtle");
			expect(pill(<Pill look="strong">Draft</Pill>).getAttribute("look")).toBe("strong");

		});

		it("states no look when omitted", async () => {

			expect(pill(<Pill>Draft</Pill>).hasAttribute("look")).toBe(false);

		});

	});

	describe("color", () => {

		it("hands the colour given to the stylesheet", async () => {

			const element = pill(<Pill color="teal">Draft</Pill>);

			expect(element.getAttribute("color")).toBe("teal");
			expect(element.style.getPropertyValue("--clay-pill-color")).toBe("teal");

		});

		it("states no colour when omitted", async () => {

			const element = pill(<Pill>Draft</Pill>);

			expect(element.hasAttribute("color")).toBe(false);
			expect(element.hasAttribute("style")).toBe(false);

		});

	});

});
