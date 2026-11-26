# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> Packages published under the `@grafctory` scope from version 0.4.1; earlier versions were published under `@metreeca`.

## [Unreleased](https://github.com/grafctory/clay/compare/v0.4.1...HEAD)

### Fixed

- `@grafctory/clay-widgets/tool` - the shell bodies no longer add tab stops without a visible focus: the main column
  hands the focus a navigation lands on it to the main body, so the keys scroll the content at once
- `@grafctory/clay/router` - a `main` landmark taking the focus on a landing may pass it on to an element within itself,
  such as the box scrolling its content, without the router clearing it

## [0.4.1](https://github.com/grafctory/clay/compare/v0.4.0...v0.4.1) - 2026-11-24

### Changed

- Maintenance release with no change to the published API or behaviour

## [0.4.0](https://github.com/grafctory/clay/compare/v0.3.0...v0.4.0) - 2026-11-20

### Added

- `@metreeca/clay/router` - going back or forward through the browser history returns the window and every box with
  a stable `id` in the `main` landmark to where the reader left them, waiting for content loaded after landing
- `@metreeca/clay-widgets/tool` - going back or forward through the history returns the main body where it was left
- `@metreeca/clay-widgets/tool` - a screen replacing its content without a landing, as a catalogue does on a change
  of filters, states it through `gist`, and the main body returns to its top, so the reader never lands mid-list
- `@metreeca/clay-widgets/icon` - a `Busy` role marks the app working on what the reader asked for, and the Tool shell
  turns it while waiting, so a waiting glyph no longer borrows the look of the `Reload` action

### Changed

- **Breaking**: `@metreeca/clay-widgets/tool` - a page shows a single Tool shell at a time, as the shell boxes now
  carry fixed ids; a page nesting a second shell, as a preview pane might, lays its content out without one instead

## [0.3.0](https://github.com/grafctory/clay/compare/v0.2.1...v0.3.0) - 2026-11-19

### Changed

- **Breaking**: `@metreeca/clay-widgets` takes `@metreeca/clay` as a peer dependency, so that an app installs a single
  copy of it and every widget reads the router, client and status the app sets up; apps declare `@metreeca/clay`
  among their own dependencies, as they already do to set up the contexts the widgets read

## [0.2.1](https://github.com/grafctory/clay/compare/v0.2.0...v0.2.1) - 2026-11-18

### Fixed

- `@metreeca/clay-widgets/icon` - glyphs keep their text-height sizing in production builds of consuming apps, where
  they were drawn at the 24px Lucide default because the bundler dropped the stylesheet sizing them to their text

## [0.2.0](https://github.com/grafctory/clay/compare/v0.1.0...v0.2.0) - 2026-11-18

### Added

- `@metreeca/clay/board` - a source posting a failure it caught may hand over the problem details alone, its message
  then worded from the problem just as a raised issue is, so posted and raised failures read alike to the user

### Changed

- `@metreeca/clay/board` - a problem with no usable explanation or summary is worded by its HTTP status or by an
  excerpt of its machine-readable details, rather than as a bare `Unexpected error`, giving the reader a clue to go on
- `@metreeca/clay-widgets/toasts` - a toast stack takes the pointer over the whole of its glass tray, rather than
  over its controls alone, so a click falling between its toasts no longer reaches the screen beneath the glass

### Fixed

- `@metreeca/clay-widgets/tool` - the shell follows the viewport across the two-column threshold without flooding the
  console with resize loop notices as the window is resized, keeping the error logs of an app free of spurious entries

## [0.1.0](https://github.com/grafctory/clay/releases/tag/v0.1.0) - 2026-11-17

Initial release of a minimalist UI toolkit for Preact apps: interfaces are composed in JSX from accessible widgets that
commit to no data model, their behaviour kept in `@metreeca/core` state objects tested without a DOM, and their looks
read from the `@metreeca/skin` token contract, so a branded app restyles every screen through the skin tokens alone.

- `@metreeca/clay` - app-wide services, from routing and fetching to status and storage, provided once, read via hooks
- `@metreeca/clay-widgets` - interface components, from controls and forms to layouts, app shells and notices
- `@metreeca/clay-markdown` - Markdown sources rendered as documents, with their table of contents and front matter
