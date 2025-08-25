# JavaScript学习笔记

JavaScript是一门功能强大的编程语言，本文记录一些重要的学习要点。

## 基础概念

### 变量声明
JavaScript中有三种变量声明方式：

```javascript
var name = "老式声明"; // 函数作用域
let age = 25; // 块作用域
const PI = 3.14159; // 常量，块作用域
```

### 数据类型
JavaScript有以下基本数据类型：

- **String**：字符串类型
- **Number**：数字类型
- **Boolean**：布尔类型
- **undefined**：未定义
- **null**：空值
- **Symbol**：符号（ES6新增）
- **BigInt**：大整数（ES2020新增）

## 函数

### 函数声明
```javascript
// 函数声明
function greet(name) {
    return `Hello, ${name}!`;
}

// 函数表达式
const greet2 = function(name) {
    return `Hi, ${name}!`;
};

// 箭头函数（ES6）
const greet3 = (name) => `Hey, ${name}!`;
```

### 高阶函数
```javascript
const numbers = [1, 2, 3, 4, 5];

// map - 转换数组
const doubled = numbers.map(n => n * 2);

// filter - 筛选数组
const evens = numbers.filter(n => n % 2 === 0);

// reduce - 归约数组
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

## 异步编程

### Promise
```javascript
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("数据获取成功");
        }, 1000);
    });
};

fetchData().then(data => {
    console.log(data);
});
```

### async/await
```javascript
async function getData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error("错误:", error);
    }
}
```

## DOM操作

### 选择元素
```javascript
// 通过ID选择
const element = document.getElementById('myId');

// 通过类名选择
const elements = document.getElementsByClassName('myClass');

// 通过CSS选择器
const element2 = document.querySelector('.my-class');
const elements2 = document.querySelectorAll('.my-class');
```

### 修改元素
```javascript
// 修改内容
element.textContent = "新文本";
element.innerHTML = "<strong>HTML内容</strong>";

// 修改样式
element.style.color = "red";
element.classList.add("new-class");

// 添加事件监听器
element.addEventListener('click', function() {
    console.log("元素被点击了");
});
```

## 现代JavaScript特性

### 解构赋值
```javascript
// 数组解构
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// 对象解构
const {name, age, ...others} = {name: "张三", age: 25, city: "北京"};
```

### 模板字符串
```javascript
const name = "世界";
const greeting = `你好，${name}！`;
```

### 扩展运算符
```javascript
// 数组扩展
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5, 6];

// 对象扩展
const obj1 = {a: 1, b: 2};
const obj2 = {...obj1, c: 3};
```

## 最佳实践

1. **使用const和let**：避免使用var
2. **函数式编程**：优先使用map、filter、reduce等方法
3. **错误处理**：始终处理可能的错误情况
4. **代码简洁**：使用箭头函数和解构赋值简化代码
5. **性能优化**：避免不必要的DOM操作

## 总结

JavaScript是一门不断发展的语言，掌握这些基础概念和现代特性对于开发高质量的Web应用非常重要。持续学习和实践是提高JavaScript技能的关键。

*最后更新：2025年8月*
