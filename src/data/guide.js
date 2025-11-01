// Example study guide items. You can extend or split into multiple sections later.
export const guideItems = [
  {
    id: 1,
    title: "JavaScript Basics",
    content: `Variables and logging in JS.

  Use const for values that shouldn't be reassigned.

  ~~~js
  const msg = 'Hello world';
  console.log(msg);
  ~~~

  String concatenation example:

  ~~~javascript
  const name = 'Pat';
  console.log('Hello, ' + name + '!');
  ~~~
  `,
  },
  {
    id: 2,
    title: "HTML Snippet",
    content: `Basic HTML structure:

~~~html
<!doctype html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <h1>Hi</h1>
  </body>
</html>
~~~
`,
  },
  {
    id: 3,
    title: "Terminal Commands",
    content: `Install dependencies and start dev server:

  ~~~bash
  npm install
  npm start
  ~~~
  `,
  },
];

const guide = {
  id: "guide",
  title: "Guide",
  children: [...guideItems],
};

export default guide;
