# TS基础

## 基础类型

```ts
// 字符串
let str: string = "Domesy"

// 数字
let num: number = 7

// 布尔
let bool: boolean = true

// symbol
let sym: symbol = Symbol();

// bigint
let big: bigint = 10n

// null
let nu: null = null

// undefined
let un: undefined = undefined
```

## 引用类型

### 数组

```ts
let arr1: number[] = [1, 2, 3]

let arr2: Array<number> = [1, 2, 3]

let arr2: Array<number> = [1, 2, '3'] // error

// 要想是数字类型或字符串类型，需要使用 ｜
let arr3: Array<number | string> = [1, 2, '3'] // ok
```

### Tuple(元组)

```ts
let t: [number, string] = [1, '2'] // ok
let t1: [number, string] = [1, 3] // error
let t2: [number, string] = [1] // error
let t3: [number, string] = [1, '1', true] // error

let t5: [number, string] = [1, '2'] // ok
t.push(2)
console.log(t) // [1, '2', 2]

let a = t[0] // ok
let b = t[1] // ok
let c = t[2] // error
```

### object

```ts
let obj1: object = {a: 1, b: 2}
obj1.a = 3 // error

let obj2: { a: number, b: number } = {a: 1, b: 2}
obj2.a = 3 // ok

let obj: Object;
obj = 1; // ok
obj = "a"; // ok
obj = true; // ok
obj = {}; // ok
obj = Symbol() //ok
obj = 10n //ok
obj = null; // error
obj = undefined; // error
```

### function
#### 定义函数

```ts
function setName1(name: string) { // ok
  console.log("hello", name);
}

setName1("Domesy"); // "hello",  "Domesy"

function setName2(name: string): string { // error
  console.log("hello", name);
}

setName2("Domesy");

function setName3(name: string): string { // error
  console.log("hello", name);
  return 1
}

setName3("Domesy");

function setName4(name: string): string { // ok
  console.log("hello", name);
  return name
}

setName4("Domesy"); // "hello",  "Domesy"

// 箭头函数与上述同理
const setName5 = (name: string) => console.log("hello", name);
setName5("Domesy") // "hello",  "Domesy"
```

#### 参数类型

```ts
// 可选参数
const setInfo1 = (name: string, age?: number) => console.log(name, age)
setInfo1('Domesy') // "Domesy",  undefined
setInfo1('Domesy', 7) // "Domesy",  7

// 默认参数
const setInfo2 = (name: string, age: number = 11) => console.log(name, age)
setInfo2('Domesy') // "Domesy",  11
setInfo2('Domesy', 7) // "Domesy",  7

// 剩余参数
const allCount = (...numbers: number[]) => console.log(`数字总和为：${numbers.reduce((val, item) => (val += item), 0)}`)
allCount(1, 2, 3) // "数字总和为：6"
```

#### 函数重载

```ts
let obj: any = {};
function setInfo(val: string): void;
function setInfo(val: number): void;
function setInfo(val: boolean): void;
function setInfo(val: string | number | boolean): void {
  if (typeof val === "string") {
    obj.name = val;
  } else {
    obj.age = val;
  }
}
setInfo("Domesy");
setInfo(7);
setInfo(true);
console.log(obj); // { name: 'Domesy', age: 7 }
```

