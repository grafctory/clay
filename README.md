# @grafctory/clay

Minimalist UI toolkit for Preact.

Interfaces are composed in JSX from general-purpose widgets, layouts and movable items, wired to app-wide services:

- **Accessible Widgets**: keyboard paths, focus handling and screen reader announcements designed to WCAG 2.2 AA
- **Model-Agnostic Components**: no commitment to a data model, so an app feeds them whatever data it handles
- **Testable Behaviour**: app behaviour kept in framework-agnostic `@grafctory/core` state objects, tested without a DOM
- **Shared Services**: routing, a fetch client, a status board and storage, provided once and reached through hooks

Components read their colours, faces and spacing from the [@grafctory/skin] token contract. Its stylesheet is optional:
components work without it, and follow the platform colour scheme and the app branding with it.

# Installation

```shell
npm install @grafctory/skin            # design system stylesheet, optional
npm install @grafctory/clay            # contexts and hooks
npm install @grafctory/clay-<package>  # one per package the app takes up
```

> [!WARNING]
>
> TypeScript consumers must use `"moduleResolution": "nodenext"/"node16"/"bundler"` in `tsconfig.json`.
> The legacy `"node"` resolver is not supported.

Add the interface components the app's screens need, each from its own package, with the peer dependencies it lists.

An app brands the [@grafctory/skin] stylesheet by overriding its tokens: its
[theming guide](https://github.com/grafctory/skin#theming) covers colours, faces, spacing and every other token family.

| Package                   | Description          |
|---------------------------|----------------------|
| [@grafctory/clay]          | Contexts and hooks   |
| [@grafctory/clay-widgets]  | Interface components |
| [@grafctory/clay-markdown] | Markdown documents   |

[@grafctory/skin]: https://grafctory.github.io/skin/

[@grafctory/clay]: https://grafctory.github.io/clay/modules/_grafctory_clay.html

[@grafctory/clay-widgets]: https://grafctory.github.io/clay/modules/_grafctory_clay-widgets.html

[@grafctory/clay-markdown]: https://grafctory.github.io/clay/modules/_grafctory_clay-markdown.html

# Usage

> [!NOTE]
>
> Each package documents its API in the [API reference](https://grafctory.github.io/clay/).

# Support

- open an [issue](https://github.com/grafctory/clay/issues) to report a problem or to suggest a new feature
- start a [discussion](https://github.com/grafctory/clay/discussions) to ask a how-to question or to share an idea

# License

This project is licensed under the Apache 2.0 License –
see [LICENSE](https://github.com/grafctory/clay?tab=Apache-2.0-1-ov-file) file for details.
