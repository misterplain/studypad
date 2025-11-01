# StudyPad

Reference-style study guide with sections rendered as a Bootstrap Accordion and code snippets highlighted via highlight.js.

## Content authoring

Each accordion item is defined in `src/data/guide.js` with the shape:

- id: number
- title: string
- content: string mixing text and fenced code blocks

Write code blocks using Markdown-style fences:

````
```js
console.log('hello');
````

```

Supported language tags include: js, javascript, ts, typescript, html, bash, json, css, python.

## Components

- `src/components/SectionTitle.js` – displays the page title and subtitle
- `src/components/AccordionList.js` – maps over items, parses content, and renders text + `HighlightedCodeBlock`
- `src/components/HighlightedCodeBlock.js` – highlights a code block using highlight.js
- `src/utils/contentParser.js` – splits mixed text and fenced code into segments

## How to run

```

npm install
npm start

```

## Notes

- highlight.js theme is `github.css`. You can swap themes by changing the import in `HighlightedCodeBlock.js`.
- If you add new languages, register them in `HighlightedCodeBlock.js`.
```
