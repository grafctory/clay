# @grafctory/clay-markdown

[![npm][npm-badge]][npm] [![Grafctory][grafctory-badge]][grafctory]

[npm-badge]: https://img.shields.io/npm/v/@grafctory/clay-markdown
[npm]: https://www.npmjs.com/package/@grafctory/clay-markdown
[grafctory-badge]: https://img.shields.io/badge/part%20of-Grafctory-blue
[grafctory]: https://github.com/grafctory

Preact Markdown documents for [@grafctory/clay].

Markdown sources rendered as the documents they describe, with a table of contents leading into their sections and the
values their front matter declares, so a page built from Markdown needs no rendering pipeline of its own.

Styling is structural only: what a widget needs to work, with colour, type and spacing left to
[@grafctory/skin] or to whoever styles the app.

[@grafctory/clay]: https://github.com/grafctory/clay
[@grafctory/skin]: https://github.com/grafctory/skin

# Installation

```shell
npm install @grafctory/clay-markdown  # this package
npm install preact                   # peer dependency
```

> [!WARNING]
>
> TypeScript consumers must use `"moduleResolution": "nodenext"/"node16"/"bundler"` in `tsconfig.json`.
> The legacy `"node"` resolver is not supported.

# Usage

> [!NOTE]
>
> This section introduces essential concepts; for complete coverage, see the
> [API reference](https://grafctory.github.io/clay/modules/_grafctory_clay-markdown.html).

{TBD: usage overview and examples}

# Support

- open an [issue](https://github.com/grafctory/clay/issues) to report a problem or to suggest a new feature
- start a [discussion](https://github.com/grafctory/clay/discussions) to ask a how-to question or to share an idea

# License

This project is licensed under the Apache 2.0 License –
see [LICENSE](https://github.com/grafctory/clay?tab=Apache-2.0-1-ov-file) file for details.

<sub>Grafctory™ is a trademark of Metreeca srl.</sub>
