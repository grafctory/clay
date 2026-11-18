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
 * Shared status board.
 *
 * Offers the components of an interface one board to tell what the system is doing and has done, wherever they sit
 * in the page: a component running an operation or catching an issue puts it up as a post without knowing who shows
 * it, and a component showing posts renders them, as a transient toast, a note in the page or a diagnostic panel,
 * without knowing who put them up, so concurrent sources never paint over one another.
 *
 * Posts stand until they are cleared, and each keeps an identity of its own, so a source updates the post it put up
 * as its operation moves on, and a reader tells a new post from one it has already shown.
 *
 * Issues nothing in the interface caught are taken up as well: a broken script and an unhandled rejection are raised
 * on the outermost board as they reach the page, so an exchange whose rejection went unattended is shown rather than
 * logged, and once only however many boards are nested, since no component inside any of them can claim it.
 *
 * Posting and reading are offered apart, so a component only posting never renders because posts change.
 *
 * @module
 */

import { assert } from "@metreeca/core";
import { some, type Some } from "@metreeca/core/arrays";
import { clip } from "@metreeca/core/strings";
import { equals, immutable } from "@metreeca/core/values";
import { isProblem, type Problem, toProblem } from "@metreeca/http/success";
import { type ComponentChildren, createContext, createElement } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";


/**
 * The longest excerpt of machine-readable details quoted in a message.
 */
const ExcerptLength = 100;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The board seen outside any {@link Board}, posting nowhere, logging raised issues to the console and clearing nothing.
 */
const nowhere: Board = immutable({

	post: toPost,

	raise: issue => {

		console.error("unhandled issue outside Board context", issue);

		return toFailure(issue);

	},

	clear: () => {}

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The board provided by the enclosing {@link Board}, as returned by {@link useBoard}; outside any, {@link nowhere}.
 */
const BoardContext = createContext<Board>(nowhere);

/**
 * The posts standing on the enclosing {@link Board}, oldest first, as returned by {@link usePosts}; outside any, none.
 *
 * Kept apart from {@link BoardContext}, so a component only posting never renders because posts change.
 */
const PostsContext = createContext<readonly Post[]>(immutable([]));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Status board.
 *
 * The public place posts are put up on and taken down from: any source posts one, and any reader sees it.
 *
 * Posts, raises and clears the posts of the enclosing {@link Board} context, rendering again every component reading
 * them through {@link usePosts}.
 */
export interface Board {

	/**
	 * Puts up a post.
	 *
	 * A post sharing the `instance` of one standing replaces it where it stands, so a source moving its operation on
	 * updates its post without moving it ahead of the others; any other post is put up last, dropping the oldest
	 * beyond the limit. A post standing as given changes nothing.
	 *
	 * A post telling of a failure the source caught may leave its message out and carry the problem details alone. The
	 * message is then worded from the problem: its explanation, failing that its summary, and failing both a standing
	 * English hint at what went wrong. A failure thus reads alike whether a source posted or raised it.
	 *
	 * @param post The post to put up, whose identity and status may be left out, and its message as well where it
	 * carries a problem: a post with no `instance` is put up anew as a `urn:uuid:` URI, one with no `status` passes no
	 * verdict beyond its message, and one with no `message` is worded from its problem
	 *
	 * @returns The post as put up, identity included, so a source posts it again to tell how its operation moved on
	 * and clears it once it has nothing more to tell
	 */
	post(post: Partial<Post> & ({ message: string } | { problem: Problem })): Post;

	/**
	 * Raises an unexpected issue.
	 *
	 * Puts up an issue nothing in the interface was prepared for, such as a broken script, a component failing to
	 * render or a rejection nobody attended, as a new post carrying it as {@link Post.problem | problem details}.
	 *
	 * An operation failing as operations may, such as an exchange the server rejected, is never raised: the source
	 * running it catches the failure and tells how its operation went with {@link Board.post | post}, as a `failure`
	 * post carrying the problem details it caught, so the reader sees it as the outcome of that operation.
	 *
	 * The post tells from the shape of the issue what went wrong:
	 *
	 * - problem details, that is an object carrying at least one of `type`, `title`, `status`, `detail`, `instance` or
	 *   `report`, are kept as they are, so an issue reported by {@link @metreeca/http!success success} keeps the status
	 *   and the explanation its source gave it, and make the post a `failure`: an operation that did not complete
	 * - an {@link !Error Error} becomes `status` 0, with its name as `title` and its message as `detail`, the stack
	 *   left out as a post is expected to travel beyond the page that raised it, and makes the post a `defect`
	 * - anything else becomes `status` 0, carried as `report` if it is JSON data and as `detail` otherwise, and makes
	 *   the post a `defect` as well, being a value the interface threw rather than one it reported on purpose
	 *
	 * Every failed exchange reaches the board as problem details through {@link @metreeca/http!success success},
	 * transport failures included, so a rejection nobody attended is still told as the failure it was, and `defect` is
	 * left to whatever the interface threw on its own account; a client lacking that middleware has its transport
	 * failures stated as defects, since they reach the board as plain errors rather than as problem details.
	 *
	 * The message of the post is worded from its problem as {@link Board.post | post} words a post with no message of
	 * its own, so a raised issue reads exactly as the same failure would read once caught and posted by its source.
	 *
	 * Every issue counts as a new one: raising the same issue twice leaves two posts, each with an `instance` of its
	 * own, because two failed attempts are not one.
	 *
	 * @param issue The issue as it was caught
	 *
	 * @returns The post as raised, identity included, so a source clears it once the issue is settled
	 */
	raise(issue: unknown): Post;

	/**
	 * Clears posts.
	 *
	 * Clears the given posts alone, by their identity whatever they last carried, leaving those other sources put up,
	 * and ignores any already cleared.
	 *
	 * @param posts The posts to clear; every post standing if omitted
	 */
	clear(posts?: Some<Post>): void;

}

/**
 * A post put up on an interface board.
 */
export interface Post {

	/**
	 * Whether the reader can act on the post, for instance to open what it tells of or to retry what failed; a reader
	 * showing the post offers its message as a control handing the post back to the interface. Not actionable if
	 * omitted.
	 *
	 * @defaultValue false
	 */
	readonly actionable?: boolean;

	/**
	 * The identity of this post, which a source posting it again updates it by.
	 */
	readonly instance: string;

	/**
	 * What the system says has happened.
	 */
	readonly status: Status;

	/**
	 * The message the post carries, worded from its {@link Post.problem | problem} where the source gave none.
	 */
	readonly message: string;

	/**
	 * The problem details of the issue the post tells of; none if it tells of no issue.
	 *
	 * @see {@link https://www.rfc-editor.org/rfc/rfc9457 RFC 9457 - Problem Details for HTTP APIs}
	 */
	readonly problem?: Problem;

}


/**
 * What the system says has happened.
 *
 * The scale the design system states for reported things: `pending` is still under way, `success` completed as
 * intended, `paused` was halted with nothing wrong and waits to be resumed, `warning` completed with caveats, `failure`
 * failed to complete, `defect` broke through a fault of the interface itself rather than of anything it was asked to
 * do, and `normal` passes no verdict at all, leaving the message to speak for itself.
 */
export type Status =
	| "normal"
	| "pending"
	| "success"
	| "paused"
	| "warning"
	| "failure"
	| "defect";


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Offers a shared status board to nested components.
 *
 * The outermost context takes up the issues the page raises on its own account, that is broken scripts and unhandled
 * rejections, and states them among the others: a rejected exchange nobody attended reaches a reader with the status
 * and the explanation its source gave it, rather than as a console entry only developers ever read.
 *
 * Nested contexts behave as error boundaries do: each holds the posts and the issues of the components it encloses.
 * The issues of the page belong to no component, so they are stated once, however many contexts are nested.
 *
 * Posts stand for as long as the context lives and are cleared by whoever put them up or showed them, so a post is
 * never dropped by a later one; the oldest is dropped on its own where posts stand beyond `limit`.
 *
 * @param options The number of posts standing at a time, and the components they are offered to
 *
 * @returns The nested components, with the posts put up on the interface offered to them
 *
 * @throws {@link !TypeError TypeError} If `limit` is not an integer
 */
export function Board({

	limit = 0,

	children

}: {

	/**
	 * The number of posts held at a time: putting up a post beyond it drops the oldest; every post is kept if not
	 * positive. Taken as the context first renders, so a value given later never reaches it.
	 *
	 * @defaultValue 0
	 */
	limit?: number

	/**
	 * The components posts are offered to.
	 */
	children: ComponentChildren

}) {

	const $limit = assert(limit, limit => Number.isInteger(limit), `illegal limit <${limit}>`);

	const outermost = useContext(BoardContext) === nowhere;

	const [posts, setPosts] = useState<readonly Post[]>(() => immutable([]));

	const [board] = useState<Board>(() => {

		const put = (post: Post) => {

			setPosts(posts => posted(posts, post, $limit));

			return post;

		};

		return immutable({

			post: post => put(toPost(post)),
			raise: issue => put(toFailure(issue)),
			clear: posts => setPosts(standing => cleared(standing, posts))

		});

	});

	// window issues outlive the render, so they are taken up for as long as the context lives; page issues are owned
	// by no component, so the outermost context alone takes them up, as nested ones would state each of them again

	useEffect(() => outermost ? listen(board) : undefined, [outermost, board]);

	return createElement(BoardContext.Provider, { value: board },
		createElement(PostsContext.Provider, { value: posts, children })
	);

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieves the status board.
 *
 * The board stands for as long as the {@link Board} context offering it lives, so a component posting renders again
 * only as its own state requires, and a handler may keep it across exchanges.
 *
 * @returns The board of the innermost enclosing {@link Board} context; outside any, one posting nowhere, logging raised
 * issues to the console and clearing nothing
 */
export function useBoard(): Board {
	return useContext(BoardContext);
}

/**
 * Retrieves the posts put up on the interface.
 *
 * Renders the component again whenever a post is put up, raised or cleared, so a reader shows what stands at any
 * time.
 *
 * @returns The posts of the innermost enclosing {@link Board} context, oldest first; outside any, none
 */
export function usePosts(): readonly Post[] {
	return useContext(PostsContext);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Completes a post as a source puts it up.
 *
 * @param post The post as given to {@link Board.post}
 *
 * @returns `post` with a fresh `urn:uuid:` identity if it carries none, `normal` status if it states none, and its
 * problem worded by {@link toMessage} as its message if it carries no message of its own
 */
function toPost({

	instance = `urn:uuid:${crypto.randomUUID()}`,
	status = "normal",
	message,

	...rest

}: Parameters<Board["post"]>[0]): Post {

	// the signature rules out a post stating neither, but a caller unchecked by it still gets a wording

	return immutable({ ...rest, instance, status, message: message ?? toMessage(rest.problem ?? {}) });

}

/**
 * Converts a caught issue into a post telling of it.
 *
 * @param issue The issue as given to {@link Board.raise}
 *
 * @returns A post with a fresh identity, carrying `issue` as problem details worded as its message: a `failure` if
 * `issue` already was problem details, and a `defect` if it was anything else the interface threw
 */
function toFailure(issue: unknown): Post {

	return toPost({
		status: isProblem(issue) ? "failure" : "defect",
		problem: toProblem(issue)
	});

}

/**
 * Words a problem as the message of a post telling of it.
 *
 * @param problem The problem to word
 *
 * @returns The explanation of `problem`, or failing that its summary, blank values counting as missing; failing both,
 * a standing English wording naming its HTTP status or, where no server assigned one, quoting an excerpt of the
 * machine-readable details it carries, so the reader gets a hint of what went wrong even then
 */
function toMessage({ status, title, detail, report }: Problem): string {

	const explanation = [detail, title].find(text => text?.trim());

	return explanation ? explanation
		: status ? `Request failed with HTTP status ${status}`
			: report !== undefined ? `Unexpected error: ${clip(JSON.stringify(report), ExcerptLength)}`
				: "Unexpected error";

}


/**
 * Raises the issues the page raises on its own account.
 *
 * @param board The board broken scripts and unhandled rejections are raised on
 *
 * @returns A function that stops raising them
 */
function listen(board: Board): () => void {

	const failed = (event: ErrorEvent) => board.raise(event.error ?? event.message);
	const rejected = (event: PromiseRejectionEvent) => board.raise(event.reason);

	window.addEventListener("error", failed);
	window.addEventListener("unhandledrejection", rejected);

	return () => {

		window.removeEventListener("error", failed);
		window.removeEventListener("unhandledrejection", rejected);

	};

}

/**
 * Puts a post up on the board.
 *
 * @param posts The posts standing on the board
 * @param post The post to put up
 * @param limit The number of posts held at a time; unlimited if not positive
 *
 * @returns `posts` with `post` replacing the one sharing its identity where it stands, or put up last less the oldest
 * beyond `limit`; `posts` itself if `post` already stands as given, so the context renders nothing
 */
function posted(posts: readonly Post[], post: Post, limit: number): readonly Post[] {

	const standing = posts.find(({ instance }) => instance === post.instance);

	return standing === undefined ? immutable([...posts, post].slice(limit > 0 ? -limit : 0))
		: equals(standing, post) ? posts
			: immutable(posts.map(current => current === standing ? post : current));

}

/**
 * Takes posts down from the board.
 *
 * @param posts The posts standing on the board
 * @param targets The posts to take down, matched by identity; every post if omitted
 *
 * @returns `posts` less `targets`; `posts` itself if none of them stands, so the context renders nothing
 */
function cleared(posts: readonly Post[], targets?: Some<Post>): readonly Post[] {

	const instances = new Set(some(targets).map(({ instance }) => instance));

	const kept = targets === undefined ? [] : posts.filter(({ instance }) => !instances.has(instance));

	return kept.length === posts.length ? posts : immutable(kept);

}
