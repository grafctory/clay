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

import { type JSX, render } from "preact";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "./label.js";


describe("Label", () => {

	function mount(element: JSX.Element): null | HTMLLabelElement {

		act(() => render(element, document.body));

		return document.querySelector<HTMLLabelElement>("clay-label > label");

	}


	afterEach(() => {
		act(() => render(null, document.body));
	});


	it("names a wrapped control without an id", async () => {

		const label = mount(<Label>Title <input/></Label>);

		expect(label?.textContent).toBe("Title ");
		expect(label?.querySelector("input")).not.toBeNull();
		expect(label?.hasAttribute("for")).toBe(false);

	});

	it("sets the text of a wrapped control apart from the control", async () => {

		const label = mount(<Label>Title <input/></Label>);

		expect([...label?.children ?? []].map(child => child.localName)).toEqual(["span", "input"]);
		expect(label?.querySelector(":scope > span")?.textContent).toBe("Title ");

	});

	it("keeps a run of text in a single part", async () => {

		const label = mount(<Label>Hello {"World"} <input/></Label>);

		expect(label?.querySelectorAll(":scope > span").length).toBe(1);
		expect(label?.querySelector(":scope > span")?.textContent).toBe("Hello World ");

	});

	it("keeps text given in a span as it stands", async () => {

		const label = mount(<Label><span>Accept <a href="#terms">terms</a></span><input type="checkbox"/></Label>);

		expect([...label?.children ?? []].map(child => child.localName)).toEqual(["span", "input"]);
		expect(label?.querySelector("span span")).toBeNull();

	});

	it("marks a split label whose control is required", async () => {

		mount(<Label control="title" required>Title</Label>);

		expect(document.querySelector("clay-label")?.hasAttribute("required")).toBe(true);

	});

	it("leaves a label unmarked by default", async () => {

		mount(<Label control="title">Title</Label>);

		expect(document.querySelector("clay-label")?.hasAttribute("required")).toBe(false);

	});

	it("stacks the text over the control by default", async () => {

		mount(<Label>Title <input/></Label>);

		expect(document.querySelector("clay-label")?.getAttribute("orientation")).toBe("vertical");

	});

	it("sets the text beside the control where horizontal", async () => {

		mount(<Label orientation="horizontal"><input type="checkbox"/> Remember Me</Label>);

		expect(document.querySelector("clay-label")?.getAttribute("orientation")).toBe("horizontal");

	});

	it("grows where told to", async () => {

		mount(<Label grow>Title <input/></Label>);

		expect(document.querySelector("clay-label")?.hasAttribute("grow")).toBe(true);

	});

	it("takes its own size by default", async () => {

		mount(<Label>Title <input/></Label>);

		expect(document.querySelector("clay-label")?.hasAttribute("grow")).toBe(false);

	});

	it("names a split control by its id", async () => {

		const label = mount(<Label control="title">Title</Label>);

		expect(label?.htmlFor).toBe("title");
		expect(label?.textContent).toBe("Title");

	});

});
