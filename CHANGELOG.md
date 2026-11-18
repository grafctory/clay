# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/metreeca/clay/compare/v0.2.1...HEAD)

## [0.2.1](https://github.com/metreeca/clay/compare/v0.2.0...v0.2.1) - 2026-11-18

### Fixed

- `@metreeca/clay-widgets/icon` - glyphs keep their text-height sizing in production builds of consuming apps, where
  they were drawn at the 24px Lucide default because the bundler dropped the stylesheet sizing them to their text

## [0.2.0](https://github.com/metreeca/clay/compare/v0.1.0...v0.2.0) - 2026-11-18

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

## [0.1.0](https://github.com/metreeca/clay/releases/tag/v0.1.0) - 2026-11-17

Initial release of a minimalist UI toolkit for Preact apps: interfaces are composed in JSX from accessible widgets that
commit to no data model, their behaviour kept in `@metreeca/core` state objects tested without a DOM, and their looks
read from the `@metreeca/skin` token contract, so a branded app restyles every screen through the skin tokens alone.

- `@metreeca/clay` - app-wide services, from routing and fetching to status and storage, provided once, read via hooks
- `@metreeca/clay-widgets` - interface components, from controls and forms to layouts, app shells and notices
- `@metreeca/clay-markdown` - Markdown sources rendered as documents, with their table of contents and front matter
