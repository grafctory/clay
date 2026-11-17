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
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { Tree } from "./tree.js";


describe("Tree", () => {

	const mount = (element: JSX.Element): HTMLElement => {

		act(() => render(element, document.body));

		const node = document.body.querySelector("clay-tree");

		if ( !(node instanceof HTMLElement) ) {
			throw new Error("missing tree element");
		}

		return node;

	};

	const toggle = (node: HTMLElement): HTMLButtonElement => {

		const button = node.querySelector(":scope > header button");

		if ( !(button instanceof HTMLButtonElement) ) {
			throw new Error("missing toggle");
		}

		return button;

	};

	const nested = (node: HTMLElement): string => node.querySelector(":scope > section")?.textContent ?? "";

	const name = (button: HTMLButtonElement): string => (button.getAttribute("aria-labelledby") ?? "")
		.split(/\s+/)
		.map(id => document.getElementById(id)?.textContent ?? "")
		.join(" ")
		.trim();


	afterEach(() => {
		act(() => render(null, document.body));
	});


	describe("label", () => {

		it("shows the label beside the toggle", async () => {

			const node = mount(<Tree label={<em>Physics</em>}/>);

			expect(node.querySelector(":scope > header > span")?.innerHTML).toBe("<em>Physics</em>");

		});

	});

	describe("leaf", () => {

		it("disables the toggle and states no expanded state", async () => {

			const node = mount(<Tree label="Physics"/>);

			expect(toggle(node).disabled).toBe(true);
			expect(toggle(node).hasAttribute("aria-expanded")).toBe(false);
			expect(node.hasAttribute("expanded")).toBe(false);

		});

		it("hides the toggle from assistive technologies", async () => {

			const node = mount(<Tree label="Physics"/>);

			expect(toggle(node).getAttribute("aria-hidden")).toBe("true");

		});

		it("draws no glyph on the toggle", async () => {

			const node = mount(<Tree label="Physics"/>);

			expect(toggle(node).childElementCount).toBe(0);

		});

		it("never expands, even when asked to start expanded", async () => {

			const node = mount(<Tree expanded label="Physics"/>);

			expect(node.hasAttribute("expanded")).toBe(false);
			expect(nested(node)).toBe("");

		});

	});

	describe("branch", () => {

		it("starts collapsed by default, hiding the nested nodes", async () => {

			const node = mount(<Tree label="Sciences"><Tree label="Physics"/></Tree>);

			expect(toggle(node).disabled).toBe(false);
			expect(toggle(node).getAttribute("aria-expanded")).toBe("false");
			expect(nested(node)).toBe("");

		});

		it("starts expanded when asked, showing the nested nodes", async () => {

			const node = mount(<Tree expanded label="Sciences"><Tree label="Physics"/></Tree>);

			expect(toggle(node).getAttribute("aria-expanded")).toBe("true");
			expect(node.hasAttribute("expanded")).toBe(true);
			expect(nested(node)).toBe("Physics");

		});

		it("expands and collapses again on the toggle", async () => {

			const node = mount(<Tree label="Sciences"><Tree label="Physics"/></Tree>);

			await act(async () => toggle(node).click());

			expect(toggle(node).getAttribute("aria-expanded")).toBe("true");
			expect(nested(node)).toBe("Physics");

			await act(async () => toggle(node).click());

			expect(toggle(node).getAttribute("aria-expanded")).toBe("false");
			expect(nested(node)).toBe("");

		});

		it("names the toggle by the label, with no tooltip", async () => {

			const node = mount(<Tree label={<em>Sciences</em>}><Tree label="Physics"/></Tree>);

			expect(name(toggle(node))).toBe("Sciences");
			expect(toggle(node).hasAttribute("title")).toBe(false);
			expect(toggle(node).hasAttribute("aria-hidden")).toBe(false);

		});

		it("names each toggle apart from its nested ones", async () => {

			const node = mount(<Tree expanded label="Sciences"><Tree label="Physics"><Tree label="Optics"/></Tree></Tree>);

			const inner = node.querySelector(":scope > section > clay-tree");

			if ( !(inner instanceof HTMLElement) ) {
				throw new Error("missing nested tree element");
			}

			expect(name(toggle(inner))).toBe("Physics");
			expect(name(toggle(node))).toBe("Sciences");

		});

		it("groups the nested nodes under a name taken from the label", async () => {

			const node = mount(<Tree expanded label={<em>Sciences</em>}><Tree label="Physics"/></Tree>);

			const group = node.querySelector(":scope > section");

			if ( !(group instanceof HTMLElement) ) {
				throw new Error("missing nested group");
			}

			expect(group.getAttribute("role")).toBe("group");
			expect(group.getAttribute("aria-labelledby")).toBe(toggle(node).getAttribute("aria-labelledby"));
			expect(document.getElementById(group.getAttribute("aria-labelledby") ?? "")?.textContent).toBe("Sciences");

		});

		it("keeps the toggle name while the state changes", async () => {

			const node = mount(<Tree label="Sciences"><Tree label="Physics"/></Tree>);

			await act(async () => toggle(node).click());

			expect(name(toggle(node))).toBe("Sciences");

		});

	});

});
