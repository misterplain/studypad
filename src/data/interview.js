// Interview Questions root section with two sources, each linking out and containing two Q&A items.
const interview = {
  id: "interview-questions",
  title: "Interview Questions",
  children: [
    {
      id: "site-y",
      title: "Interview Questions from Site Y",
      // Using string link form to test link rendering path #1
      link: "https://example.com/site-y-interview-questions",
      children: [
        {
          id: "site-y-q1",
          title: "What is a closure in JavaScript?",
          content: `A closure is the combination of a function and the lexical environment within which that function was declared. It lets the function access variables from its outer scope even after that function has returned.

~~~js
function outer() {
  const secret = 'shh';
  return function inner() {
    return secret; // inner closes over secret
  }
}
const fn = outer();
console.log(fn()); // 'shh'
~~~
`,
        },
        {
          id: "site-y-q2",
          title: "Explain the JavaScript event loop.",
          content: `The event loop coordinates the call stack and the task queues. It repeatedly checks whether the call stack is empty, and if so, dequeues a task (like a callback) from the microtask or macrotask queues to execute, enabling asynchronous behavior in JS.`,
        },
      ],
    },
    {
      id: "site-x",
      title: "Interview Questions from Site X",
      // Using object link form to test link rendering path #2 with a custom label
      link: {
        url: "https://example.com/site-x-interview-questions",
        label: "Visit Site X",
      },
      children: [
        {
          id: "site-x-q1",
          title: "What is Big-O notation?",
          content: `Big-O notation describes an algorithm's time or space complexity in terms of input size growth, focusing on the dominant term while ignoring constants and lower-order terms.`,
        },
        {
          id: "site-x-q2",
          title: "Difference between var, let, and const?",
          content: `var is function-scoped and hoisted; let and const are block-scoped. let allows reassignment, const does not (though object contents can still be mutated).`,
        },
      ],
    },
    {
      id: "devto-33-js-concepts",
      title: "JS Concepts (dev.to summary)",
      link: {
        url: "https://dev.to/youneslaaroussi/33-javascript-concepts-every-beginner-should-know-with-tutorials-4kao",
        label: "Read on DEV.to",
      },
      children: [
        {
          id: "devto-call-stack",
          title: "Call Stack",
          content: `The call stack tracks what function is currently running and where to return after each call.

~~~js
function a() { console.log('a'); b(); }
function b() { console.log('b'); c(); }
function c() { console.log('c'); }
a();
// Order: 'a' -> 'b' -> 'c'
~~~
`,
        },
        {
          id: "devto-scope",
          title: "Function vs Block vs Lexical Scope",
          content: `Function scope applies to var; block scope applies to let/const. Lexical scope means inner functions see outer bindings.

~~~js
function outer() {
  const x = 1;
  if (true) {
    var fnScope = 'var-visible';
    let blockOnly = 'let-visible';
  }
  // fnScope is visible here; blockOnly is not
  return () => x; // inner closes over x (lexical scope)
}
~~~
`,
        },
        {
          id: "devto-prototype",
          title: "Prototype Chain",
          content: `Objects delegate to their prototype for missing properties, forming a chain.

~~~js
const base = { greet() { return 'hi'; } };
const obj = Object.create(base);
obj.name = 'Pat';
console.log(obj.greet(), obj.name); // 'hi Pat'
~~~
`,
        },
        {
          id: "devto-promises",
          title: "Promises and async/await",
          content: `Promises model eventual values. async/await makes them read like synchronous code.

~~~js
function fetchValue() { return Promise.resolve(42); }
async function run() {
  const n = await fetchValue();
  console.log(n);
}
run();
~~~
`,
        },
        {
          id: "devto-event-loop",
          title: "Event Loop: Microtasks vs Macrotasks",
          content: `Microtasks (Promise callbacks) run before macrotasks (setTimeout) after the current stack.

~~~js
console.log('start');
setTimeout(() => console.log('timeout'), 0); // macrotask
Promise.resolve().then(() => console.log('microtask'));
console.log('end');
// Output: start, end, microtask, timeout
~~~
`,
        },
        {
          id: "devto-equality",
          title: "== vs ===",
          content: `=== compares without coercion; == allows coercion and can surprise.

~~~js
console.log(0 == false);  // true (coercion)
console.log(0 === false); // false (different types)
~~~
`,
        },
      ],
    },
  ],
};

export default interview;
