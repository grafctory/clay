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
 * Sampler.
 *
 * Assembles the sections each package contributes into one page, inside the same frame an app lays its own screens
 * out in, so the frame is shown by being used rather than described.
 *
 * @module
 */

import "@grafctory/skin/presets/roboto.css";
import { host } from "@grafctory/clay";
import { Fetch } from "@grafctory/clay/fetch";
import { Router, Routes } from "@grafctory/clay/router";
import { Transfer } from "@grafctory/clay/transfer";
import { createFetch } from "@grafctory/http";
import { mock } from "@grafctory/http/mock";
import { ClayMarkdown } from "@grafctory/specimen/clay-markdown/index.js";
import { ClayWidgets } from "@grafctory/specimen/clay-widgets/index.js";
import { ToolScreen } from "@grafctory/specimen/clay-widgets/shells/tool.js";
import { Clay } from "@grafctory/specimen/clay/index.js";
import { ClayMarkdownPath, ClayPath, ClayWidgetsPath, Root, ToolPath } from "@grafctory/specimen/index.core.js";
import { render } from "preact";
import "./index.css";


render(<Specimen/>, host("clay-specimen"));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Specimen() {

	return <Fetch fetch={createFetch(mock({ delay: 2000 }))}>

		<Transfer>

			<Router>

				<Routes>{{

					[Root]: ClayPath,

					[ToolPath]: <ToolScreen/>, // ahead of the package page whose subtree it lies in

					[ClayPath]: <Clay/>,
					[ClayWidgetsPath]: <ClayWidgets/>,
					[ClayMarkdownPath]: <ClayMarkdown/>

				}}</Routes>

			</Router>

		</Transfer>

	</Fetch>;

}
