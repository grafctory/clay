# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0](https://github.com/metreeca/clay/releases/tag/v0.1.0)

Initial release of a minimalist UI toolkit for Preact apps: interfaces are composed in JSX from accessible widgets that
commit to no data model, their behaviour kept in `@metreeca/core` state objects tested without a DOM, and their looks
read from the `@metreeca/skin` token contract, so a branded app restyles every screen through the skin tokens alone.

- `@metreeca/clay` - app-wide services, from routing and fetching to status and storage, provided once, read via hooks
- `@metreeca/clay-widgets` - interface components, from controls and forms to layouts, app shells and notices
- `@metreeca/clay-markdown` - Markdown sources rendered as documents, with their table of contents and front matter
