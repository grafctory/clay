# @grafctory/clay

[![npm][npm-badge]][npm] [![Grafctory][grafctory-badge]][grafctory]

[npm-badge]: https://img.shields.io/npm/v/@grafctory/clay
[npm]: https://www.npmjs.com/package/@grafctory/clay
[grafctory-badge]: https://img.shields.io/badge/part%20of-Grafctory-blue
[grafctory]: https://github.com/grafctory

Preact contexts and hooks for [@grafctory/clay].

App-wide services shared by the components of an interface: the app identity, client-side routing, a shared fetch
client, a status board for operations and issues, static assets and Web Storage state. An app provides each service once
where the interface is assembled, and every component below it reaches the service through a hook. The package also
hands out the element the app renders into, already fitted to the page and stable across hot reloads.

Components can adopt a framework-agnostic `@grafctory/core` state object as their own state, so behaviour defined once
drives every component built on it, whatever each one renders, and is tested once without a DOM.

[@grafctory/clay]: https://github.com/grafctory/clay

# Installation

```shell
npm install @grafctory/clay  # this package
npm install preact          # peer dependency
```

> [!WARNING]
>
> TypeScript consumers must use `"moduleResolution": "nodenext"/"node16"/"bundler"` in `tsconfig.json`.
> The legacy `"node"` resolver is not supported.

> [!WARNING]
>
> Reading the app identity from the package root needs a browser, since it is taken from the document on first access.
> A test or a server render reading it supplies a DOM first, as happy-dom does, carrying the title and tags it states.

# Usage

> [!NOTE]
>
> This section introduces essential concepts; for complete coverage, see the
> [API reference](https://grafctory.github.io/clay/modules/_grafctory_clay.html).

{TBD: usage overview and examples}

# Support

- open an [issue](https://github.com/grafctory/clay/issues) to report a problem or to suggest a new feature
- start a [discussion](https://github.com/grafctory/clay/discussions) to ask a how-to question or to share an idea

# License

This project is licensed under the Apache 2.0 License –
see [LICENSE](https://github.com/grafctory/clay?tab=Apache-2.0-1-ov-file) file for details.

<sub>Grafctory™ is a trademark of Metreeca srl.</sub>
