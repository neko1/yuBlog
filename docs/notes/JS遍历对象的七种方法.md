# JS遍历对象的七种方法

## 描述

**for…in**

<font color=DeepPink>for…in</font> 可以遍历对象的所有可枚举属性，包括对象本身的和对象继承来的属性

**Object.keys()**

<font color=DeepPink>Object.keys()</font> 方法可以遍历到所有对象本身的可枚举属性，但是其返回值为数组

**Object.values()**

<font color=DeepPink>Object.values()</font> 与 <font color=DeepPink>Object.keys()</font> 遍历对象的特性是相同的，但是其返回的结构是以遍历的属性值构成的数组

**Object.entries()**

<font color=DeepPink>Object.entries()</font> 的返回值为 <font color=DeepPink>Object.values()</font> 与 <font color=DeepPink>Object.keys()</font> 的结合，也就是说它会返回一个嵌套数组，数组内包括了属性名与属性值

**Object.getOwnPropertyNames()**

其返回结果与 <font color=DeepPink>Object.keys()</font> 对应，但是他得特性与其相反，会返回对象得所有属性，包括了不可枚举属性

**Object.getOwnPropertySymbols()**

<font color=DeepPink>Object.getOwnPropertySymbols()</font> 会返回对象内的所有 Symbol 属性，返回形式依旧是数组，值得注意的是，在对象初始化的时候，内部是不会包含任何
Symbol 属性

**Reflect.ownKeys()**

<font color=DeepPink>Reflect.ownKeys()</font> 返回的是一个大杂烩数组，即包含了对象的所有属性，无论是否可枚举还是属性是 Symbol，还是继承，将所有的属性返回

## 根据遍历目标区分

| 遍历目标                               |                            方法                            |
|------------------------------------|:--------------------------------------------------------:|
| 遍历对象本身的可枚举属性不包含继承来的属性（不包括Symbol()） | Object.keys()<br/> Object.values() <br/>Object.entries() |
| 遍历对象本身的可枚举属性包括继承来的属性（不包括Symbol()）  |                          for…in                          |
| 遍历对象本身的所有属性（不包括Symbol()）           |               Object.getOwnPropertyNames()               |
| 遍历对象的Symbol()属性                    |             	Object.getOwnPropertySymbols()              |
| 遍历对象的所有属性                          |                    Reflect.ownKeys()                     |

## 根据返回值区分

| 返回值  |                                                      方法                                                       |
|------|:-------------------------------------------------------------------------------------------------------------:|
| 返回数组 | Object.keys()<br/>Object.values()<br/>Object.entries()<br/>Object.getOwnPropertyNames()<br/>Reflect.ownKeys() |
| 不返回值 |                                                    for…in                                                     |

**根据遍历值区分**

| 遍历值   |                                  方法                                  |
|-------|:--------------------------------------------------------------------:|
| 遍历属性  | Reflect.ownKeys()<br/>Object.getOwnPropertyNames()<br/>Object.keys() |
| 遍历属性值 |          Object.getOwnPropertySymbols()<br/>Object.values()          |
| 遍历全部  |                     for…in<br/>Object.entries()                      |
