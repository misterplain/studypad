// Nested Data Structures and Algorithms content
// Structure: top-level item with children categories, each with two questions

const dsaItem = {
  id: "dsa",
  title: "Data Structures and Algorithms",
  children: [
    {
      id: "arrays",
      title: "Arrays",
      children: [
        {
          id: "arrays-two-sum",
          title: "Two Sum",
          content: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

~~~js
function twoSum(nums, target) {
  const map = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return []; // not found
}
~~~
`,
        },
        {
          id: "arrays-max-subarray",
          title: "Maximum Subarray (Kadane's)",
          content: `Find the contiguous subarray with the largest sum.

~~~js
function maxSubArray(nums) {
  let best = nums[0];
  let cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}
~~~
`,
        },
      ],
    },
    {
      id: "linked-list",
      title: "Linked List",
      children: [
        {
          id: "ll-reverse",
          title: "Reverse Linked List",
          content: `Reverse a singly linked list iteratively.

~~~js
function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
~~~
`,
        },
        {
          id: "ll-detect-cycle",
          title: "Detect Cycle (Floyd's)",
          content: `Detect if a linked list has a cycle using Floyd's Tortoise and Hare.

~~~js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
~~~
`,
        },
      ],
    },
    {
      id: "binary-search",
      title: "Binary Search",
      children: [
        {
          id: "bs-search-sorted",
          title: "Search in Sorted Array",
          content: `Return index of target in sorted array (or -1).

~~~js
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}
~~~
`,
        },
        {
          id: "bs-first-bad-version",
          title: "First Bad Version",
          content: `Given isBadVersion API, find the first bad version.

~~~js
function firstBadVersion(n, isBadVersion) {
  let lo = 1, hi = n, ans = n;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (isBadVersion(mid)) {
      ans = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return ans;
}
~~~
`,
        },
      ],
    },
  ],
};

export default dsaItem;
