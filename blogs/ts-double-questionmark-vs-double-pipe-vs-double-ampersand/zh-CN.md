---
title: JS/TS 中的 ??、|| 和 &&
description: 对于 JS/TS 开发来说，理解双问号（??）、双竖线（||）和双与号（&&）的区别至关重要。
date: 2026-01-18
tags: [TypeScript, JavaScript]
highlight: true
---

# 前言

对于其他语言来说，`||` 和 `&&` 已经是日常开发中非常司空见惯的操作符（不考虑 C++ 这种有操作符重载的怪物语言），它们组合在一起可以形成非常灵活的条件判断。但 JS/TS 不仅为这两个操作符添加了一些额外的用法和语义，还引入了一个新的 `??` 操作符，如果是初学者或从其他语言转过来的开发者，没有仔细阅读文档就上手开发，很容易误解和滥用这些操作符，进而引发一些难以察觉的 bug。

# 简单比较

- `??`（Nullish Coalescing Operator，空值合并操作符）：仅检查 `null` 和 `undefined` 操作数。

- `||`（Logical OR Operator，逻辑或操作符）：返回第一个**真值**，如果没有真值则返回最后一个**假值**操作数。

- `&&`（Logical AND Operator，逻辑与操作符）：返回第一个**假值**，如果没有假值则返回最后一个操作数。

# 详细说明

## 双问号操作符（??）

仅当左侧操作数为 `null` 或 `undefined` （*nullish value*，空值） 时，返回右侧操作数。否则，返回左侧操作数。

它与 `||` 的区别在于，`||` 会将所有假值（如 `0`、`''`、`false` 等）视为需要替换的情况，而 `??` 只关注 `null` 和 `undefined`。有时你可能会将部分假值视为有效值，这时 `??` 就非常有用。

```typescript
const foo1 = null ?? 'bar'; 
console.log(foo1); // 输出: 'bar'

const foo2 = 0 ?? 42; 
console.log(foo2); // 输出: 0

const foo3 = undefined ?? 'bar'; 
console.log(foo3); // 输出: 'bar'

const foo4 = '' ?? 'wow'; 
console.log(foo4); // 输出: ''

const foo5 = false ?? true; 
console.log(foo5); // 输出: false

const foo6 = 12 ?? 34; 
console.log(foo6); // 输出: 12
```

由于经常需要处理其他服务 API 部分字段可能为 `null` （字段存在于结构中但值为 `null`） 或 `undefined` （字段未出现在约定好的数据结构中）的情况，`??` 操作符在实际开发中非常有用。

## 双竖线操作符（||）

它将返回遇到的第一个**真值**操作数。如果所有操作数都是**假值**，则返回最后一个操作数。

```typescript
const foo1 = null || 'bar'; 
console.log(foo1); // 输出: 'bar'

const foo2 = 0 || 42; 
console.log(foo2); // 输出: 42

const foo3 = undefined || 'bar'; 
console.log(foo3); // 输出: 'bar'

const foo4 = '' || 'wow'; 
console.log(foo4); // 输出: 'wow'

const foo5 = false || true; 
console.log(foo5); // 输出: true
```

在实际情况中，`||` 操作符常用于为应用配置项设置默认值，例如：

```typescript
const redisPort = Math.max(parseInt(process.env.REDIS_PORT || '6379', 10), 0) || 6379;
```

## 双与号操作符（&&）

它将返回遇到的第一个**假值**操作数。如果所有操作数都是**真值**，则返回最后一个操作数。

```typescript
const foo1 = 'hello' && 'world'; 
console.log(foo1); // 输出: 'world'

const foo2 = 0 && 'bar'; 
console.log(foo2); // 输出: 0

const foo3 = 'foo' && ''; 
console.log(foo3); // 输出: ''

const foo4 = true && false; 
console.log(foo4); // 输出: false

function executeSomething() {
    console.log('Executed!');
    return 42;
}
const foo5 = 'bar' && executeSomething(); 
console.log(foo5); // 输出: 'Executed!' 然后输出: 42
```

它常用在便捷实现条件执行的场景中，例如：

```typescript
const loginInfo = getLoginInfo(); // 获取登录信息
loginInfo.loggedIn && showDashboard();
```

# 为什么让人（至少我）如此迷惑？

作为一个同时会使用 Java/Go 的开发者，我起初无法理解为什么 JS/TS 的两个逻辑运算符 `||` 和 `&&` 返回的是一个操作数而不是布尔值，尤其额外引入了 `??` 操作符。对于刚刚转行做 Node.js 开发并且需要同时处理部分前端开发的我来说实在是有些费脑子。

虽然从简洁和灵活的角度来说，改造原有的 `||` 和 `&&` 操作符并引入 `??` 操作符确实能让代码更简洁，但对于初学者或转行的人来说确实需要消耗一些脑力来接受 JS/TS 世界的灵活设计。对于我个人而言，还是原汁原味的 `||` 和 `&&` 更符合直觉（没有说这种设计不好的意思，很大程度上它能够减少不必要的代码量）。

# 相关资料

- [MDN 文档 - 空值合并运算符（??）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [MDN 文档 - 逻辑或（||）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_OR)
- [MDN 文档 - 逻辑与（&&）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND)