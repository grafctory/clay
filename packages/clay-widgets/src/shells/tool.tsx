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
 * Tool shell.
 *
 * Lays out the screens of an app or a tool in the familiar app shell arrangement: a side column of standing controls
 * beside a main column holding the content of the moment. A screen fills the slots, and the shell arranges them.
 *
 * @module tool
 */

import { useModel } from "@grafctory/clay/model";
import { createState } from "@grafctory/core/state";
import { equals } from "@grafctory/core/values";
import { skin } from "@grafctory/skin";
import { type ComponentChildren, createElement, type TargetedEvent, type TargetedFocusEvent, type TargetedMouseEvent } from "preact";
import { useEffect } from "preact/hooks";
import { Icon } from "../glyphs/icon.js";
import "./tool.css";


/**
 * The prefix of the ids of the shell boxes. It stays the same each time a screen mounts, so the router finds the main
 * body again on a history traversal and returns it to the position the reader left it at.
 */
const Id = "clay-tool";

/**
 * The id of the main body, which takes the focus the main column passes on and scrolls back to its top on a new gist.
 */
const Body = `${Id}-body`;

/**
 * The delay a change of `busy` waits out before the frame shows it (ms).
 */
const BusyDelay = 300;

/**
 * The handlers a busy shell takes on. They cancel every gesture that would act on a control inside the shell, from
 * typing and editing to dragging and pressing, and leave the focus where it stands and the content open to a reader.
 */
const Ignored = Object.fromEntries([
	"onKeyDownCapture",
	"onBeforeInputCapture",
	"onPasteCapture",
	"onCutCapture",
	"onDropCapture",
	"onDragStartCapture",
	"onMouseDownCapture",
	"onClickCapture",
	"onAuxClickCapture",
	"onDblClickCapture",
	"onContextMenuCapture"
].map(handler => [handler, ignore]));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a tool shell.
 *
 * Lays a screen out as two columns, the side column beside the main one, each with a head, a body and a foot. The
 * heads of the two columns share one row, so they always match in height, and the feet do the same. A column with
 * nothing for its foot shows none, its body running down to the bottom of the frame. The body of each column scrolls
 * on its own, while its head and foot stay in view, so what they hold is always within reach. The content of a body
 * keeps its width whether the body scrolls or not, so it never reflows where the platform shows a classic scrollbar.
 * Content made sticky in a body pins flush against the head or foot of its column, with no strip of scrolled content
 * showing between them. Everything else keeps the gutter of the body, so only pinned content meets the bars.
 *
 * Heads and feet lay what they hold out as a single row of flex items, centred vertically and never wrapping, so each
 * bar keeps the height of a single line. An item keeps its own width unless it states flex properties of its own, as
 * one growing to fill the bar does, and an item too wide for the bar shrinks, ending its clipped text with an ellipsis.
 *
 * The shell fills the height its host gives it and sets none of its own. Without a definite height, the bodies grow
 * with their content instead of scrolling, and the heads and feet scroll out of view with the page.
 *
 * The main column grows up to a width limit, past which both columns stand centred in the frame. The limit, the width
 * of the side column, the gutters, and the font sizes of heads and feet are tuned through custom properties named
 * after what they tune, such as `--clay-tool-side-width` or `--clay-tool-head-gutter`. Each retunes the shell it is
 * set on, or every shell inside the element it is set on, leaving the other properties of the shell to their defaults.
 *
 * Waiting is stated by the app through `busy`, as when it has to let its state settle before the reader acts again:
 * the frame marks itself busy for assistive technology and ignores pointer and keyboard input aimed inside it, while
 * the focus stays where it stands and the content stays readable. After a short delay, the frame is also veiled, shows
 * a turning glyph at the end of the main head in place of the menu, and announces waiting to screen readers.
 *
 * The main column is named after `head` and takes the focus as the {@link @grafctory/clay!router.Router router} lands a
 * screen, without adding a tab stop, so a reader hears which screen they are on rather than a control of the last one.
 * The column hands that focus on to the main body, so the keys scroll the content at once, while a control inside the
 * column keeps the focus it takes. The main body then opens at its top, or on the element a link targets, set below
 * the head at the gutter of the body, as it stands before any scrolling. The side body keeps its place, so a reader
 * never loses their position in it. A screen replacing its content without a landing, as a catalogue does on a change
 * of filters, states it through the `gist`, and the main body opens at its top again, so the reader never lands halfway
 * down a list they have not read. Under the Clay router, going back or forward in the browser history returns the main
 * body to where the reader left it. The router finds the body again by the fixed ids of the shell boxes, so a page
 * shows one shell at a time, since a second one would repeat those ids and leave the router unable to tell them apart.
 *
 * On a viewport too narrow for two columns, the main column takes the whole frame and the side column becomes a drawer
 * opened from a menu button leading the main head. The drawer covers the main column, across the whole width of a
 * phone and as wide as the side column on a tablet, while the main column stays in place underneath and keeps its
 * state. A close button leads the head of the drawer, and focus moves to it as the drawer opens. Escape, a click
 * outside the drawer, or a link followed inside it closes the drawer and returns focus to the menu button.
 *
 * On such a viewport the heading of the screen also moves from the main head to the top of the main body, and scrolls
 * away with the content it names, keeping the head gutter above and below it so it stands apart from that content as
 * it does in the main head. The mark moves from the side head to stand next to the menu button. The main head keeps
 * only the menu button, the mark and the menu, leaving the room to content. Both heads stand close to the top of the
 * window, with the same narrow spacing above and below them, whatever head gutter the shell is tuned to.
 *
 * While the side column is locked on such a viewport, the menu button is left out and the mark leads the main head.
 * The heading of the screen keeps its place in the main head, as on a wider viewport, so the actions it holds, such
 * as unsafe ones, stay apart from those in the menu rather than scrolling away with the content.
 *
 * @param options The widget configuration
 *
 * @returns The tool shell
 */
export function Tool({

	wide = false,
	busy = false,

	locked = false,
	tucked = false,

	gist,

	mark,
	meta,
	tray,
	more,

	head,
	menu,
	copy,
	foot,

	children

}: {

	/**
	 * Whether the shell spans the whole frame rather than standing centred within its width limit. The main column then
	 * takes all the room the side column leaves. Set it for content that never has too much room, such as a table, a
	 * chart or a map, and leave it off for prose, which long lines make hard to read. Capped and centred if omitted.
	 */
	wide?: boolean

	/**
	 * Whether the app is waiting on work the reader has to let settle, such as the exchanges a change of filters
	 * starts. While it is set, the shell ignores input aimed inside it, and content rendered outside it, such as a
	 * dialog, answers as usual. The focus never moves, so a field keeps its editing state, though its caret is hidden
	 * until the shell is idle again. Waiting shows and clears after a short delay, so a brief stretch shows nothing and
	 * close stretches show as one. Idle if omitted, so the shell answers input as usual.
	 */
	busy?: boolean


	/**
	 * Whether the side column stays in view but takes no input, as while the main column needs the full attention of
	 * the reader. What it holds fades while the column keeps its place, and drops out of the tab order and the
	 * accessibility tree until it is unlocked. A control inside it loses the focus as it is locked. On a narrow
	 * viewport locking closes the drawer and leaves the menu button out, so the drawer stays shut. The `mark` in the
	 * main head fades and takes no input, as in the side column. The `head` keeps its place in the main head, so the
	 * actions it holds, such as unsafe ones, stay apart from those in the `menu`. Usable if omitted.
	 */
	locked?: boolean

	/**
	 * Whether the side column is tucked away, left out of the frame rather than locked, until the app brings it back.
	 * The main column takes the room the side column held, and nothing passed to `mark`, `meta`, `tray` or `more` is
	 * shown. Set it for screens seen through rather than moved around in, such as a sign-in or a splash. Shown if
	 * omitted, so every screen leaving it off keeps the standing controls of the app within reach of the reader.
	 */
	tucked?: boolean


	/**
	 * What the main body shows, as the app tells one content from another, such as the criteria a catalogue draws its
	 * results from rather than the results themselves. A change of gist brings the main body back to its top, as a
	 * landing does, while the side body keeps its place. Gists are compared by content, so a gist rebuilt with equal
	 * values moves nothing, and neither does loading more results under the same criteria. A gist must be plain data
	 * free of cycles: objects and arrays are compared member by member, and any other value by identity. The gist the
	 * shell is first shown with moves nothing, as the screen has just landed, but a gist set later where none stood
	 * counts as a change. Without a gist, the main body keeps its place until the router lands another screen.
	 */
	gist?: unknown


	/**
	 * The identity of the app, such as its logo and name linking to its home, in the head of the side column. On a
	 * viewport too narrow for two columns it moves to the main head instead, so the app stays named while the drawer is
	 * closed. There it stands next to the menu button, or leads the head while the side column is locked, fading and
	 * taking no input as it would in the side column, so it never offers a way out of a locked screen.
	 */
	mark?: ComponentChildren

	/**
	 * The details of the app, such as its release or the environment it runs in, at the end of the head of the side
	 * column. It keeps its full width and is never clipped, while the other items of the head give way to it. It stays
	 * within the height of a single line, so a button shown or removed in it never changes the height of the head.
	 */
	meta?: ComponentChildren

	/**
	 * The standing controls of the app, such as its sections and the filters in force, in the body of the side column.
	 * They stand in a column filling the body, so each can grow, shrink or align through its own flex properties. Their
	 * margins add up rather than collapsing, so controls spaced by margins stand further apart than in the plain flow
	 * of a page; controls wrapped in a single element keep their usual spacing.
	 */
	tray?: ComponentChildren

	/**
	 * The secondary controls of the app, such as settings, help and signing out, in the foot of the side column.
	 */
	more?: ComponentChildren


	/**
	 * The heading of the screen, such as its title, in the head of the main column. Its items stand in a row filling
	 * the head up to the `menu` within a single line, so showing or removing a button never changes the height of the
	 * head. On a viewport too narrow for two columns it opens the main body instead, scrolling away with the content
	 * rather than standing over it, so the narrow screen gives its whole height to the content once the reader starts
	 * scrolling. While the side column is locked it keeps its place in the main head whatever the viewport.
	 */
	head?: ComponentChildren

	/**
	 * The menu of the screen, such as its actions, at the end of the head of the main column. It keeps its full width
	 * and is never clipped, while the other items of the head give way to it. While the shell shows waiting, a turning
	 * glyph stands in its place, and the head keeps its height and layout until waiting ends.
	 */
	menu?: ComponentChildren

	/**
	 * The closing notice of the content, such as a copyright, at the end of the body of the main column. It scrolls
	 * with the content rather than standing in view like the `foot`, and rests at the bottom of a body the content is
	 * too short to fill. It takes the font size and block gutter of the feet, set through the same custom properties.
	 */
	copy?: ComponentChildren

	/**
	 * The standing notes of the screen, such as a status line or the terms, in the foot of the main column.
	 */
	foot?: ComponentChildren


	/**
	 * The content of the moment, scrolling in the body of the main column. It is laid out in the plain flow of a page,
	 * so floated images wrap text and the margins of adjacent blocks collapse. Content that has to fill the room the
	 * body leaves, such as a map or an empty state centred on the screen, passes a lone element stating
	 * `block-size: 100%`, which fills the body less its inset and the `copy`; one that may grow taller states
	 * `min-block-size: 100%` instead, pushing the `copy` further down once it grows taller than the body, as a lone
	 * {@link form!Form Form} told to grow does, so a single long text fills the body and still runs on past it.
	 */
	children?: ComponentChildren

}) {

	const side = `${Id}-side`;

	// the landmark is named by the head on show, so the reference stands or falls with its target and never dangles

	const title = head ? `${Id}-title` : undefined;

	const { waiting, settle } = useModel(() => createState<Waiting>({

		waiting: false,

		settle(waiting: boolean) {
			return { waiting };
		}

	}));

	// only what waiting shows follows `busy` after the delay, while input is ignored as soon as it is set

	useEffect(() => {

		const timer = setTimeout(() => settle(busy), BusyDelay);

		return () => clearTimeout(timer);

	}, [busy]);

	// a locked side column drops the control holding the focus, as browsers do on their own as it turns inert, so the
	// focus leaves it at once and alike everywhere rather than whenever the browser gets round to it

	useEffect(() => {

		if ( locked ) {
			release(document.getElementById(side));
		} else {
			// an unlocked side column keeps the focus where the reader left it
		}

	}, [locked]);

	const { changes, track } = useModel(() => createState<Content>({

		gist,
		changes: 0,

		track(gist: unknown) {
			return equals(gist, this.gist) ? {} : { gist, changes: this.changes+1 };
		}

	}));

	// a gist built anew on every render reaches the model each time, which counts only a change of content

	useEffect(() => {

		if ( track(gist).changes > changes ) {
			document.getElementById(Body)?.scrollTo(0, 0);
		} else {
			// the same content keeps the reader where they are
		}

	}, [gist]);

	const { open, toggle } = useModel(() => createState<Drawer>({

		open: false,

		toggle(open: boolean) {
			return { open };
		}

	}));

	const { split, sync } = useModel(() => createState<Viewport>({

		split: medium(),

		sync() {
			return { split: medium() };
		}

	}));

	// the head stays in the main head where two columns fit or the side column is locked

	const headed = split || locked;

	// the switch lives in the cascade, which notifies no change, so the shell reads it again as the window is resized;
	// a resize observer would raise loop notices as the layout switch reshapes the root it watches, and a transition
	// starts from the state the render read, so the listener is renewed with every crossing it reports

	useEffect(() => {

		window.addEventListener("resize", sync);

		return () => window.removeEventListener("resize", sync);

	}, [sync]);

	// input is ignored rather than the columns turned inert, as an inert column drops the focus: a field switching
	// between reading and editing as it loses and takes the focus would flicker across every stretch of waiting;
	// the handlers sit on the frame, so they see only input aimed inside it, the drawer included

	return createElement("clay-tool", {

		"aria-busy": busy,
		...(busy ? Ignored : undefined),

		wide,
		waiting,
		locked,
		tucked

	}, <>

		{/*
		 * The side column is a popover, shown as a column wherever two fit and as a drawer elsewhere: the platform then
		 * dismisses it on Escape and on a click outside, exposes the expanded state of the button opening it, and
		 * returns focus to that button as it closes. Locking takes it out of reach for every gesture at once. While the
		 * drawer is open the main column it covers is out of reach as well, so focus never lands out of sight under it.
		 *
		 * The drawer is named after the button opening it, so a reader hears what has opened. A locked side column is
		 * taken out of light dismiss: the switch closes a drawer left open, and no menu button is left to reopen it.
		 * Its head is led by the mark where two columns fit, and by the close button of the drawer elsewhere, as the
		 * mark has then moved to the main head; the meta keeps the end of the head either way.
		 */}

		{!tucked && <aside
            id={side}
            aria-label="Menu"
            popover={locked ? "manual" : "auto"}
            inert={locked}
            onClick={follow}
            onToggle={event => {
				reveal(event);
				toggle(opened(event));
			}}
        >

            <header>
				{split ? mark :
					<button type="button" popovertarget={side} popovertargetaction="hide" aria-label="Close menu">
						<Icon.Close/>
					</button>}
				{meta && <div class="meta">{meta}</div>}
            </header>

            <div>
                <div>{tray}</div>
            </div>
			{more && <footer>{more}</footer>}

        </aside>}

		{/*
		 * The main column takes the focus from code alone, so a navigation can land the focus on it and a reader hears
		 * its name, taken from the head, without a tab stop being added. The column hands that focus on to its body,
		 * so the keys scroll the content, while a control inside keeps the focus it takes. The head is held in a box
		 * of its own, to serve as that name and to lay what it holds out as a row filling the main head up to the menu.
		 *
		 * Where two columns do not fit, the mark of the side column joins the main head, in a box of its own so it is
		 * locked along with the side column. The head then opens the body instead, scrolling away with the content
		 * below it, unless a locked side column keeps it in the main head, apart from the menu as on a wide viewport.
		 */}

		<main id={`${Id}-main`} aria-labelledby={title} tabIndex={-1} inert={open} onFocus={relay}>

			<header>
				{!tucked && !locked && <button type="button" popovertarget={side} aria-label="Open menu">
                    <Icon.Menu/>
                </button>}
				{!tucked && !split && mark && <div class="mark" inert={locked}>{mark}</div>}
				{headed && head && <div id={title}>{head}</div>}

				{/*
				 * The turning glyph stands over the menu, which keeps its place hidden beneath, so the head holds its
				 * height. It is a bare glyph rather than a control: it offers nothing to press, and waiting is told by
				 * the status message, so the glyph is inert and a reader meets nothing where it stands.
				 */}

				{menu && <div class="menu">{menu}</div>}
				{waiting && <span class="busy" inert><Icon.Busy/></span>}

			</header>

			<div id={Body} tabIndex={-1}>
				{!headed && head && <header id={title}>{head}</header>}
				<div>{children}</div>
				{copy && <footer>{copy}</footer>}
			</div>
			{foot && <footer>{foot}</footer>}

		</main>

		{/*
		 * Waiting is announced through a status message kept out of sight, as `aria-busy` goes unspoken by most screen
		 * readers. The region stays rendered while it is empty, since one inserted along with its text is often missed,
		 * and it stands outside the columns, so a drawer turning the main column inert never silences it.
		 */}

		<span role="status" data-offscreen>{waiting ? "Busy" : ""}</span>

	</>);

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Whether the shell states waiting, as it follows `busy` once the delay has elapsed.
 */
interface Waiting {

	/**
	 * Whether the frame is veiled, shows the turning glyph and announces waiting to screen readers.
	 */
	readonly waiting: boolean

	/**
	 * Records waiting as started or ended.
	 *
	 * @param waiting Whether the shell now states waiting
	 *
	 * @returns The waiting state as it now stands
	 */
	settle(waiting: boolean): Waiting

}

/**
 * What the main body shows, as told by its gist.
 */
interface Content {

	/**
	 * The gist of what the main body shows.
	 */
	readonly gist: unknown

	/**
	 * How many times the gist has changed since the shell was first shown.
	 */
	readonly changes: number

	/**
	 * Records the gist of what the main body now shows.
	 *
	 * @param gist The gist the shell is now shown with
	 *
	 * @returns The content as it now stands, unchanged if `gist` equals the last one by content
	 */
	track(gist: unknown): Content

}

/**
 * Whether the drawer is open, as the side column shows it.
 */
interface Drawer {

	/**
	 * Whether the side column is on show as a drawer over the main column.
	 */
	readonly open: boolean

	/**
	 * Records the drawer as opened or closed.
	 *
	 * @param open Whether the drawer is now open
	 *
	 * @returns The drawer as it now stands
	 */
	toggle(open: boolean): Drawer

}

/**
 * Whether the viewport fits two columns, as the design system states it.
 */
interface Viewport {

	/**
	 * Whether the side column stands beside the main one rather than as a drawer over it.
	 */
	readonly split: boolean

	/**
	 * Reads the viewport again, once the window is resized.
	 *
	 * @returns The viewport as it now stands
	 */
	sync(): Viewport

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Tells whether the viewport fits two columns, reading the switch the design system turns on from the medium width up,
 * so the shell follows the threshold wherever the design system sets it and whatever an app forces it to.
 *
 * @returns `true` if the medium viewport switch is on
 */
function medium(): boolean {
	return getComputedStyle(document.documentElement).getPropertyValue(skin.viewportMedium).trim() === "on";
}

/**
 * Tells whether a toggle of the side column left it open.
 *
 * @param event The toggle the side column went through
 *
 * @returns `true` if the side column is now open as a drawer
 */
function opened(event: TargetedEvent<HTMLElement>): boolean {
	return "newState" in event && event.newState === "open";
}

/**
 * Moves the focus to the close button as the drawer opens, so a keyboard lands inside what now covers the main column;
 * `autofocus` would take it there too, but browsers flag it on every page loaded from an address with a fragment.
 *
 * @param event The toggle the side column went through
 */
function reveal(event: TargetedEvent<HTMLElement>): void {
	if ( opened(event) ) {
		event.currentTarget.querySelector<HTMLElement>(":scope > header > button")?.focus();
	} else {
		// the platform returns the focus to the menu button as the drawer closes
	}
}

/**
 * Passes the focus the main column takes on to its body, so the keys scroll the content while a screen reader still
 * announces the landmark entered. The body takes no tab stop: the focus reaches it from code alone, as on a navigation.
 *
 * @param event The focus the main column or an element inside it took
 */
function relay(event: TargetedFocusEvent<HTMLElement>): void {
	if ( event.target === event.currentTarget ) {
		document.getElementById(Body)?.focus({ preventScroll: true });
	} else {
		// a control inside the main column keeps the focus it took
	}
}

/**
 * Takes the focus off the control holding it inside a column.
 *
 * @param column The column whose control is to lose the focus
 */
function release(column: HTMLElement | null): void {

	const control = document.activeElement;

	if ( control instanceof HTMLElement && column?.contains(control) ) {
		control.blur();
	} else {
		// the focus rests outside the column
	}

}

/**
 * Cancels a gesture aimed inside a busy shell, stopping its default action and the handlers of the control it targets.
 *
 * @param event The gesture to cancel
 */
function ignore(event: Event): void {
	event.preventDefault();
	event.stopPropagation();
}

/**
 * Closes the drawer once a link inside it is followed, so the reader lands on the destination rather than on the
 * drawer still covering it; a click landing anywhere else in the drawer leaves it open.
 *
 * @param event The click inside the side column
 */
function follow(event: TargetedMouseEvent<HTMLElement>): void {
	if ( event.target instanceof Element && event.target.closest("a[href]") ) {
		event.currentTarget.togglePopover(false);
	} else {
		// a click elsewhere in the drawer leaves it open
	}
}
