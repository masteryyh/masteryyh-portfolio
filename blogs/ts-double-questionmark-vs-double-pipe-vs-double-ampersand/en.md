---
title: The ?? , || and && Operators in JS/TS
description: For JS/TS developers, understanding the differences between the nullish coalescing operator (??), logical OR (||), and logical AND (&&) is crucial.
date: 2026-01-18
tags: [TypeScript, JavaScript]
highlight: true
---

# Preface

In other languages, `||` and `&&` are already ubiquitous operators in daily development (disregarding C++ with its operator overloading quirks). Combined together, they form flexible conditional logic. However, JavaScript/TypeScript not only adds additional usage and semantics to these two operators but also introduces a new `??` operator. If you're a beginner or transitioning from another language and start coding without carefully reading the documentation, it's easy to misunderstand and misuse these operators, leading to subtle, hard-to-detect bugs.

# Quick Comparison

- `??` (Nullish Coalescing Operator): Only checks for `null` and `undefined` operands.

- `||` (Logical OR Operator): Returns the first **truthy** value; if no truthy value exists, returns the last **falsy** operand.

- `&&` (Logical AND Operator): Returns the first **falsy** value; if no falsy value exists, returns the last operand.

# Detailed Explanation

## The Nullish Coalescing Operator (??)

Returns the right operand only when the left operand is `null` or `undefined` (*nullish value*). Otherwise, returns the left operand.
The key difference from `||` is that `||` treats all falsy values (such as `0`, `''`, `false`, etc.) as cases needing replacement, while `??` only cares about `null` and `undefined`. Sometimes you may consider certain falsy values as valid, and that's when `??` becomes very useful.

```typescript
const foo1 = null ?? 'bar'; 
console.log(foo1); // Output: 'bar'

const foo2 = 0 ?? 42; 
console.log(foo2); // Output: 0

const foo3 = undefined ?? 'bar'; 
console.log(foo3); // Output: 'bar'

const foo4 = '' ?? 'wow'; 
console.log(foo4); // Output: ''

const foo5 = false ?? true; 
console.log(foo5); // Output: false

const foo6 = 12 ?? 34; 
console.log(foo6); // Output: 12
```

Since it's common to handle API responses where some fields may be `null` (the field exists in the structure but has a `null` value) or `undefined` (the field doesn't appear in the agreed data structure), the `??` operator is extremely useful in real-world development.

## The Logical OR Operator (||)

Returns the first **truthy** operand encountered. If all operands are **falsy**, returns the last operand.

```typescript
const foo1 = null || 'bar'; 
console.log(foo1); // Output: 'bar'

const foo2 = 0 || 42; 
console.log(foo2); // Output: 42

const foo3 = undefined || 'bar'; 
console.log(foo3); // Output: 'bar'

const foo4 = '' || 'wow'; 
console.log(foo4); // Output: 'wow'

const foo5 = false || true; 
console.log(foo5); // Output: true
```

In practice, the `||` operator is commonly used to set default values for application configuration, for example:

```typescript
const redisPort = Math.max(parseInt(process.env.REDIS_PORT || '6379', 10), 0) || 6379;
```

## The Logical AND Operator (&&)

Returns the first **falsy** operand encountered. If all operands are **truthy**, returns the last operand.

```typescript
const foo1 = 'hello' && 'world'; 
console.log(foo1); // Output: 'world'

const foo2 = 0 && 'bar'; 
console.log(foo2); // Output: 0

const foo3 = 'foo' && ''; 
console.log(foo3); // Output: ''

const foo4 = true && false; 
console.log(foo4); // Output: false

function executeSomething() {
    console.log('Executed!');
    return 42;
}
const foo5 = 'bar' && executeSomething(); 
console.log(foo5); // Output: 'Executed!' then: 42
```

It's commonly used in convenient conditional execution scenarios, for example:

```typescript
const loginInfo = getLoginInfo(); // Get login information
loginInfo.loggedIn && showDashboard();
```

# Why Is This (At Least for Me) So Confusing?

As a developer who also works with Java/Go, I initially couldn't understand why JS/TS's logical operators `||` and `&&` return an operand instead of a boolean value, especially with the additional introduction of the `??` operator. For someone who just transitioned into Node.js development and had to handle some frontend development simultaneously, it was quite mentally taxing.

Although from a conciseness and flexibility perspective, retrofitting the original `||` and `&&` operators and introducing the `??` operator does make code more concise, for beginners or people transitioning from other languages, it certainly requires some mental effort to accept JavaScript/TypeScript's flexible design paradigm. Personally, the straightforward `||` and `&&` operators from other languages feel more intuitive (not saying this design is bad—in many ways, it reduces unnecessary code).

# References

- [MDN Documentation - Nullish Coalescing Operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [MDN Documentation - Logical OR (||)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR)
- [MDN Documentation - Logical AND (&&)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)
