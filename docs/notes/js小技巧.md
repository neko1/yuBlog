# javascript写法小技巧

## 多条件 if 语句

将多个值放入一个数组中，然后调用该数组的 include 方法。

```js
// bad
if (x === "abc" || x === "def" || x === "ghi" || x === "jkl") {
  // logic
}

// better
if (["abc", "def", "ghi", "jkl"].includes(x)) {
  // logic
}
```

## 简化 if true...else 条件表达式

```js
// bad
let test;
if (x > 100) {
  test = true;
} else {
  test = false;
}

// better
let test = x > 10 ? true : false;
```

## 假值（undefined, null, 0, false, NaN, empty string）检查

当我们创建一个新变量时，有时我们想检查引用的变量是否是一个假值，例如 null 或 undefined 或空字符串。JavaScript 确实为这种检查提供了一个很好的快捷方式——逻辑 OR 运算符 (||)

|| 仅当左侧为空或 NaN 或 null 或 undefined 或 false 时，如果左侧操作数为假，则将返回右侧操作数，逻辑或运算符 ( || ) 将返回右侧的值。 

```js
// bad
if (test1 !== null || test1 !== undefined || test1 !== "") {
  let test2 = test1;
}

// better
let test2 = test1 || "";

// bad
if (test1 === true || test1 !== "" || test1 !== null) {
}

// better
if (test1) {
  // do some
} else {
  // do other
}
```

## null/undefined 检查和默认赋值

```js
let test1 = null;
let test2 = test1 ?? "";

console.log("null check", test2); // 打印: ""

const test = undefined ?? "default";
console.log(test); // 打印: "default"
```

## 获取列表中的最后一项

```js
function lastItem(list) {
  if (Array.isArray(list)) {
    return list.slice(-1)[0];
  }
  if (list instanceof Set) {
    return Array.from(list).slice(-1)[0];
  }
  if (list instanceof Map) {
    return Array.from(list.values()).slice(-1)[0];
  }
}
```

## 比较后返回

```js
// bad
let test;
function checkReturn() {
  if (!(test === undefined)) {
    return test;
  } else {
    return callMe("test");
  }
}

// better
function checkReturn() {
  return test ?? callMe("test");
}
```

## 使用可选的链接运算符 -?

? 也称为链判断运算，它允许开发人员读取深度嵌套在对象链中的属性值，而无需验证每个引用，当引用为空时，表达式停止计算并返回 undefined。

```js
const travelPlans = {
  destination: "DC",
  monday: {
    location: "National Mall",
    budget: 200,
  },
};

// bad    
const res = travelPlans && travelPlans.tuesday && travelPlans.tuesday.location && travelPlans.tuesday.location.href;
console.log(res);  // 打印: undefined

// better    
const res1 = travelPlans?.tuesday?.location?.href;
console.log(res1);  // 打印: undefined
```

## 多个条件的 && 运算符

要仅在变量为真时调用函数，请使用 && 运算符。

```js
let test = true;
// bad
if (test) {
  callMethod();
}

// better
test && callMethod();
```

## 开关简化

我们可以将条件存储在键值对象中，并根据条件调用它们。

```js
// bad
switch (data) {
  case 1:
    test1();
    break;
  case 2:
    test2();
    break;
  case 3:
    test3();
    break;
}

// better
let data = {
  1: test1,
  2: test2,
  3: test3,
};
data[type] && data[type]();
```

## 默认参数值

```js
// bad
function add(test1, test2) {
  if (test1 === undefined)
    test1 = 1;
  if (test2 === undefined)
    test2 = 2;
  return test1 + test2;
}

// better
add = (test1 = 1, test2 = 2) => test1 + test2;
add(); // 打印: 3
```

## 条件查找简化

如果我们想根据不同的类型调用不同的方法，我们可以使用多个 else if 语句或开关，但是还有比这更好的简化技巧吗？其实和之前的switch简化是一样的。

```js
// bad
if (type === "test1") {
  test1();
} else if (type === "test2") {
  test2();
} else if (type === "test3") {
  test3();
} else if (type === "test4") {
  test4();
} else {
  throw new Error("Invalid value " + type);
}

// better
var types = {test1, test2, test3, test4,};
types[type] && types[type]();
```

## 对象属性赋值

```js
let test1 = "a";let test2 = "b";
// bad
let obj = { test1: test1, test2: test2 };

// better
let obj = { test1, test2 };
```

## 解构赋值

```js
// bad
const test1 = this.data.test1;
const test2 = this.data.test2;
const test3 = this.data.test3;

// better
const { test1, test2, test3 } = this.data;
```

## 模板字符串

```js
// bad
const welcome = "Hi " + test1 + " " + test2 + ".";

// better
const welcome = `Hi ${test1} ${test2}`;
```

## 换行字符串

```js
// bad    
const data =
  "hello maxwell this is a test\n\t" + "test test,test test test test\n\t";

// better    
const data = `hello maxwell this is a test                    
                test test,test test test test`;
```

## indexOf的按位化简

在数组中查找某个值时，我们可以使用 indexOf() 方法。但是还有更好的方法

```js
// bad
if (arr.indexOf(item) > -1) {
  // item found
}
if (arr.indexOf(item) === -1) {
  // item not found
}

// better
if (~arr.indexOf(item)) {
  // item found
}
if (!~arr.indexOf(item)) {
  // item not found
}

if (arr.includes(item)) {
  // true if the item found
}
```

## 将字符串转换为数字

```js
// bad
let total = parseInt("583");
let average = parseFloat("32.5");

// better
let total = +"583";
let average = +"32.5";
```

## 按顺序执行 Promise

```js
async function getData() {
  const promises = [fetch("url1"), fetch("url2"), fetch("url3"), fetch("url4")];
  for (const item of promises) {
    // Print out the promise            
    console.log(item);
  }

  // better        
  for await (const item of promises) {
    // Print out the results of the request            
    console.log(item);
  }
}
```

等待所有Promiae完成。

Promise.allSettled() 方法接受一组 Promise 实例作为参数，包装到一个新的 Promise 实例中。在所有这些参数实例都返回结果（已完成或已拒绝）之前，包装器实例不会结束。

有时候，我们并不关心异步请求的结果，我们只关心是否所有请求都结束了。这时候，Promise.allSettled() 方法就非常有用了。

```js
const promises = [fetch("index.html"), fetch("https://does-not-exist/")];

const results = await Promise.allSettled(promises);

// Filter out successful requests
const successfulPromises = results.filter((p) => p.status === "fulfilled");

// Filter out failed requests and output the reason
const errors = results.filter((p) => p.status === "rejected").map((p) => p.reason);
```

## 交换数组元素的位置

```js
// bad
const swapWay = (arr, i, j) => {
  const newArr = [...arr];

  let temp = newArr[i];
  newArr[i] = list[j];
  newArr[j] = temp;

  return newArr;
};

// better
const swapWay = (arr, i, j) => {
  const newArr = [...arr];

  const [newArr[j], newArr[i]] = [newArr[i], newArr[j]];

  return newArr;
};
```

## 带范围的随机数生成器

有时你需要生成随机数，但又希望数字在一定范围内，则可以使用此工具。

```js
function randomNumber(max = 1, min = 0) {
  if (min >= max) {
    return max;
  }
  return Math.floor(Math.random() * (max - min) + min);
}
```

## 生成随机颜色

```js
function getRandomColor() {
  const colorAngle = Math.floor(Math.random() * 360);
  return `rgba(${colorAngle},100%,50%,1)`;
}

const getRandomColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
```

## 颜色格式转换

```js
const hexToRgb = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`).substring(1).match(/.{2}/g).map((x) => parseInt(x, 16));
```

## 生成数组

```js
// 方案1
const createArr = (n) => Array.from(new Array(n), (v, i) => i)

// 方案2
const createArr = (n) => new Array(n).fill(0).map((v, i) => i)
```

## 打乱数组

```js
// 方案1
const randomSort = list => list.sort(() => Math.random() - 0.5)

// 方案2
const shuffle = (nums) => {
  for (let i = 0; i < nums.length; ++i) {
    const j = Math.floor(Math.random() * (nums.length - i)) + i;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
};
```

## 数组简单数据去重

```js
const removeDuplicates = list => [...new Set(list)]
```

## 数组唯一值数据去重

```js
const duplicateById = list => [...list.reduce((prev, cur) => prev.set(cur.id, cur), new Map()).values()]
duplicateById([{id: 1, name: 'jack'}, {id: 2, name: 'rose'}, {id: 1, name: 'jack'}])
// [{id: 1, name: 'jack'}, {id: 2, name: 'rose'}]
```

## 多数组取交集

```js
const intersection = (a, ...arr) => [...new Set(a)].filter((v) => arr.every((b) => b.includes(v)))
intersection([1, 2, 3, 4], [2, 3, 4, 7, 8], [1, 3, 4, 9])
// [3, 4]
```

## 查找最大值/最小值索引

```js
const indexOfMax = (arr) => arr.reduce((prev, curr, i, a) => (curr > a[prev] ? i : prev), 0);

const indexOfMin = (arr) => arr.reduce((prev, curr, i, a) => (curr < a[prev] ? i : prev), 0)
```

## 找到最接近的数值

```js
const closest = (arr, n) => arr.reduce((prev, curr) => (Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev))
```

## 进制转换

```js
// 将10进制转换成n进制，可以使用toString(n)
const toDecimal = (num, n = 10) => num.toString(n)

// 将n进制转换成10进制，可以使用parseInt(num, n)
const toDecimalism = (num, n = 10) => parseInt(num, n)
```
