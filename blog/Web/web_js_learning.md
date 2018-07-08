---
title: Web | Learning Advanced JavaScript 学习笔记
date: 2017-11-17 21:57:00
tags: ["Web", "JavaScript","学习笔记"]
categories: "Web"
---


https://johnresig.com/apps/learn/ 这个网站上有90+道题，帮助我们理解JavaScript。有空就逐条仔细分析了一下，如理解有误还请指出。

<!--more-->



## Our Goal

### #2: Goal: To be able to understand this function:

```js
// The .bind method from Prototype.js 
Function.prototype.bind = function(){ 
  var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift(); 
  return function(){ 
    return fn.apply(object, 
      args.concat(Array.prototype.slice.call(arguments))); 
  }; 
};
```

以上的代码给Function对象添加了一个方法bind。这个方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。简而言之，就是指定函数调用时上下文的this。

这里涉及到Javascript几个标准库

1. Array.prototype.slice(begin, end) 返回一个从开始到结束（**\*不包括结束***）选择的数组的一部分**浅拷贝**到一个新数组对象。原始数组不会被修改。

2. Array.prototype.slice.call(arguments) 将一个类数组（Array-like）对象/集合转换成一个数组。

   那么什么是 Array-Like Objects？不是数组，但是有 `length` 属性，且属性值为非负 Number 类型即可。函数的参数 arguments 就是 Array-Like Objects 的一种，能像数组一样用 `[]` 去访问 arguments 的元素，有 `length` 属性，但是却不能用一些数组的方法，如 push，pop，等等。还有获取DOM之类的方法返回的 NodeList 和 HTMLCollection也属于类数组。

3. Array.prototype.shift()  从数组中**删除**第一个元素，并返回该元素的值。此方法更改数组的长度。

4. Array.prototype.concat() 用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

5. Function.prototype.apply((thisArg, [argsArray]) 调用一个函数, 其具有一个指定的`this`值，以及作为一个数组（或[类似数组的对])提供的参数

下面是一个简单的例子，更多具体的例子可以上MDN查看（如偏函数）

```js
this.x = 9; 
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 返回 81

var retrieveX = module.getX;
retrieveX(); // 返回 9, 在这种情况下，"this"指向全局作用域

// 创建一个新函数，将"this"绑定到module对象
// 新手可能会被全局的x变量和module里的属性x所迷惑
var boundGetX = retrieveX.bind(module);
boundGetX(); // 返回 81
```

这里面有几点需要注意的地方，比如两个arguments是不同的。下面再举个例子来说明一下

```js
// Usage:
var boundFunc = func.bind(obj, arg1, arg2);
boundFunc(arg3, arg4);

Function.prototype.bind = function() { // f1
var fn = this;  //fn will be initialized to func
var args = Array.prototype.slice.call(arguments); // args will be [obj, arg1, arg2]
var object = args.shift(); // object will be obj, args will be [arg1, arg2]
    return function(){ // f2
      // arguments is array-like [arg3, arg4]
      var allArgs = args.concat(Array.prototype.slice.call(arguments)) // allArgs is [arg1, arg2, arg3, arg4]
      return fn.apply(object, allArgs); // func called with obj as this and arg1, arg2, arg3, arg4 as arguments 
    };
};
```

这里bind是包含在JavaScript的标准库里面的，还要提一下，在某些场景下，可以使用ES6的箭头函数=>代替bind，因为箭头函数是可以绑定固定的this的，下面有个简短的例子

```js
var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
```

上面代码的`init`方法中，使用了箭头函数，这导致这个箭头函数里面的`this`，总是指向`handler`对象。否则，回调函数运行时，`this.doSomething`这一行会报错，因为此时`this`指向`document`对象。

`this`指向的固定化，并不是因为箭头函数内部有绑定`this`的机制，实际原因是箭头函数根本没有自己的`this`，导致内部的`this`就是外层代码块的`this`。正是因为它没有`this`，所以也就不能用作构造函数。

或者用ES7的绑定运算符`::`, 该操作符会将左值和右值(一个函数)进行绑定。

```js
foo::bar
bar.bind(foo)
// 等价的
foo::bar(...arguments)
bar.apply(foo, arguments)
// 等价的
var method = ::obj.foo
var method = obj.foo.bind(obj)
// 等价的
```

参考资料：

 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

https://www.cnblogs.com/zichi/p/5616050.html

https://stackoverflow.com/questions/20091669/magic-of-array-prototype-slice-callx-concatarray-prototype-slice-callx

http://blog.jobbole.com/58032/

https://segmentfault.com/a/1190000004568359

http://blog.csdn.net/wlpxq/article/details/68061717

### #3: Some helper methods that we have:

```js
assert( true, "I'll pass." ); 
assert( "truey", "So will I." ); 
assert( false, "I'll fail." ); 
assert( null, "So will I." ); 
log( "Just a simple log", "of", "values.", true ); 
error( "I'm an error!" );
```

这里介绍了几个console下的函数，调试使用。我最近在重构的Violet里面引入了一个assert库，用于koa的洋葱结构感觉是非常的优雅的，当assert不通过的时候，直接返回400错误给服务端，然后结束这次请求，大大减少了回调什么的，使得代码更加清晰易懂。

---

## Defining Functions

### #5: What ways can we define functions?

```js
function isNimble(){ return true; } 
var canFly = function(){ return true; }; 
window.isDeadly = function(){ return true; }; 
log(isNimble, canFly, isDeadly);
```

这里列举了三种函数定义的方法。挺容易理解的。当然es6里面还有箭头函数，上面已经稍微讲过一下。

### #6: Does the order of function definition matter?

```js
var canFly = function(){ return true; }; 
window.isDeadly = function(){ return true; }; 
assert( isNimble() && canFly() && isDeadly(), "Still works, even though isNimble is moved." ); 
function isNimble(){ return true; }
```

这里告诉我们函数的顺序是没有关系的，因为所有函数都会自动提升到文件的顶端。但是要注意的是变量会自动提升，赋值给变量的匿名函数并不会提升，此时变量还是undefined所以之后最后一行那种定义方法才会提升。

### #7: Where can assignments be accessed?

```js
assert( typeof canFly == "undefined", "canFly doesn't get that benefit." ); 
assert( typeof isDeadly == "undefined", "Nor does isDeadly." ); 
var canFly = function(){ return true; }; 
window.isDeadly = function(){ return true; };
```

这里就是说明了上面那个问题，不多说了。

### #8: Can functions be defined below return statements?

```js
function stealthCheck(){ 
  assert( stealth(), "We'll never get below the return, but that's OK!" ); 
 
  return stealth(); 
 
  function stealth(){ return true; } 
} 
 
stealthCheck();
```

在return后面写的东西是不会运行的，但是这个函数是会自动提升到顶部。但是还是不建议把内容写在return后面。

---

## Named Functions

### #10: We can refer to a function, within itself, by its name.

```js
function yell(n){ 
  return n > 0 ? yell(n-1) + "a" : "hiy"; 
} 
assert( yell(4) == "hiyaaaa", "Calling the function by itself comes naturally." );
```

递归调用。

```js
let yell = function(n) {
  return n > 0 ? yell(n - 1) + "a" : "hiy";
}
// 这种方法也是可行的
```

### #11: What is the name of a function?

```js
var ninja = function myNinja(){ 
  assert( ninja == myNinja, "This function is named two things - at once!" ); 
}; 
ninja(); 
assert( typeof myNinja == "undefined", "But myNinja isn't defined outside of the function." ); 
log( ninja );
```

这里的ninja与myNinja在函数内部就是指同一个东西。但是ninja作用域是当前函数作用域(可以说是整个windows下)，而myNinja这个名字的作用域只是在myNinja这个函数里的作用域。

```js
var a = function abc() {} // 外部可访问到a，不能访问abc
function abc() {} // 外部可访问abc
// 个人认为以上一句是相当于
var abc = function abc() {}
// 默认把函数复制给同名变量
```



### #12: We can even do it if we're an anonymous function that's an object property.

```js
var ninja = { 
  yell: function(n){ 
    return n > 0 ? ninja.yell(n-1) + "a" : "hiy"; 
  } 
}; 
assert( ninja.yell(4) == "hiyaaaa", "A single object isn't too bad, either." );
```

这是在另一个情境下的递归调用，由于这个函数是一个匿名函数，所以只能通过对象来调用

### #13: But what happens when we remove the original object?

```js
var ninja = { 
  yell: function(n){ 
    return n > 0 ? ninja.yell(n-1) + "a" : "hiy"; 
  } 
}; 
assert( ninja.yell(4) == "hiyaaaa", "A single object isn't too bad, either." ); 
 
var samurai = { yell: ninja.yell }; 
var ninja = null; //移除原对象
// ninja = null;
// ninja.yell = null;
// 都是一样的效果
 
try { 
  samurai.yell(4); 
} catch(e){ 
  assert( false, "Uh, this isn't good! Where'd ninja.yell go?" ); 
}
```

因为yell是一个匿名函数，并没有进行声明，只有在调用的时候被执行，这里的samurai只是单纯地引用了对象ninja里面的yell方法，如果原来的对象或方法消失了，那么samurai下的yell也失去了作用。



### #14: Let's give the anonymous function a name!

```js
var ninja = { 
  yell: function yell(n){ 
    return n > 0 ? yell(n-1) + "a" : "hiy"; 
  } 
}; 
assert( ninja.yell(4) == "hiyaaaa", "Works as we would expect it to!" ); 
 
var samurai = { yell: ninja.yell }; 
var ninja = {}; 
assert( samurai.yell(4) == "hiyaaaa", "The method correctly calls itself." );
```

这里的yell是一个具名函数，,在属性被创建并赋值时，便声明了以属性键名为名的函数。对于samurai的yell的赋值是直接把函数赋值给了他，所以当源对象被删除之后，那个函数依然存在。



### #15: What if we don't want to give the function a name?

```js
var ninja = { 
  yell: function(n){ 
    return n > 0 ? arguments.callee(n-1) + "a" : "hiy"; 
  } 
}; 
assert( ninja.yell(4) == "hiyaaaa", "arguments.callee is the function itself." );
```

这里通过arguments.callee调用自身来完成匿名函数的递归，但是 arguments.callee已经从 从ES5严格模式中删除了，因为他使得在通常的情况不可能实现内联和尾递归。另外一个主要原因是递归调用会获取到一个不同的 `this` 值，。所以不建议用这种方法，因为我们可以使用具名函数来完成相同的功能。

参考资料：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/callee

---

## Functions as Objects

### #17: How similar are functions and objects?

```js
var obj = {}; 
var fn = function(){}; 
assert( obj && fn, "Both the object and function exist." );
```

空对象和空函数都是存在的。

### #18: How similar are functions and objects?

```js
var obj = {}; 
var fn = function(){}; 
obj.prop = "some value"; 
fn.prop = "some value"; 
assert( obj.prop == fn.prop, "Both are objects, both have the property." );
```

JavaScript 只有一种结构：对象。函数的本质就是对象，都存在各自的属性。



### #19: Is it possible to cache the return results from a function?

```js
function getElements( name ) { 
  var results; 
 
  if ( getElements.cache[name] ) { 
    results = getElements.cache[name]; 
  } else { 
    results = document.getElementsByTagName(name); 
    getElements.cache[name] = results; 
  } 
 
  return results; 
} 
getElements.cache = {}; 
 
log( "Elements found: ", getElements("pre").length ); 
log( "Cache found: ", getElements.cache.pre.length );
```

这里要说的大概是函数是一个对象，因此可以具有各种属性，那么就自然可以把数据保存在自身的属性里面，这里面的cache就是这个函数的其中一个属性。函数把运行结果存储在getElements.cache.pre里面。展示了函数作为对象的优势。



### #20: QUIZ: Can you cache the results of this function?

```js
function isPrime( num ) { 
  var prime = num != 1; // Everything but 1 can be prime 
  for ( var i = 2; i < num; i++ ) { 
    if ( num % i == 0 ) { 
      prime = false; 
      break; 
    } 
  } 
  return prime; 
} 
 
assert( isPrime(5), "Make sure the function works, 5 is prime." ); 
assert( isPrime.cache[5], "Is the answer cached?" );
```

这是一道问题，仿照上一题就很容易做出来

```js
function isPrime(num) {
  if (isPrime.cache[num]) {
    return isPrime.cache[num];
  } else {
    var prime = num != 1; // Everything but 1 can be prime
    for (var i = 2; i < num; i++) {
      if (num % i == 0) {
        prime = false;
        break;
      }
    }
    isPrime.cache[num] = prime;
    return prime;
  }
}
isPrime.cache = {}; // 要初始化cache，否则访问其子元素会报错
assert(isPrime(5), "Make sure the function works, 5 is prime.");
assert(isPrime.cache[5], "Is the answer cached?");
```



### #21: One possible way to cache the results:

```js
function isPrime( num ) { 
  if ( isPrime.cache[ num ] != null ) 
    return isPrime.cache[ num ]; 
   
  var prime = num != 1; // Everything but 1 can be prime 
  for ( var i = 2; i < num; i++ ) { 
    if ( num % i == 0 ) { 
      prime = false; 
      break; 
    } 
  } 
  
  isPrime.cache[ num ] = prime 
  
  return prime; 
} 
 
isPrime.cache = {}; 
 
assert( isPrime(5), "Make sure the function works, 5 is prime." ); 
assert( isPrime.cache[5], "Make sure the answer is cached." );
```

他自己给出来了一种方法，和我的也差不多。



---

## Context

### #23: What happens if a function is an object property?

```js
var katana = { 
  isSharp: true, 
  use: function(){ 
    this.isSharp = !this.isSharp; 
  } 
}; 
katana.use(); 
assert( !katana.isSharp, "Verify the value of isSharp has been changed." );
```

当一个匿名函数作为一个对象的属性的时候，那么this就是指这个对象，函数可以访问并修改对象的属性



### #24: What exactly does context represent?

```js
function katana(){ 
  this.isSharp = true; 
} 
katana(); 
assert( isSharp === true, "A global object now exists with that name and value." ); 
 
var shuriken = { 
  toss: function(){ 
    this.isSharp = true; 
  } 
}; 
shuriken.toss(); 
assert( shuriken.isSharp === true, "When it's an object property, the value is set within the object." );
```

这里想要说的大概是this下绑定的变量是绑定在上一级函数作用域下的。如果是处于Global的函数，那么他的this绑定的就是全局变量。

### #25: How can we change the context of a function?

```js
var object = {}; 
function fn(){ 
  return this; 
} 
assert( fn() == this, "The context is the global object." ); 
assert( fn.call(object) == object, "The context is changed to a specific object." );
```

Function.prototype.call() 这个方法调用一个函数, 其具有一个指定的`this`值和分别地提供的参数(**参数的列表**)。

我们可以通过call这个方法来改变一个函数的context

### #26: Different ways of changing the context:

```js
function add(a, b){ 
  return a + b; 
} 
assert( add.call(this, 1, 2) == 3, ".call() takes individual arguments" ); 
assert( add.apply(this, [1, 2]) == 3, ".apply() takes an array of arguments" );
```

Function.prototype.apply() 方法调用一个函数, 其具有一个指定的`this`值，以及作为一个数组（或[类似数组的对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)）提供的参数。

call 和 apply 都是用于改变函数的context的，但是他们有一点区别。

### #27: QUIZ: How can we implement looping with a callback?

```js
function loop(array, fn){ 
  for ( var i = 0; i < array.length; i++ ) { 
    // Implement me! 
  } 
} 
var num = 0; 
loop([0, 1, 2], function(value){ 
  assert(value == num++, "Make sure the contents are as we expect it."); 
  assert(this instanceof Array, "The context should be the full array."); 
});
```

这是一道题目，要求用回调函数解决循环。而且函数内的context需要是数组，因此填入

`fn.call(array, array[i]);` 

就可以了。

### #28: A possible solution for function looping:

```js
function loop(array, fn){ 
  for ( var i = 0; i < array.length; i++ ) 
    fn.call( array, array[i], i ); 
} 
var num = 0; 
loop([0, 1, 2], function(value, i){ 
  assert(value == num++, "Make sure the contents are as we expect it."); 
  assert(this instanceof Array, "The context should be the full array."); 
});
```

这题提供了一个解答， 和上面有点不同的是回调函数多了一个参数。感觉这个有点水水的。



---

## Instantiation

### #30: What does the new operator do?

```js
function Ninja(){ 
  this.name = "Ninja"; 
} 
 
var ninjaA = Ninja(); 
assert( !ninjaA, "Is undefined, not an instance of Ninja." ); 
 
var ninjaB = new Ninja(); 
assert( ninjaB.name == "Ninja", "Property exists on the ninja instance." );
```

这里讲了实例化的用法。第一种用法是错误的，因为这个函数并没有返回任何的东西，所以是undefined的。第二种通过new 来实例化对象，使得name这个变量被绑定到ninjaB这个context里面。

**new **运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。【参考资料一】

这这个过程里面，new到底做了些什么？

1. 一个新对象被创建，这个对象继承于Ninja.prototype。
2. 构造函数Ninja()被执行，如果有参数的话，参数就会被传进去。同时上下文(this)会被指定为这个新的实例。
3. 如果构造函数返回了一个对象（这里并没有），那么这个对象就会取代new出来的结果，如果没有返回，那么new出来的结果就是第一步所创建的对象。

顺便说一下，一个对象被实例化之后，我们仍然可以通过修改Ninja.prototype给所有之前定义的实例来添加属性。如果之前的实例已经拥有这个属性了，那么将无法覆盖。产生这种结果是因为JavaScript基于原型的继承设计【参考资料二】。

参考资料: 

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

### #31: We have a 'this' context that is a Ninja object.

```js
function Ninja(){ 
  this.swung = false; 
   
  // Should return true 
  this.swingSword = function(){ 
    this.swung = !this.swung; 
    return this.swung; 
  }; 
} 
 
var ninja = new Ninja(); 
assert( ninja.swingSword(), "Calling the instance method." ); 
assert( ninja.swung, "The ninja has swung the sword." ); 
 
var ninjaB = new Ninja(); 
assert( !ninjaB.swung, "Make sure that the ninja has not swung his sword." );
```

这里实例化了两个对象，他们的swung属性是分开，互不影响的。

### #32: QUIZ: Add a method that gives a name to the ninja.

```js
function Ninja(name){ 
  // Implement! 
} 
 
var ninja = new Ninja("John"); 
assert( ninja.name == "John", "The name has been set on initialization" ); 
 
ninja.changeName("Bob"); 
assert( ninja.name == "Bob", "The name was successfully changed." );
```

这里要求我们为这个东西（类？）添加一个方法。稍微补充点东西就可以了。

```js
function Ninja(name){
  this.name = name;
  this.changeName = function(n){
    this.name = n;
  }
}

var ninja = new Ninja("John");
assert( ninja.name == "John", "The name has been set on initialization" );

ninja.changeName("Bob");
assert( ninja.name == "Bob", "The name was successfully changed." );
```

### #33: Add a new property and method to the object.

```js
function Ninja(name){ 
  this.changeName = function(name){ 
    this.name = name; 
  }; 
 
  this.changeName( name ); 
} 
 
var ninja = new Ninja("John"); 
assert( ninja.name == "John", "The name has been set on initialization" ); 
 
ninja.changeName("Bob"); 
assert( ninja.name == "Bob", "The name was successfully changed." );
```

他的做法和我的差不多，就是复用了函数，这个比较好。

### #34: What happens when we forget to use the new operator?

```js
function User(first, last){ 
  this.name = first + " " + last; 
} 
 
var user = User("John", "Resig"); 
assert( typeof user == "undefined", "Since new wasn't used, the instance is undefined." );
```

当我们没有使用new的时候，this没办法指定在返回的对象里面，而是函数所在的作用域。具体原因可以看上面。

### #35: What happens when we forget to use the new operator? (cont.)

```js
function User(first, last){
  this.name = first + " " + last;
}

window.name = "Resig";
var user = User("John", name);

assert( name == "John Resig", "The name variable is accidentally overridden." );
```

上面提到User的作用域是在他所在的函数作用域里面，也就是全局下（window）。所以这一句话就是调用了这个函数，然后把全局下name的属性修改了。

### #36: We need to make sure that the new operator is always used.

```js
function User(first, last){ 
  if ( !(this instanceof User) ) // 判断当前上下文是否在User中
    return new User(first, last); 
   
  this.name = first + " " + last; 
} 
 
var name = "Resig"; 
var user = User("John", name); 
 
assert( user, "This was defined correctly, even if it was by mistake." ); 
assert( name == "Resig", "The right name was maintained." );
```

这里使用一种技巧，使得你就是忘记new了也会帮你new。就是通过判断当前的context，来确保是出于User下（使用了new），如果不在的话那么就new一下。挺有趣的。但是规范的代码还是不应该缺少new。感觉在这种情况下需要抛出错误。

### #37: QUIZ: Is there another, more generic, way of doing this?

```js
function User(first, last){ 
  if ( !(this instanceof ___) ) 
    return new User(first, last); 
   
  this.name = first + " " + last; 
} 
 
var name = "Resig"; 
var user = User("John", name); 
 
assert( user, "This was defined correctly, even if it was by mistake." ); 
assert( name == "Resig", "The right name was maintained." );
```

这里要求我们使用更加通用的方法来实现上面的功能，而不是用过函数名。那么思路大概就是获取当前函数的语境所在。

### #38: A solution using arguments.callee.

```js
function User(first, last){ 
  if ( !(this instanceof arguments.callee) ) 
    return new User(first, last); 
   
  this.name = first + " " + last; 
} 
 
var name = "Resig"; 
var user = User("John", name); 
 
assert( user, "This was defined correctly, even if it was by mistake." ); 
assert( name == "Resig", "The right name was maintained." );
```

先来看看他是怎么解决的。

**callee** 是 `arguments` 对象的一个属性。它可以用于引用该函数的函数体内当前正在执行的函数。这在函数的名称是未知时很有用，例如在没有名称的函数表达式 (也称为“匿名函数”)内。

但是在严格模式下，ES5是禁止使用arguments.callee的。至于为什么可以查看上一篇博客，在#15中提到过。

---

## Flexible Arguments

### #40: Using a variable number of arguments to our advantage.

```js
function merge(root){ 
  for ( var i = 1; i < arguments.length; i++ ) 
    for ( var key in arguments[i] ) 
      root[key] = arguments[i][key]; 
  return root; 
} 
 
var merged = merge({name: "John"}, {city: "Boston"}); 
assert( merged.name == "John", "The original name is intact." ); 
assert( merged.city == "Boston", "And the city has been copied over." );
```

这里展示了JavaScript中函数arguments的用法，因为在JavaScript中，函数的参数都是不定长，可变灵活的。因此，我们可以利用这个特点。

这里出现了一个for...in的结构，这是ES5中一个标准。还有一个for...of 是ES6的新标准，后者弥补了前者的不足。

简而言之，就是

 `for...in`循环出的是key，`for...of`循环出的是value

### #41: How can we find the Min/Max number in an array?

```js
function smallest(array){ 
  return Math.min.apply( Math, array ); 
} 
function largest(array){ 
  return Math.max.apply( Math, array ); 
} 
assert(smallest([0, 1, 2, 3]) == 0, "Locate the smallest value."); 
assert(largest([0, 1, 2, 3]) == 3, "Locate the largest value.");
```

Math.min(x,y,...)是不接受数组参数的，这里看上去是把参数通过apply传进去，因为apply可以接受数组或者是类数组作为参数，而call只能接受参数列表。

但是我没有看出来把this指定成Math有什么效果，我试着把他改成null结构也是一样的，或许有什么神奇的东西我不知道?

### #42: Another possible solution:

```js
function smallest(){ 
  return Math.min.apply( Math, arguments ); 
} 
function largest(){ 
  return Math.max.apply( Math, arguments ); 
} 
assert(smallest(0, 1, 2, 3) == 0, "Locate the smallest value."); 
assert(largest(0, 1, 2, 3) == 3, "Locate the largest value.");
```

这个原理和上面也是一样的，通过传入一个类数组进去，但是这种情况下为什么还要这么做呢。直接 var largest = Math.max;` 岂不是更简单。

### #43: Uh oh, what's going wrong here?

```js
function highest(){ 
  return arguments.sort(function(a,b){ 
    return b - a; 
  }); 
} 
assert(highest(1, 1, 2, 3)[0] == 3, "Get the highest value."); 
assert(highest(3, 1, 2, 3, 4, 5)[1] == 4, "Verify the results.");
```

明显这段代码是不能运行的，因为arguments并不是一个真正的数组，只是一个类数组。什么是类数组上一篇博客的#1就已经提到了。因此，我们要把他转化为数组，这里我用了ES6中Array.from()的方法完美解决。

```js
function highest(){
  return Array.from(arguments).sort(function(a,b){
    return b - a;
  });
}
assert(highest(1, 1, 2, 3)[0] == 3, "Get the highest value.");
assert(highest(3, 1, 2, 3, 4, 5)[1] == 4, "Verify the results.");
```

`Array.from()` 方法从一个类似数组或可迭代的对象中创建一个新的数组实例。第二个参数指定map函数，第三个参数指定context。

### #44: QUIZ: We must convert array-like objects into actual arrays. Can any built-in methods help?

```js
// Hint: Arrays have .slice and .splice methods which return new arrays. 
function highest(){ 
  return makeArray(arguments).slice(1).sort(function(a,b){ 
    return b - a; 
  }); 
} 
 
function makeArray(array){ 
  // Implement me! 
} 
 
// Expecting: [3,2,1] 
assert(highest(1, 1, 2, 3)[0] == 3, "Get the highest value."); 
// Expecting: [5,4,3,2,1] 
assert(highest(3, 1, 2, 3, 4, 5)[1] == 4, "Verify the results.");
```

貌似我的进展有点快，上一个已经解决了他这个问题了，填个`return  Array.from(array);`完美解决

### #45: We can use built-in methods to our advantage.

```js
function highest(){ 
  return makeArray(arguments).sort(function(a,b){ 
    return b - a; 
  }); 
} 
 
function makeArray(array){ 
  return Array().slice.call( array ); 
} 
 
assert(highest(1, 1, 2, 3)[0] == 3, "Get the highest value."); 
assert(highest(3, 1, 2, 3, 4, 5)[1] == 4, "Verify the results.");
```

他这里用的是Array.prototype.slice.call() 的方法，这个我在上一篇博客的#1已经提到过了，就不多说了。ES6中的Array.from()比他强大多了。

### #46: QUIZ: Implement a multiplication function (first argument by largest number).

```js
function multiMax(multi){ 
  // Make an array of all but the first argument 
  var allButFirst = ___; 
 
  // Find the largest number in that array of arguments 
  var largestAllButFirst = ___; 
 
  // Return the multiplied result 
  return multi * largestAllButFirst; 
} 
assert( multiMax(3, 1, 2, 3) == 9, "3*3=9 (First arg, by largest.)" );
```

这里考察我们对于可变参数的应用，如果熟悉Array的库的话就挺简单的，有很多种方法。

```js
function multiMax(multi){
  // Make an array of all but the first argument
  var allButFirst = Array.from(arguments).slice(1);

  // Find the largest number in that array of arguments
  var largestAllButFirst = allButFirst.sort().pop();
  
  // Return the multiplied result
  return multi * largestAllButFirst;
}
assert( multiMax(3, 1, 2, 3) == 9, "3*3=9 (First arg, by largest.)" );
```

### #47: We can use call and apply to build a solution.

```js
function multiMax(multi){ 
  // Make an array of all but the first argument 
  var allButFirst = Array().slice.call( arguments, 1 ); 
 
  // Find the largest number in that array of arguments 
  var largestAllButFirst = Math.max.apply( Math, allButFirst ); 
 
  // Return the multiplied result 
  return multi * largestAllButFirst; 
} 
assert( multiMax(3, 1, 2, 3) == 9, "3*3=9 (First arg, by largest.)" );
```

这是他提供的答案，虽然都是一样的结果，但是这个明显就更好一点，我一时没有想到用max，看来还是太菜了。

---

## Closures

### #49: A basic closure.

```js
var num = 10; 
 
function addNum(myNum){ 
  return num + myNum; 
} 
 
assert( addNum(5) == 15, "Add two numbers together, one from a closure." );
```

这里说到JavaScript里面闭包的最简单的一种用法，把一个变量固定再函数里面。

### #50: But why doesn't this work?

```js
var num = 10; 
 
function addNum(myNum){ 
  return num + myNum; 
} 
 
num = 15; 
 
assert( addNum(5) == 15, "Add two numbers together, one from a closure." );
```

如果把变量改了，那么里面的变量也会跟着改变。

### #51: Closures are frequently used for callbacks.

```js
var results = jQuery("#results").html("<li>Loading...</li>"); 
 
jQuery.get("test.html", function(html){ 
  results.html( html ); 
  assert( results, "The element to append to, via a closure." ); 
});
```

闭包也经常用在回调函数里面，也是常规操作，并没有什么特别的。

### #52: They're also useful for timers.

```js
var count = 0; 
 
var timer = setInterval(function(){ 
  if ( count < 5 ) { 
    log( "Timer call: ", count ); 
    count++; 
  } else { 
    assert( count == 5, "Count came via a closure, accessed each step." ); 
    assert( timer, "The timer reference is also via a closure." ); 
    clearInterval( timer ); 
  } 
}, 100);
```

闭包在计时器里面也很有用，但是通常我们会把闭包用在一个函数里面，防止全局变量的污染。

### #53: and they're also frequently used when attaching event listeners.

```js
var count = 1; 
var elem = document.createElement("li"); 
elem.innerHTML = "Click me!"; 
elem.onclick = function(){ 
  log( "Click #", count++ ); 
}; 
document.getElementById("results").appendChild( elem ); 
assert( elem.parentNode, "Clickable element appended." );
```

这里把闭包用在了Click事件上。一般我们用的话会配合for使用，如果需要每个组件都要自己单独的状态，那么就要注意闭包变量的作用域。通常的做法就是放在一个函数作用域里面并且**立即运行**。就像之前的Web中打地鼠和拼图作业也可能会用到这个。（但也不一定用

### #54: Private properties, using closures.

```js
function Ninja(){ 
  var slices = 0; 
   
  this.getSlices = function(){ 
    return slices; 
  }; 
  this.slice = function(){ 
    slices++; 
  }; 
} 
 
var ninja = new Ninja(); 
ninja.slice(); 
assert( ninja.getSlices() == 1, "We're able to access the internal slice data." ); 
assert( ninja.slices === undefined, "And the private data is inaccessible to us." );
```

闭包一般使用的是私有属性，从外部并不能访问，只能通过自己暴露出来的方法改变。这个就和C里面的类的私有变量比较类似。如果需要一个可以外部访问的变量，只要加上this就好，但是如果只是只读的话建议还是用函数来返回。

### #55: QUIZ: What are the values of the variables?

```js
var a = 5;
function runMe(a){
 assert( a == ___, "Check the value of a." ); // 这时传入的变量明显在作用链上比全局变量先找到，因此是6

 function innerRun(){
   assert( b == ___, "Check the value of b." );//在调用这个函数的时候，b已经等于7了
   assert( c == ___, "Check the value of c." );//在调用函数之前，c并没有定义，由于变量提升但赋值不提升，因此为undefined
 }

 var b = 7;
 innerRun();
 var c = 8;
}
runMe(6);

for ( var d = 0; d < 3; d++ ) {
 setTimeout(function(){
   assert( d == ___, "Check the value of d." ); // 当函数被调用的时候，d已经是等于3了，因此3次调用都是为3
 }, 100);
}
```

这里有一个问题，刚好解释了闭包中变量的作用域范围。具体解释可以看上面的注释。

### #56: The last one is quite tricky, we'll revisit it.

```js
var a = 5; 
function runMe(a){ 
 assert( a == 6, "Check the value of a." ); 
 
 function innerRun(){ 
   assert( b == 7, "Check the value of b." ); 
   assert( c == undefined, "Check the value of c." ); 
 } 
 
 var b = 7; 
 innerRun(); 
 var c = 8; 
} 
runMe(6); 
 
for ( var d = 0; d < 3; d++ ) { 
 setTimeout(function(){ 
   assert( d == 3, "Check the value of d." ); 
 }, 100); 
}
```

这个是他提供的答案，上面已经逐一解释过了。

---

## Temporary Scope

### #58: Self-executing, temporary, function

```js
(function(){ 
  var count = 0; 
 
  var timer = setInterval(function(){ 
    if ( count < 5 ) { 
      log( "Timer call: ", count ); 
      count++; 
    } else { 
      assert( count == 5, "Count came via a closure, accessed each step." ); 
      assert( timer, "The timer reference is also via a closure." ); 
      clearInterval( timer ); 
    } 
  }, 100); 
})(); 
 
assert( typeof count == "undefined", "count doesn't exist outside the wrapper" ); 
assert( typeof timer == "undefined", "neither does timer" );
```

这里涉及到变量的作用域范围，由于var定义的变量是在当前函数作用域是有效的（ES6中的let是块级作用域）因此离开了这个函数，外部就无法访问了。

### #59: Now we can handle closures and looping.

```js
for ( var d = 0; d < 3; d++ ) (function(d){ 
 setTimeout(function(){ 
   log( "Value of d: ", d ); 
   assert( d == d, "Check the value of d." ); 
 }, d * 200); 
})(d);
```

这个和上面的#55形成了一个对比，这个通过函数闭包将d的作用域限定在里面，因此这里有三个函数，每个函数中的d都是不同的，通过参数传进去的。因此在各自的函数定义域中各不影响，输出了1、2、3

### #60: The anonymous wrapper functions are also useful for wrapping libraries.

```js
(function(){ 
  var myLib = window.myLib = function(){ 
    // Initialize 
  }; 
 
  // ... 
})();
```

这是一个封装库的方法，就是通过匿名包装器函数。只把接口暴露出去，其他的变量都保留在里面。

### #61: Another way to wrap a library:

```js
var myLib = (function(){ 
  function myLib(){ 
    // Initialize 
  } 
 
  // ... 
   
  return myLib; 
})();
```

这里通过return封装库，和上面的功能也是一样的。并没有上面特别的操作。

### #62: QUIZ: Fix the broken closures in this loop!

```js
var count = 0; 
for ( var i = 0; i < 4; i++ ) { 
  setTimeout(function(){ 
    assert( i == count++, "Check the value of i." ); 
  }, i * 200); 
}
```

他提出了一个问题，如何用闭包解决这个问题，也很容易解决，只要把i定义分别在不同函数作用域里面就好，下面是我的解决方法。直接把i作为参数传入进去，由于setTimeout的运行方式，会提前把参数传了进去，形成了闭包。

```js
var count = 0;
for ( var i = 0; i < 4; i++ ) {
  setTimeout(function(i){
    assert( i == count++, "Check the value of i." );
  }, i * 200, i);
}
```

### #63: A quick wrapper function will do the trick.

```js
var count = 0; 
for ( var i = 0; i < 4; i++ ) (function(i){ 
  setTimeout(function(){ 
    assert( i == count++, "Check the value of i." ); 
  }, i * 200); 
})(i);
```

他的解决方案是在setTimeout外面用一个立刻执行的函数，这种方法也是可行的。

---

## Function Prototypes

### #65: Adding a prototyped method to a function.

```js
function Ninja(){} 
 
Ninja.prototype.swingSword = function(){ 
  return true; 
}; 
 
var ninjaA = Ninja(); 
assert( !ninjaA, "Is undefined, not an instance of Ninja." ); 
 
var ninjaB = new Ninja(); 
assert( ninjaB.swingSword(), "Method exists and is callable." );
```

这里首先定义了一个Ninja的函数，然后通过prototype向这个对象添加了一个方法。

然后第一次不使用new直接赋值，由于函数并没有返回任何东西，因此ninjaA自然是未定义的undefined，下面用了new返回了一个对象，具体的原因可以看上一篇博客中关于new的运行方式的解释。

### #66: Properties added in the constructor (or later) override prototyped properties.

```js
function Ninja(){ 
  this.swingSword = function(){ 
    return true; 
  }; 
} 
 
// Should return false, but will be overridden 
Ninja.prototype.swingSword = function(){ 
  return false; 
}; 
 
var ninja = new Ninja(); 
assert( ninja.swingSword(), "Calling the instance method, not the prototype method." );
```

这里看上去有点玄学，为什么明明重写了但是还是return true呢。其实这只是一个错觉。实际上是里面的重写了外面的属性。

让我们来分析一下他的过程。

首先，定义了一个叫做Ninja的构造函数。在这个构造函数里面为自己添加了一个swingSword的方法。但是注意，这个构造函数并没有被执行。

然后，为Ninja这个对象添加了一个swingSword的方法，这是这个方法第一次被添加到这个对象里面，return的是false

再接着，用new来实例化。根据new的运行过程，此时上面定义的构造函数才被调用，重写了swingSword这个方法，这时候，return的自然就是true了。

这样一看，是不是清晰明了了。

### #67: Prototyped properties affect all objects of the same constructor, simultaneously, even if they already exist.

```js
function Ninja(){ 
  this.swung = true; 
} 
 
var ninjaA = new Ninja(); 
var ninjaB = new Ninja(); 
 
Ninja.prototype.swingSword = function(){ 
  return this.swung; 
}; 
 
assert( ninjaA.swingSword(), "Method exists, even out of order." ); 
assert( ninjaB.swingSword(), "and on all instantiated objects." );
```

这个标题有点长。所表达的意思也很简单，就是通过prototype添加的属性，是会被添加到所有已经实例化的对象里面的。由于原型链继承的设计，他们是可以顺着原型链找到这个方法的。这个也是很好理解的。

### #68: QUIZ: Make a chainable Ninja method.

```js
function Ninja(){ 
  this.swung = true; 
} 
 
var ninjaA = new Ninja(); 
var ninjaB = new Ninja(); 
 
// Add a method to the Ninja prototype which 
// returns itself and modifies swung 
 
assert( !ninjaA.swing().swung, "Verify that the swing method exists and returns an instance." ); 
assert( !ninjaB.swing().swung, "and that it works on all Ninja instances." );
```

注释里面提示添加一个方法给Ninja，返回自身并且修改swung，这就非常地简单了。

```js
Ninja.prototype.swing = function(){
  this.swung = false;
  return this;
}
```

一下就搞定了。

### #69: The chainable method must return this.

```js
function Ninja(){ 
  this.swung = true; 
} 
 
var ninjaA = new Ninja(); 
var ninjaB = new Ninja(); 
 
Ninja.prototype.swing = function(){ 
  this.swung = false; 
  return this; 
}; 
 
assert( !ninjaA.swing().swung, "Verify that the swing method exists and returns an instance." ); 
assert( !ninjaB.swing().swung, "and that it works on all Ninja instances." );
```

看上去和我的方法是一模一样的的（逃

---

## Instance Type

### #71: Examining the basics of an object.

```js
function Ninja(){} 
 
var ninja = new Ninja(); 
 
assert( typeof ninja == "object", "However the type of the instance is still an object." );   
assert( ninja instanceof Ninja, "The object was instantiated properly." ); 
assert( ninja.constructor == Ninja, "The ninja object was created by the Ninja function." );
```

这里说了几个对象的基本知识。理解一下就好。

`instanceof` **运算符**用来测试一个对象在其原型链中是否存在一个构造函数的 `prototype` 属性。

### #72: We can still use the constructor to build other instances.

```js
function Ninja(){} 
var ninja = new Ninja(); 
var ninjaB = new ninja.constructor(); 
 
assert( ninjaB instanceof Ninja, "Still a ninja object." );
```

很明显，这个同一个东西。上面的#71也提到 ninja.constructor == Ninja 指向的是同一个东西。

### #73: QUIZ: Make another instance of a Ninja.

```js
var ninja = (function(){ 
 function Ninja(){} 
 return new Ninja(); 
})(); 
 
// Make another instance of Ninja 
var ninjaB = ___; 
 
assert( ninja.constructor == ninjaB.constructor, "The ninjas come from the same source." );
```

这里考察的还是那个点，填入` var ninjaB = new ninja.constructor();` 就可以了。

### #74: QUIZ: Use the .constructor property to dig in.

```js
var ninja = (function(){ 
 function Ninja(){} 
 return new Ninja(); 
})(); 
 
// Make another instance of Ninja 
var ninjaB = new ninja.constructor(); 
 
assert( ninja.constructor == ninjaB.constructor, "The ninjas come from the same source." );
```

看，一模一样的的（这几题貌似特别地水，跳过跳过。。

---

## Inheritance

### #76: The basics of how prototypal inheritance works.

```js
function Person(){} 
Person.prototype.dance = function(){}; 
 
function Ninja(){} 
 
// Achieve similar, but non-inheritable, results 
Ninja.prototype = Person.prototype; // Ninja继承于Person
Ninja.prototype = { dance: Person.prototype.dance };  // 这破坏了继承链，如果去掉那么下面就可以通过
 
assert( (new Ninja()) instanceof Person, "Will fail with bad prototype chain." ); 
 
// Only this maintains the prototype chain 
Ninja.prototype = new Person();// 这个和上面第一种继承方法是一样的。
 
var ninja = new Ninja(); 
assert( ninja instanceof Ninja, "ninja receives functionality from the Ninja prototype" ); 
assert( ninja instanceof Person, "... and the Person prototype" ); 
assert( ninja instanceof Object, "... and the Object prototype" );// 他们都是继承于Object的
```

这里展示了基于原型的继承。具体的细节再注释中标明了。

### #77: QUIZ: Let's try our hand at inheritance.

```js
function Person(){} 
Person.prototype.getName = function(){ 
  return this.name; 
}; 
 
// Implement a function that inherits from Person 
// and sets a name in the constructor 
 
var me = new Me(); 
assert( me.getName(), "A name was set." );
```

根据注释来看，就是要求让Me继承语Person，并且给一个名字

```js
function Me(){
  this.name = 'Zhenly'
};
Me.prototype = new Person();
```

根据上面的知识很容易就写了出来。

这里顺便提一下，对于这些继承的东西，ES6提供了Class的语法糖，写起来就更加直观明了，但是归根到底还是基于原型链的继承。

### #78: The result is rather straight-forward.

```js
function Person(){} 
Person.prototype.getName = function(){ 
  return this.name; 
}; 
 
function Me(){ 
  this.name = "John Resig"; 
} 
Me.prototype = new Person(); 
 
var me = new Me(); 
assert( me.getName(), "A name was set." );
```

看，他的结果也是和我一毛一样的。（逃

---

## Built-in Prototypes

### #80: We can also modify built-in object prototypes.

```js
if (!Array.prototype.forEach) { 
  Array.prototype.forEach = function(fn){ 
    for ( var i = 0; i < this.length; i++ ) { 
      fn( this[i], i, this ); 
    } 
  }; 
} 
 
["a", "b", "c"].forEach(function(value, index, array){ 
  assert( value, "Is in position " + index + " out of " + (array.length - 1) ); 
});
```

我们甚至可以修改JavaScript里面原生的库的prototype，也可以为他们添加一些属性或方法。

### #81: Beware: Extending prototypes can be dangerous.

```js
Object.prototype.keys = function(){ 
  var keys = []; 
  for ( var i in this ) 
    keys.push( i ); 
  return keys; 
}; 
 
var obj = { a: 1, b: 2, c: 3 }; 
 
assert( obj.keys().length == 3, "We should only have 3 properties." ); 
 
delete Object.prototype.keys;
```

上面一个提到我们可以修改原生库里面的原型，但是也是一种危险的做法。

比如在这里，他为Object添加了一个keys的方法。然后使用for...in 遍历this的所有属性，这时候this上多了一个keys的属性，那么他的length自然就变成了4，并不是我们想要的结果。

---

## Enforcing Function Context

### #83: What happens when we try to bind an object's method to a click handler?

```js
var Button = { 
  click: function(){ 
    this.clicked = true; 
  } 
}; 
 
var elem = document.createElement("li"); 
elem.innerHTML = "Click me!"; 
elem.onclick = Button.click; 
document.getElementById("results").appendChild(elem); 
 
elem.onclick(); 
assert( elem.clicked, "The clicked property was accidentally set on the element" );
```

这里进行了一些常规操作。简单来说就是建立一个Button对象，里面有个click事件，然后把这个事件绑定到新建的元素里面，然后调用一下，然后elem作为this，那个clicked就变成了true了，正常操作，没有什么东西好注意的。溜了

### #84: We need to keep its context as the original object.

```js
function bind(context, name){ 
  return function(){ 
    return context[name].apply(context, arguments); 
  }; 
} 
 
var Button = { 
  click: function(){ 
    this.clicked = true; 
  } 
}; 
 
var elem = document.createElement("li"); 
elem.innerHTML = "Click me!"; 
elem.onclick = bind(Button, "click"); 
document.getElementById("results").appendChild(elem); 
 
elem.onclick(); 
assert( Button.clicked, "The clicked property was correctly set on the object" );
```

这里和上面有点不同，这里把context绑定在Button这个对象里面，因此我们虽然调用的是elem的onclick事件，但是事件执行的上下文是在Button里面的。也属于常规操作。

### #85: Add a method to all functions to allow context enforcement.

```js
Function.prototype.bind = function(object){ 
  var fn = this; 
  return function(){ 
    return fn.apply(object, arguments); 
  }; 
}; 
 
var Button = { 
  click: function(){ 
    this.clicked = true; 
  } 
}; 
 
var elem = document.createElement("li"); 
elem.innerHTML = "Click me!"; 
elem.onclick = Button.click.bind(Button); 
document.getElementById("results").appendChild(elem); 
 
elem.onclick(); 
assert( Button.clicked, "The clicked property was correctly set on the object" );
```

这里和上面不同的是把bind放在了Function的原型里面（虽然标准库里面本身就有了），然后我们就可以更加优雅地绑定事件运行时的上下文。挺好的，其他细节部分和上面都是一样的。

### #86: Our final target (the .bind method from Prototype.js).

```js
Function.prototype.bind = function(){ 
  var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift(); 
  return function(){ 
    return fn.apply(object, 
      args.concat(Array.prototype.slice.call(arguments))); 
  }; 
}; 
 
var Button = { 
  click: function(value){ 
    this.clicked = value; 
  } 
}; 
 
var elem = document.createElement("li"); 
elem.innerHTML = "Click me!"; 
elem.onclick = Button.click.bind(Button, false); 
document.getElementById("results").appendChild(elem); 
 
elem.onclick(); 
assert( Button.clicked === false, "The clicked property was correctly set on the object" );
```

这里出现了文章一开始#1里面的bind，之前解释得已经很清晰了，这里就不详细提了。

---

## Bonus: Function Length

### #88: How does a function's length property work?

```js
function makeNinja(name){} 
function makeSamurai(name, rank){} 
assert( makeNinja.length == 1, "Only expecting a single argument" ); 
assert( makeSamurai.length == 2, "Multiple arguments expected" );
```

这里告诉我们，一个函数具有一个length的属性，而这个属性的值就是等于参数列表的个数。

### #89: We can use it to implement method overloading.

```js
function addMethod(object, name, fn){ 
  // Save a reference to the old method 
  var old = object[ name ]; 
 
  // Overwrite the method with our new one 
  object[ name ] = function(){ 
    // Check the number of incoming arguments, 
    // compared to our overloaded function 
    if ( fn.length == arguments.length ) 
      // If there was a match, run the function 
      return fn.apply( this, arguments ); 
 
    // Otherwise, fallback to the old method 
    else if ( typeof old === "function" ) 
      return old.apply( this, arguments ); 
  }; 
}
```

这里向我们展示了一种骚操作，先对象添加一个方法，通过判断函数参数的长度，决定调用的是新加入的方法还是之前的老方法，这样可以解决掉一些添加新功能后的兼容性问题。（虽然感觉没有用

### #90: How method overloading might work, using the function length property.

```js
function addMethod(object, name, fn){ 
  // Save a reference to the old method 
  var old = object[ name ]; 
 
  // Overwrite the method with our new one 
  object[ name ] = function(){ 
    // Check the number of incoming arguments, 
    // compared to our overloaded function 
    if ( fn.length == arguments.length ) 
      // If there was a match, run the function 
      return fn.apply( this, arguments ); 
 
    // Otherwise, fallback to the old method 
    else if ( typeof old === "function" ) 
      return old.apply( this, arguments ); 
  }; 
} 
 
function Ninjas(){ 
  var ninjas = [ "Dean Edwards", "Sam Stephenson", "Alex Russell" ]; 
  addMethod(this, "find", function(){ 
    return ninjas; 
  }); 
  addMethod(this, "find", function(name){ 
    var ret = []; 
    for ( var i = 0; i < ninjas.length; i++ ) 
      if ( ninjas[i].indexOf(name) == 0 ) 
        ret.push( ninjas[i] ); 
    return ret; 
  }); 
  addMethod(this, "find", function(first, last){ 
    var ret = []; 
    for ( var i = 0; i < ninjas.length; i++ ) 
      if ( ninjas[i] == (first + " " + last) ) 
        ret.push( ninjas[i] ); 
    return ret; 
  }); 
} 
 
var ninjas = new Ninjas(); 
assert( ninjas.find().length == 3, "Finds all ninjas" ); 
assert( ninjas.find("Sam").length == 1, "Finds ninjas by first name" ); 
assert( ninjas.find("Dean", "Edwards").length == 1, "Finds ninjas by first and last name" ); 
assert( ninjas.find("Alex", "X", "Russell") == null, "Does nothing" );
```

这里作者向我们展示了一种更加骚的操作，通过上一个样例的方法，为find这个方法添加了三种不同的方法，实现不同参数调用不同的函数的功能，（只是为什么不直接判断arguments来实现呢

虽然用这种方法扩展起来的确是比较爽的

---

## 结语

通过三天的时间，把这个Learning Advanced JavaScript 过了一遍，附加上一些我个人的理解，可能存在一点错误，如果发现还请指出。

学到了不少JavaScript的高级操作，总的来时收获还是挺多的，但是写的时候还是多多参考一下文档，听说ES2018就快出来了，到时候又有不少语法糖和骚操作可以用了。

对于JavaScript的文档，这里推荐一下https://developer.mozilla.org/zh-CN/docs/Web/JavaScript

里面写得比较详细，而且大多数都有中文翻译，如果没有，那你快去提供一个咯。

完。























