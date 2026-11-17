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
import { afterEach, describe, expect, it, vi } from "vitest";
import { Form } from "./form.js";
import { Textarea } from "./textarea.js";


describe("Textarea", () => {

	function mount(element: JSX.Element): null | HTMLTextAreaElement {

		act(() => render(element, document.body));

		return document.querySelector<HTMLTextAreaElement>("clay-textarea > textarea");

	}


	afterEach(() => {
		act(() => render(null, document.body));
	});


	describe("field", () => {

		it("names the field as given", async () => {

			expect(mount(<Textarea name="Notes"/>)?.getAttribute("aria-label")).toBe("Notes");

		});

		it("carries the id a split label names it by", async () => {

			expect(mount(<Textarea id="notes"/>)?.id).toBe("notes");

		});

		it("links the element describing it", async () => {

			expect(mount(<Textarea description="notes-hint"/>)?.getAttribute("aria-describedby")).toBe("notes-hint");

		});

		it("links no description by default", async () => {

			expect(mount(<Textarea/>)?.hasAttribute("aria-describedby")).toBe(false);

		});

		it("states its options", async () => {

			const textarea = mount(<Textarea disabled readonly required/>);

			expect(textarea?.disabled).toBe(true);
			expect(textarea?.readOnly).toBe(true);
			expect(textarea?.required).toBe(true);

		});

		it("states its constraints", async () => {

			const textarea = mount(<Textarea minLength={2} maxLength={4}/>);

			expect(textarea?.getAttribute("minlength")).toBe("2");
			expect(textarea?.getAttribute("maxlength")).toBe("4");

		});

		it("stands at least as tall as the lines given", async () => {

			expect(mount(<Textarea rows={8}/>)?.style.getPropertyValue("--clay-textarea-rows")).toBe("8");

		});

		it("stands at the default height by default", async () => {

			expect(mount(<Textarea/>)?.style.getPropertyValue("--clay-textarea-rows")).toBe("");

		});

		it("grows where told to", async () => {

			mount(<Textarea grow/>);

			expect(document.querySelector("clay-textarea")?.hasAttribute("grow")).toBe(true);

		});

		it("takes the height of its lines by default", async () => {

			mount(<Textarea/>);

			expect(document.querySelector("clay-textarea")?.hasAttribute("grow")).toBe(false);

		});

		it("shows the placeholder given", async () => {

			expect(mount(<Textarea placeholder="Anything else?"/>)?.placeholder).toBe("Anything else?");

		});

	});

	describe("value", () => {

		it("shows the value given", async () => {

			expect(mount(<Textarea value={"one\ntwo"}/>)?.value).toBe("one\ntwo");

		});

		it("hands over the value on every edit", async () => {

			const onChange = vi.fn();
			const textarea = mount(<Textarea value="" onChange={onChange}/>)!; // test harness: field rendered

			act(() => {
				textarea.value = "one";
				textarea.dispatchEvent(new Event("input", { bubbles: true }));
			});

			expect(onChange).toHaveBeenCalledWith("one");

		});

	});

	describe("error", () => {

		function type(textarea: HTMLTextAreaElement, value: string): void {
			act(() => {
				textarea.value = value;
				textarea.dispatchEvent(new Event("input", { bubbles: true }));
			});
		}


		it("reports the error given while the field fails its constraints", async () => {

			const textarea = mount(<Textarea required value="" error="Describe the issue"/>);

			expect(textarea?.validity.valid).toBe(false);
			expect(textarea?.validationMessage).toBe("Describe the issue");

		});

		it("reports nothing while the field meets its constraints", async () => {

			const textarea = mount(<Textarea required value="broken" error="Describe the issue"/>);

			expect(textarea?.validity.valid).toBe(true);
			expect(textarea?.validationMessage).toBe("");

		});

		it("keeps the platform message by default", async () => {

			const textarea = mount(<Textarea required value=""/>);

			expect(textarea?.validity.valid).toBe(false);
			expect(textarea?.validity.customError).toBe(false);

		});

		it("follows the value the reader types", async () => {

			const textarea = mount(<Textarea required error="Describe the issue"/>)!; // test harness: field rendered

			type(textarea, "broken");

			expect(textarea.validity.valid).toBe(true);
			expect(textarea.validationMessage).toBe("");

			type(textarea, "");

			expect(textarea.validationMessage).toBe("Describe the issue");

		});

		it("follows the value the caller sets", async () => {

			mount(<Textarea required value="" error="Describe the issue"/>);

			const textarea = mount(<Textarea required value="broken" error="Describe the issue"/>);

			expect(textarea?.validity.valid).toBe(true);
			expect(textarea?.validationMessage).toBe("");

		});

		it("leaves the validity of the form unchanged", async () => {

			const onValidate = vi.fn();

			act(() => render(<Form onValidate={onValidate}>
				<Textarea required error="Describe the issue"/>
			</Form>, document.body));

			const textarea = document.querySelector<HTMLTextAreaElement>("clay-textarea > textarea")!; // test harness: field rendered

			type(textarea, "broken");

			expect(onValidate).toHaveBeenLastCalledWith(true);

			type(textarea, "");

			expect(onValidate).toHaveBeenLastCalledWith(false);

		});

	});

});
