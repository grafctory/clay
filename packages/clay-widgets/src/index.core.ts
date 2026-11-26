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
 * Field validity.
 *
 * Lets a text field name the rule a failing value breaks, while the platform constraints alone decide its validity.
 *
 * @module index.core
 */


/**
 * Names the rule a failing field breaks.
 *
 * Shows the error as the message of the field while its value fails the constraints the field states, and clears the
 * message once the value passes. The message never makes a field invalid: the platform constraints alone decide that.
 *
 * @param field The field whose message is set
 * @param error The message naming the rule a failing value breaks, or `undefined` for the message of the platform
 */
export function report(field: HTMLInputElement | HTMLTextAreaElement, error: undefined | string): void {
	field.setCustomValidity("");
	field.setCustomValidity(error === undefined || field.validity.valid ? "" : error);
}
