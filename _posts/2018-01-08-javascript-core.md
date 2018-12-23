---
layout:         post
title:          Javascript core features
date:           2018-01-08 20:00:00 +1
image:          js.png
image-alt:      js logo
tags:           [js, javascript, es6, es7, es8]
categories:     [guide]
---

Reading notes from You don't know JS books.

<!-- more -->

1. TOC
{:toc}

## First glance
### Terms
#### Common terms
- Operators
- Values and Types
- variables
- conditionals
- loops
- functions

#### Statement
A group of words, numbers, and operators that performs a specific task is a statement `a = b * 2;`

#### Expression
An expression is any reference to a variable or value, or a set of variable(s) and value(s) combined with operators.
- Consider `a = b * 2;`:
   - `2` is a literal value expression
   - `b` is a variable expression
   - `b * 2` is an arithmetic expression
   - `a = b * 2` is an assignment expression
- Expression statement : general expression that stands alone `b * 2;`
- Call expression : `alert( a );`

#### Blocks
In JavaScript, a block is defined by wrapping one or more statements inside a curly-brace pair `{ .. }`

#### Scope
Each function gets its own scope.

#### Switch statement

```javascript
switch (a) {
    case 2:
    case 10:
        // some cool stuff
        break;
    case 42:
        // other stuff
        break;
    default:
        // fallback
}
```

### Values and types
- string
- number
- boolean
- null and undefined
- object
- function
- symbol (new to ES6)

#### Boolean
##### False
- `''`
- `0`, `-0`, `NaN`
- `null`, `undefined`
- `false`
##### True
- `'Yep'`
- `2`
- `true`
- `[]`, `[1,'2', 3]`
- `{}`, `{a: 'bc'}`
- `function foo() { return 2; }`

### Comparison
#### Equality
- `==` checks for value equality with coercion
- `===` checks for value and type equality without coercion

Note that comparing two non-primitive values (e.g. objects (+ arrays & functions)) only checks the object's reference, not the underlying values

```javascript
var a = [1,2,3];
var b = [1,2,3];
var c = "1,2,3";
 
a == c;     // true, coercion applied on the array
b == c;     // true, coercion applied on the array
a == b;     // false
```

#### Inequality

```javascript
var a = 41;
var b = "42";
var c = "43";
 
a < b;      // true
b < c;      // true
```

```javascript
var a = 42;
var b = "foo";
 
a < b;      // false
a > b;      // false
a == b;     // false
```

### Function scopes
#### Hoisting
- Wherever a `var` appears inside a scope, that declaration is taken to belong to the entire scope and accessible everywhere throughout.
- If you try to access a variable's value in a scope where it's not available, you'll get a ReferenceError thrown
- ES6 `let` variables only belong to an individual block (e.g. if / loop statements, functions...)

### Strict mode (ES5)
Tightens the rules for certain behaviors => safer & cleaner. Allows better optimization.
- Can adopt for an individual function or an entire file `'use strict';`

### Function expressions

```javascript
var foo = function() {     // Anonymous function expression
    // ..
};
 
var x = function bar(){    // Named function expression
    // ..
};
```

### Immediately invoked function expressions (IIFE)

```javascript
(function () { /* ... */ })();
(function () { /* ... */ }());
(() => { /* ... */ })();
 
!function () { /* ... */ }();
~function () { /* ... */ }();
-function () { /* ... */ }();
+function () { /* ... */ }();
void function () { /* ... */ }();
```

### Closure
#### Example
Think of closure as a way to "remember" and continue to access a function's scope (its variables) even once the function has finished running.

```javascript
function makeAdder(x) {
    // parameter `x` is an inner variable
 
    // inner function `add()` uses `x`, so
    // it has a "closure" over it
    function add(y) {
        return y + x;
    };
 
    return add;
}
 
// `plusOne` gets a reference to the inner `add(..)`
// function with closure over the `x` parameter of
// the outer `makeAdder(..)`
var plusOne = makeAdder( 1 );
 
// `plusTen` gets a reference to the inner `add(..)`
// function with closure over the `x` parameter of
// the outer `makeAdder(..)`
var plusTen = makeAdder( 10 );
 
plusOne( 3 );       // 4  <-- 1 + 3
plusOne( 41 );      // 42 <-- 1 + 41
 
plusTen( 13 );      // 23 <-- 10 + 13
```

#### Closure usage : Module pattern

```javascript
function User(){
    var username, password;
 
    function doLogin(user,pw) {
        username = user;
        password = pw;
 
        // do the rest of the login work
    }
 
    var publicAPI = {
        login: doLogin
    };
 
    return publicAPI;
}
 
// create a `User` module instance
var fred = User();
 
fred.login( "fred", "12Battery34!" );
```

### `this` identifier

```javascript
function foo() {
    console.log( this.bar );
}
 
var bar = "global";
 
var obj1 = {
    bar: "obj1",
    foo: foo
};
 
var obj2 = {
    bar: "obj2"
};
 
// --------
 
foo();              // "global", set this to the global object in non strict mode, undefined otherwise
obj1.foo();         // "obj1", set this to obj1
foo.call( obj2 );       // "obj2", set this to obj2
new foo();          // undefined, set this to brand new object
```

### Prototypes
When you reference a property on an object, if that property doesn't exist, JavaScript will automatically use that object's internal prototype reference to find another object to look for the property on. You could think of this almost as a fallback if the property is missing.
The internal prototype reference linkage from one object to its fallback happens at the time the object is created.

```javascript
var foo = {
    a: 42
};
 
// create `bar` and link it to `foo`
var bar = Object.create( foo );
 
bar.b = "hello world";
 
bar.b;      // "hello world"
bar.a;      // 42 <-- delegated to `foo`
```
Used for behaviour delegation.

## Scope & closures
### What is a scope
#### Javascript compiler
##### Traditional (simplified) compilation
- Tokenizing/Lexing: splitting strings into meaningful chunks called tokens. Lexing is the process considering if a chunk should be considered as a token or as part of another token
- Parsing: taking a stream of tokens an turning it into a tree of nested elements which represent the grammatical structure of the program. The tree is called the AST (Abstract Syntax Tree)
- Code-generation: taking an AST and turning it into executable code

##### Javascript compilation
- Happens just before the execution, thus it needs to be performed very quickly
- Every JS snippet has to be compiled before being executed
- Two steps : scope resolution & action execution


##### Scope

RHS : Right Hand Side (source of the assignment)
LHS : Left Hand Side (target of the assignment)

```javascript
function foo(a) {
    var b = a;
    return a + b;
}
 
var c = foo( 2 );
```

Identify all the LHS look-ups (there are 3!)
- `c =` , global var
- `a =` , foo function param
- `b =` , foo function internal var 
Identify all the RHS look-ups (there are 4!)
- `foo(2)` function
- `= a` value (`b` assignment)
- `a+` value (`a + b` expression)
- `+b` value (`a + b` expression)

#### Errors
- If an RHS look-up fails to ever find a variable, anywhere in the nested Scopes, this results in a ReferenceError being thrown by the Engine. It's important to note that the error is of the type ReferenceError.

- By contrast, if the Engine is performing an LHS look-up and arrives at the top floor (global Scope) without finding it, and if the program is not running in "Strict Mode", then the global Scope will create a new variable of that name in the global scope, and hand it back to Engine.
Strict mode has a number of different behaviors from normal/relaxed/lazy, it would throw a ReferenceError in this case.

- Now, if a variable is found for an RHS look-up, but you try to do something with its value that is impossible, such as trying to execute-as-function a non-function value, or reference a property on a null or undefined value, then Engine throws a different kind of error, called a TypeError.

- ReferenceError is Scope resolution-failure related, whereas TypeError implies that Scope resolution was successful, but that there was an illegal/impossible action attempted against the result.

### Lexical scope
- Scope defined at lexing time
- Scope look-up stops once it finds the first match
- Shadowing : the same identifier name can be specified at multiple layers of nested scope
- No matter where a function is invoked from, or even how it is invoked, its lexical scope is only defined by where the function was declared.
- The lexical scope look-up process only applies to first-class identifiers, such as the a, b, and c. If you had a reference to foo.bar.baz in a piece of code, the lexical scope look-up would apply to finding the foo identifier, but once it locates that variable, object property-access rules take over to resolve the bar and baz properties, respectively.

#### Cheating lexical scope
- bad practice : lead to poorer performance
- `eval` : modify lexical scope at runtime by evaluating a string of code which has one or more declaration in it
- `with` : creates a whole new lexical scope at runtime by treating an object reference as a "scope" and that object properties as scoped identifiers
- Use of both cheating mecanisms prevents Engine optimizations (pessimistically assume that optimizations are invalid). Code will run slower

### Function scope vs block scope
#### Scope from functions
Used for
- Hiding in plain scope : make vars & functions private ("Principle of Least Privilege" or "Least Authority" or "Least Exposure" ; expose only what is minimally necessary
- Collision avoidance (loop counter)
- global namespaces (adds unique var to global scope)
- modules (do not modify global scope but explicitly import module as a var)

#### Function as scope
##### Anonymous functions
These functions has no name
- No names for stack trace debug
- If needed to refer from itself (recursion or for unbind if a event handler function), needs to use deprecated `argument.callee` reference
- Code comprehension
WARNING !!! The `undefined` reference can be overriden !!!

#### Block as scope
Block scoped statements :
- `with`
- `try/catch` : catch block (linters may still consider it as an error) [used to polyfill let !!! vs IIFE : use of return, this, break & continue changed]
##### `let`
- `let` respects the enclosing block
- `let` variable is not hoisted (references errors)
- using `let` can help Garbage collector
- `let` in for loops : loop scope only but only re-binds value at each iteration !!!
##### `const`
- scope blocked variable too
- its value is fixed (error thrown)

### Hoisting

```javascript
console.log( a );   // undefined
var a = 2;
```

All declarations, both variables and functions, are processed first, before any part of your code is executed
`var a = 2;` is processed as two statements : `var a` and `a = 2;`. First statement is processed during the compilation phase. The second statement is left in place for the execution phase.

- Only the declarations themselves are hoisted, while any assignments or other executable logic are left in place
- Hoisting is per-scope
- Functions are hoisted first, and then variables
- Last declaration overrides previous ones

### Closures
Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.

```javascript
function foo() {
    var a = 2;
 
    function bar() {
        console.log( a );
    }
 
    return bar;
}
 
var baz = foo();
 
baz(); // 2 -- Whoa, closure was just observed, man.
```

- `bar()` still has a reference to `foo()` scope, and that reference is called closure

Whatever facility we use to transport an inner function outside of its lexical scope, it will maintain a scope reference to where it was originally declared, and wherever we execute it, that closure will be exercised.

```javascript
for (var i=1; i<=5; i++) {
    setTimeout( function timer(){
      console.log( i );     // display 6 five times. Only one scope here
    }, i*1000 );
}
 
for (var i=1; i<=5; i++) {
    let j = i;
    setTimeout( function timer(){
      console.log( j );     // works as intended because let var created a different scope at each iteration
    }, j*1000 );
}
```

#### Module pattern

```javascript
function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];
 
    function doSomething() {
        console.log( something );
    }
 
    function doAnother() {
        console.log( another.join( " ! " ) );
    }
 
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}
 
var foo = CoolModule();
 
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

- The module is a function, and need to be invoked
- It returns a object (object-literal syntax) that represents the public API of the module
- Each time it is invoked, it returns a new instance

- Use IIFE bound to a var for singleton use

```javascript
var foo = (function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];
 
    function doSomething() {
        console.log( something );
    }
 
    function doAnother() {
        console.log( another.join( " ! " ) );
    }
 
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
})();
 
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

## This & object prototypes
### this reference
#### Confusions
- `this` is not a reference to the enclosing function
- `this` is not a reference to its scope. You cannot use a `this` reference to look something up in a lexical scope. It is not possible.
#### Definition
- Runtime binding
- When a function is invoked, an activation record, otherwise known as an execution context, is created. This record contains information about where the function was called from (the call-stack), how the function was invoked, what parameters were passed, etc. One of the properties of this record is the this reference which will be used for the duration of that function's execution.
- call-site : where the function is invoked from.
- call-stack : functions call chaining
#### Rules for determining call-site
1. Is the function called with new (new binding)? If so, this is the newly constructed object.

```javascript
var bar = new foo()
```

2. Is the function called with call or apply (explicit binding), even hidden inside a bind hard binding? If so, this is the explicitly specified object.

```javascript
var bar = foo.call( obj2 )
```

3. Is the function called with a context (implicit binding), otherwise known as an owning or containing object? If so, this is that context object.

```javascript
var bar = obj1.foo()
```

4. Otherwise, default the this (default binding). If in strict mode, pick undefined, otherwise pick the global object.

```javascript
var bar = foo()
```

#### Exceptions
##### Ignored this
- If you pass null or undefined as a this binding parameter to call, apply, or bind, those values are effectively ignored, and instead the default binding rule applies to the invocation. Used before ES6 for spreading out arrays of values as arguments to a function call

```javascript
function foo(a,b) {
    console.log( "a:" + a + ", b:" + b );
}
 
// spreading out array as parameters
foo.apply( null, [2, 3] ); // a:2, b:3
 
// currying with `bind(..)`
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```

Use spread operator `...` in ES6 

```javascript
foo(...[1,2])
```

- Safer `this`
Use an empty "DMZ" object. Prefer `Object.create(null)` as it is similar to `{ }`, but without the delegation to Object.prototype, so it's "more empty" than just `{ }`

##### Indirection
Another thing to be aware of is you can (intentionally or not!) create "indirect references" to functions, and in those cases, when that function reference is invoked, the default binding rule also applies.

##### Softening Binding
Provides a different default for default binding (not global or undefined), while still leaving the function able to be manually this bound via implicit binding or explicit binding techniques

##### Lexical this
Arrow-functions : Instead of using the four standard this rules, arrow-functions adopt the this binding from the enclosing (function or global) scope (= use of lexical scope for `this`). this is resolved at call-time
Lose `this` flexibility, avoid arrow functions

### Objects
#### Syntax
Objects come in two forms: the declarative (literal) form, and the constructed form.

```javascript
// Declarative form:
var myObj = {
    key: value
    // ...
};
 
// Constructed form:
var myObj = new Object();
myObj.key = value;
```

Note: It's extremely uncommon to use the "constructed form" for creating objects as just shown. You would pretty much always want to use the literal syntax form. The same will be true of most of the built-in objects (see below)

#### Type
6 primary types
- string
- number
- boolean
- null
- undefined
- object

Simple primitives (string, number, boolean, null, and undefined) are not themselves objects

#### Built-in Objects (complex primitives)
- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp
- Error

The language automatically coerces a "string" primitive to a String object when necessary
null and undefined have no object wrapper form, only their primitive values.
By contrast, Date values can only be created with their constructed object form, as they have no literal form counter-part.

For Objects, only use the constructed form if you need the extra options

Objects property names are always strings.

ES6 adds computed property names, where you can specify an expression, surrounded by a [ ] pair, in the key-name position of an object-literal declaration:

```javascript
var prefix = "foo";
 
var myObject = {
    [prefix + "bar"]: "hello",
    [prefix + "baz"]: "world"
};
 
myObject["foobar"]; // hello
myObject["foobaz"]; // world
```

Technically, functions never "belong" to objects, so saying that a function that just happens to be accessed on an object reference is automatically a "method" seems a bit of a stretch of semantics.

Every time you access a property on an object, that is a property access

#### Arrays
- Array assumes numeric indexing
- Can add standard properties to array
- If you add a property with a key that "look like" a number, it will be considered as a numeric index

```javascript
var myArray = [ "foo", 42, "bar" ];
 
myArray["3"] = "baz";
 
myArray.length; // 4
 
myArray[3];     // "baz"
```

#### Duplicating objects
Shallow or deep copy ???
- Shallow copy copies references, not the referenced object itself
   - ES6 Shallow copy : Object.assign(target, ...sources)
- How do you handle deep copy safely ?
   - JSON safe data can be copied with

```javascript
var newObj = JSON.parse( JSON.stringify( someObj ) );
```

#### Property descriptors
##### GetOwnPropertyDescriptor
```javascript
var myObject = {
    a: 2
};
 
Object.getOwnPropertyDescriptor( myObject, "a" );
// {
//    value: 2,
//    writable: true,
//    enumerable: true,
//    configurable: true
// }
```

##### DefineProperty
```javascript
var myObject = {};
 
Object.defineProperty( myObject, "a", {
    value: 2,
    writable: true,
    configurable: true,
    enumerable: true
} );
 
myObject.a; // 2
```

##### Properties
- Writable : ability to modify the value
   - fails silently if not in `strict mode`
- Configurable : ability to modify its property descriptors using defineProperty
   - fails regardless of `strict mode` enabled or not
   - prevents the use of the `delete` operator used to remove an existing property
  
- Enumerable : ability to show the property in certain object-property enumerations. The property is still completely accessible

##### Immutability
###### Object constant
By combining `writable:false` and `configurable:false`, you can essentially create a constant (cannot be changed, redefined or deleted) as an object property, like

```javascript
var myObject = {};
 
Object.defineProperty( myObject, "FAVORITE_NUMBER", {
    value: 42,
    writable: false,
    configurable: false
} );
```

###### Prevent Extensions
If you want to prevent an object from having new properties added to it, but otherwise leave the rest of the object's properties alone, call `Object.preventExtensions(..)`

```javascript
var myObject = {
    a: 2
};
 
Object.preventExtensions( myObject );
 
myObject.b = 3;
myObject.b; // undefined
```

###### Seal
`Object.seal(..)` creates a "sealed" object, which means it takes an existing object and essentially calls `Object.preventExtensions(..)` on it, but also marks all its existing properties as `configurable:false`.

So, not only can you not add any more properties, but you also cannot reconfigure or delete any existing properties (though you can still modify their values).

###### Freeze
`Object.freeze(..)` creates a frozen object, which means it takes an existing object and essentially calls Object.seal(..) on it, but it also marks all "data accessor" properties as `writable:false`, so that their values cannot be changed.

##### [[Get]]

##### [[Put]]
If the property is present, the [[Put]] algorithm will roughly check:
- Is the property an accessor descriptor (see "Getters & Setters" section below)? If so, call the setter, if any.
- Is the property a data descriptor with writable of false? If so, silently fail in non-strict mode, or throw TypeError in strict mode.
- Otherwise, set the value to the existing property as normal.

##### Getter & setter
Property accessors introduced with ES5.
When used, value and writable property descriptors are ignored.

```javascript
var myObject = {
    // define a getter for `a`
    get a() {
        return 2;
    }
};
 
Object.defineProperty(
    myObject,   // target
    "b",        // property name
    {           // descriptor
        // define a getter for `b`
        get: function(){ return this.a * 2 },
 
        // make sure `b` shows up as an object property
        enumerable: true
    }
);
 
myObject.a; // 2
myObject.b; // 4
```

##### Existence
in operator (look up the [[Prototype]] chain or `myObject.hasOwnProperty()`, on direct object.
If `myObject` created as an empty object `(Object.create(null))`, use `Object.prototype.hasOwnProperty.call(myObject,"a")`

##### Enumeration
`for..in` : loop through enumerable properties
`myObject.propertyIsEnumerable('a')`
`Object.keys(myObject)` : returns an array of all enumerable properties
`Object.getOwnPropertyNames(myObject)` : returns an array of all properties, enumerable or not

##### Iteration
ES5 helpers for arrays :
`myArray.forEach()`: callback returning all values
`myArray.every()`: callback returning values. Stops when callback return false;
`myArray.some()`: callback returning values. Stops when callback return true;

Iterating over Object properties do not guarantee their order !!!

ES6 : `for..of` : iterate over the values instead of the keys.
Arrays has a built-in @@iterator Symbol (Symbol.iterator)

```javascript
var myArray = [ 1, 2, 3 ];
var it = myArray[Symbol.iterator]();
 
it.next(); // { value:1, done:false }
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { done:true }
```

### Classes
- instantiation (copy)
- inheritance (copy)
- polymorphism (override ability and reference original one)

#### Mixins (= object contents 'mixed-in')
##### Explicit Mixins
Explicit pseudo polymorphism:

```javascript
var Vehicle = {
    engines: 1,
 
    ignition: function() {
        console.log( "Turning on my engine." );
    },
 
    drive: function() {
        this.ignition();
        console.log( "Steering and moving forward!" );
    }
};
 
var Car = mixin( Vehicle, {
    wheels: 4,
 
    drive: function() {
        Vehicle.drive.call( this );
        console.log( "Rolling on all " + this.wheels + " wheels!" );
    }
} );
```

Here we need to call the Vehicle drive function with `Vehicle.drive.call( this );` because the drive function defined on `Car` shadowed the drive function defined on Vehicle
 - Property references are copied, not the objects themselves. 

###### Parasitic inheritance
```javascript
 // "Traditional JS Class" `Vehicle`
function Vehicle() {
    this.engines = 1;
}
Vehicle.prototype.ignition = function() {
    console.log( "Turning on my engine." );
};
Vehicle.prototype.drive = function() {
    this.ignition();
    console.log( "Steering and moving forward!" );
};
 
// "Parasitic Class" `Car`
function Car() {
    // first, `car` is a `Vehicle`
    var car = new Vehicle();
 
    // now, let's modify our `car` to specialize it
    car.wheels = 4;
 
    // save a privileged reference to `Vehicle::drive()`
    var vehDrive = car.drive;
 
    // override `Vehicle::drive()`
    car.drive = function() {
        vehDrive.call( this );
        console.log( "Rolling on all " + this.wheels + " wheels!" );
    };
 
    return car;
}
 
var myCar = new Car();
 
myCar.drive();
// Turning on my engine.
// Steering and moving forward!
// Rolling on all 4 wheels!
```

##### Implicit Mixins
```javascript
var Something = {
    cool: function() {
        this.greeting = "Hello World";
        this.count = this.count ? this.count + 1 : 1;
    }
};
 
Something.cool();
Something.greeting; // "Hello World"
Something.count; // 1
 
var Another = {
    cool: function() {
        // implicit mixin of `Something` to `Another`
        Something.cool.call( this );
    }
};
 
Another.cool();
Another.greeting; // "Hello World"
Another.count; // 1 (not shared state with `Something`)
```

### [[Prototypes]]
Objects in JavaScript have an internal property, denoted in the specification as [[Prototype]], which is simply a reference to another object

Some utilities found here you may be familiar with include `.toString()` and `.valueOf()`. In Chapter 3, we introduced another: `.hasOwnProperty(..)`. And yet another function on `Object.prototype` you may not be familiar with, but which we'll address later in this chapter, is `.isPrototypeOf(..)`

#### Setting & shadowing properties

```javascript
myObject.foo = "bar";
```

If the myObject object already has a normal data accessor property called foo directly present on it, the assignment is as simple as changing the value of the existing property.
If foo is not already present directly on myObject, the [[Prototype]] chain is traversed, just like for the [[Get]] operation.
1. If foo is not found anywhere in the chain, the property foo is added directly to myObject with the specified value, as expected.
2. If a normal data accessor property named foo is found anywhere higher on the [[Prototype]] chain, and it's not marked as read-only (writable:false) then a new property called foo is added directly to myObject, resulting in a shadowed property
3. If a foo is found higher on the [[Prototype]] chain, but it's marked as read-only (writable:false), then both the setting of that existing property as well as the creation of the shadowed property on myObject are disallowed. If the code is running in strict mode, an error will be thrown. Otherwise, the setting of the property value will silently be ignored. Either way, no shadowing occurs.
4. If a foo is found higher on the [[Prototype]] chain and it's a setter (see Chapter 3), then the setter will always be called. No foo will be added to (aka, shadowed on) myObject, nor will the foo setter be redefined.

#### "Classes"
All functions by default get a public, non-enumerable (see Chapter 3) property on them called prototype, which points at an otherwise arbitrary object
`new Foo()` results in a new object (we called it a), and that new object a is internally [[Prototype]] linked to the `Foo.prototype` object.

Prototypal inheritance : In JavaScript, we don't make copies from one object ("class") to another ("instance"). We make links between objects. For the [[Prototype]] mechanism, visually, the arrows move from right to left, and from bottom to top.
"Inheritance" implies a copy operation, and JavaScript doesn't copy object properties (natively, by default). Instead, JS creates a link between two objects, where one object can essentially delegate property/function access to another object. "Delegation" (see Chapter 6) is a much more accurate term for JavaScript's object-linking mechanism

If you try to think of any given object in JS as the sum total of all behavior that is available via delegation, and in your mind you flatten all that behavior into one tangible thing, then you can (sorta) see how "differential inheritance" might fit
But just like with "prototypal inheritance", "differential inheritance" pretends that your mental model is more important than what is physically happening in the language. It overlooks the fact that object B is not actually differentially constructed, but is instead built with specific characteristics defined, alongside "holes" where nothing is defined. It is in these "holes" (gaps in, or lack of, definition) that delegation can take over and, on the fly, "fill them in" with delegated behavior.

##### Constructor
Functions aren't constructors, but function calls are "constructor calls" if and only if `new` is used.
Constructor call constructs an object AND executes the associated function.

For one, the `.constructor` property on `Foo.prototype` is only there by default on the object created when Foo the function is declared. If you create a new object, and replace a function's default .prototype object reference, the new object will not by default magically get a `.constructor` on it.

The fact is, `.constructor` on an object arbitrarily points, by default, at a function who, reciprocally, has a reference back to the object -- a reference which it calls `.prototype`

`.constructor` is extremely unreliable, and an unsafe reference to rely upon in your code. Generally, such references should be avoided where possible.

##### Object.create
`Object.create(prototype)` creates a "new" object out of thin air, and links that new object's internal [[Prototype]] to the object you specify

##### Mechanics
Delegation through the [[Prototype]] mimics the class inheritage behaviour

```javascript
function Foo(name) {
    this.name = name;
}
 
Foo.prototype.myName = function() {
    return this.name;
};
 
var a = new Foo( "a" );
var b = new Foo( "b" );
 
a.myName(); // "a"
b.myName(); // "b"
```

But in that example, the property `myName` is not copied over `a` and `b` ; it is carried by `Foo.prototype` and resolved through [[Prototype]] delegation

##### Class inheritance
```javascript
function Foo(name) {
    this.name = name;
}
 
Foo.prototype.myName = function() {
    return this.name;
};
 
function Bar(name,label) {
    Foo.call( this, name );
    this.label = label;
}
 
// here, we make a new `Bar.prototype`
// linked to `Foo.prototype`
Bar.prototype = Object.create( Foo.prototype );
 
// Beware! Now `Bar.prototype.constructor` is gone,
// and might need to be manually "fixed" if you're
// in the habit of relying on such properties!
 
Bar.prototype.myLabel = function() {
    return this.label;
};
 
var a = new Bar( "a", "obj a" );
 
a.myName(); // "a"
a.myLabel(); // "obj a"
```

What's important here is the `Bar.prototype = Object.create( Foo.prototype );` line.
We replace `Bar.prototype` with a new object [[Prototype]] linked to `Foo.prototype`.
It permits to link Bar to Foo without calling `Foo` constructor (as in `Bar.prototype = new Foo()`);
It also creates a brand new object linked through [[Prototype]], not just a new reference (as in `Bar.prototype = Foo.prototype;`).

```javascript
ES6 introduces a new way to handle this problem conveniently : 
// pre-ES6
// throws away default existing `Bar.prototype`
Bar.prototype = Object.create( Foo.prototype );
 
// ES6+
// modifies existing `Bar.prototype`
Object.setPrototypeOf( Bar.prototype, Foo.prototype );
```

##### Inspecting "Class" Relationships (introspection / reflection)
- The `instanceof` operator takes a plain object as its left-hand operand and a function as its right-hand operand. The question `instanceof` answers is: in the entire [[Prototype]] chain of `a`, does the object arbitrarily pointed to by `Foo.prototype` ever appear?
But how to compare two objects ?
- Use a trick or `isPrototypeOf()`

```javascript
// helper utility to see if `o1` is
// related to (delegates to) `o2`
function isRelatedTo(o1, o2) {
    function F(){}
    F.prototype = o2;
    return o1 instanceof F;
}
 
var a = {};
var b = Object.create( a );
 
isRelatedTo( b, a ); // true
 
a.isPrototypeOf( b ); // true
```

### Behavior Delegation
#### Classes vs Behavior Delegation
- Class pattern :
   - Declare function constructor `Foo`
   - Add functions to the prototype
   - Declare sub class function constructor `Bar` (may super call with `Foo.call(this, params)`)
   - Override `Bar.prototype` with `Object.create(Foo.prototype)`
   - Add functions to the prototype (may super call with `Foo.prototype.baz.call(this, params)`)
   - Create instance with `new`

```javascript
function Foo(who) {
    this.me = who;
}
Foo.prototype.identify = function() {
    return "I am " + this.me;
};
 
function Bar(who) {
    Foo.call( this, who );
}
Bar.prototype = Object.create( Foo.prototype );
 
Bar.prototype.speak = function() {
    alert( "Hello, " + this.identify() + "." );
};
 
var b1 = new Bar( "b1" );
var b2 = new Bar( "b2" );
 
b1.speak();
b2.speak();
```

- Behavior Delegation pattern
   - Declare `Foo` object with init(=constructor) and other functions
   - Create `Bar` object and link prototype to `Foo` with `Object.create(Foo)`
   - Add function to the object
   - Create 'instance' with `Object.create(Bar)`
With behaviour delegation pattern, the only thing we ever really cared about was the objects linked to other objects (not prototypes, constructors).

```javascript
var Foo = {
    init: function(who) {
        this.me = who;
    },
    identify: function() {
        return "I am " + this.me;
    }
};
 
var Bar = Object.create( Foo );
 
Bar.speak = function() {
    alert( "Hello, " + this.identify() + "." );
};
 
var b1 = Object.create( Bar );
b1.init( "b1" );
var b2 = Object.create( Bar );
b2.init( "b2" );
 
b1.speak();
b2.speak();
```

Behaviour delegation tends to avoid conflicting function names (shadowing needing ugly polymorphism).

#### ES6 class syntax sugar

```javascript
class Foo{
  constructor (who){
    this.me = who;
  }
  identify () {
    return "I am " + this.me;
  }
}
 
class Bar extends Foo {
  constructor(who){
    super(who);
  }
  speak () {
    alert( "Hello, " + this.identify() + "." );
  }
}
 
var b1 = new Bar( "b1" );
var b2 = new Bar( "b2" );
 
b1.speak();
b2.speak();
```

#### Behaviour delegation pros
- construction and initialization can be separated
- simpler mental process (prototypes & co)
- nicer syntax (ugly `Foo.prototype.isPrototypeOf(Bar.prototype)` VS `Foo.isPrototypeOf(Bar)`)

### ES6 class syntax (pros &) cons
pros :
- There's no more references to `.prototype` cluttering the code.
- `Button` is declared directly to "inherit from" (aka extends) Widget, instead of needing to use `Object.create(..)` to replace a `.prototype` object that's linked, or having to set with `.__proto__` or `Object.setPrototypeOf(..)`.
- `super(..)` now gives us a very helpful relative polymorphism capability, so that any method at one level of the chain can refer relatively one level up the chain to a method of the same name. This includes a solution to the note from Chapter 4 about the weirdness of constructors not belonging to their class, and so being unrelated -- `super()` works inside constructors exactly as you'd expect.
- `class` literal syntax has no affordance for specifying properties (only methods). This might seem limiting to some, but it's expected that the vast majority of cases where a property (state) exists elsewhere but the end-chain "instances", this is usually a mistake and surprising (as it's state that's implicitly "shared" among all "instances"). So, one could say the class syntax is protecting you from mistakes.
- `extends` lets you extend even built-in object (sub)types, like `Array` or `RegExp`, in a very natural way. Doing so without `class .. extends` has long been an exceedingly complex and frustrating task, one that only the most adept of framework authors have ever been able to accurately tackle. Now, it will be rather trivial!

cons:
 - no real class mechanism
 - if function modified on parent class, modified for all new and old objects (delegation, not copy of functions)
 - cannot declare class member properties, must rely on prototype for that
 - super bound statically, at declaration time
 - "dynamic is too hard, let's pretend to be (but not actually be!) static".

## Types & grammar
### Types
Understanding types is important to understand coercion (conversion)
7 types : 
- null
- undefined
- boolean
- number
- string
- object
- symbol

All of these types except object are called "primitives".

The typeof operator inspects the type of the given value, and always returns one of seven string values -- surprisingly, there's not an exact 1-to-1 match with the seven built-in types we just listed.
- string
- undefined
- boolean
- number
- object
- symbol
- function

`typeof null` returns `'object'` (legacy bug kept for compatibility)

Functions are objects that as an internal [[Call]] property that allows it to be invoked.

The function object has a length property set to the number of formal parameters it is declared with.

In JavaScript, variables don't have types -- values have types. Variables can hold any value, at any time.

#### undefined vs "undeclared"

```javascript
var a;
 
a; // undefined
b; // ReferenceError: b is not defined
```
Here `b` is undeclared.
 
`typeof` has a safety guard for undeclared variables. Thus it can be used to safety check the existence of a variable:

```javascript
// oops, this would throw an error!
if (DEBUG) {
    console.log( "Debugging is starting" );
}
  
// this is a safe existence check
if (typeof DEBUG !== "undefined") {
    console.log( "Debugging is starting" );
}
```

### Arrays
- Don't need to presize arrays.
- Using `delete` on a array element will create an 'empty slot'. It will not update the length property.

#### Convert array-likes
- Pre-ES6: use `Array.prototype.slice.call`

```javascript
function foo() {
    var arr = Array.prototype.slice.call( arguments );
    arr.push( "bam" );
    console.log( arr );
}
 
foo( "bar", "baz" ); // ["bar","baz","bam"]
```

- ES6: use `Array.from`

```javascript
var arr = Array.from( arguments );
```

### Strings
A string is not an array of characters
Strings do have a shallow resemblance to arrays -- array-likes, as above -- for instance, both of them having a `length` property, an `indexOf(..)` method (array version only as of ES5), and a `concat(..)` method:

```javascript
var a = "foo";
var b = ["f","o","o"];
 
a.length;               // 3
b.length;               // 3
 
a.indexOf( "o" );           // 1
b.indexOf( "o" );           // 1
 
var c = a.concat( "bar" );      // "foobar"
var d = b.concat( ["b","a","r"] );  // ["f","o","o","b","a","r"]
 
a === c;                // false
b === d;                // false
 
a;                  // "foo"
b;                  // ["f","o","o"]
 
a[1] = "O";
b[1] = "O";
 
a; // "foo"
b; // ["f","O","o"]
```

Strings are immutable while arrays are quite mutable.
`a[1]` form is not always valid in JS (prefer `charAt(1)`)

Also, many of the array methods that could be helpful when dealing with strings are not actually available for them, but we can "borrow" non-mutation array methods against our string:

```javascript
a.join;         // undefined
a.map;          // undefined
 
var c = Array.prototype.join.call( a, "-" );
var d = Array.prototype.map.call( a, function(v){
    return v.toUpperCase() + ".";
} ).join( "" );
 
c;              // "f-o-o"
d;              // "F.O.O."
```

### Numbers
- This type includes both "integer" values and fractional decimal numbers (floating-point implementation)
- Very large or very small numbers will by default be outputted in exponent form, the same as the output of the `toExponential()` method
- the `toFixed(..)` method allows you to specify how many fractional decimal places you'd like the value to be represented with
- Beware the use of methods directly on literals : 

```javascript
// invalid syntax:
42.toFixed( 3 );    // SyntaxError because 42. = 42.0
 
// these are all valid:
(42).toFixed( 3 );  // "42.000"
0.42.toFixed( 3 );  // "0.420"
42..toFixed( 3 );   // "42.000"
42 .toFixed(3); // "42.000"
 
var onethousand = 1E3;              // means 1 * 10^3
var onemilliononehundredthousand = 1.1E6;   // means 1.1 * 10^6
 
0o363;      // octal for: 243
 
0b11110011; // binary for: 243
```

#### Small Decimal Values
The most (in)famous side effect of using binary floating-point numbers (which, remember, is true of all languages that use IEEE 754 -- not just JavaScript as many assume/pretend) is:

```javascript
0.1 + 0.2 === 0.3; // false
```

The most commonly accepted practice is to use a tiny "rounding error" value as the tolerance for comparison. This tiny value is often called "machine epsilon," which is commonly 2^-52 (2.220446049250313e-16) for the kind of numbers in JavaScript.

As of ES6, `Number.EPSILON` is predefined with this tolerance value, so you'd want to use it, but you can safely polyfill the definition for pre-ES6:
```javascript
if (!Number.EPSILON) {
    Number.EPSILON = Math.pow(2,-52);
}
 
function numbersCloseEnoughToEqual(n1,n2) {
    return Math.abs( n1 - n2 ) < Number.EPSILON;
}
 
var a = 0.1 + 0.2;
var b = 0.3;
 
numbersCloseEnoughToEqual( a, b );          // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 );  // false
```

##### Safe integer values
2^53 - 1
ES6 : `Number.MAX_SAFE_INTEGER` & `Number.MIN_SAFE_INTEGER`
64-bit numbers cannot be represented accurately with the number type, so must be stored in (and transmitted to/from) JavaScript using string representation

#### Testing for Integers
ES6 `Number.isInteger( .. )`

```javascript
Number.isInteger( 42 );     // true
Number.isInteger( 42.000 ); // true
Number.isInteger( 42.3 );   // false
```

To test if a value is a safe integer, use the ES6-specified `Number.isSafeInteger(..)`

```javascript
Number.isSafeInteger( Number.MAX_SAFE_INTEGER );    // true
Number.isSafeInteger( Math.pow( 2, 53 ) );      // false
Number.isSafeInteger( Math.pow( 2, 53 ) - 1 );      // true
```

#### 32-bit (Signed) Integers
While integers can range up to roughly 9 quadrillion safely (53 bits), there are some numeric operations (like the bitwise operators) that are only defined for 32-bit numbers, so the "safe range" for numbers used in that way must be much smaller.

The range then is `Math.pow(-2,31)` (-2147483648, about -2.1 billion) up to `Math.pow(2,31)-1` (2147483647, about +2.1 billion).

### Special Values
#### The Non-value Values
- `null` is an empty value
- `undefined` is a missing value
- `null` is a special keyword
- `undefined` is (unfortunately) an identifier

##### Undefined
In non-strict mode, it's actually possible (though incredibly ill-advised!) to assign a value to the globally provided undefined identifier.
In both non-strict mode and strict mode, however, you can create a local variable of the name `undefined`. But again, this is a terrible idea!

##### void Operator
Returns `undefined` whatever the right operand is
`void 0`, `void 1`, `void true` and `undefined`

In general, if there's ever a place where a value exists (from some expression) and you'd find it useful for the value to be undefined instead, use the void operator.

#### Special Numbers
##### The Not Number, Number
Any mathematic operation you perform without both operands being numbers (or values that can be interpreted as regular numbers in base 10 or base 16) will result in the operation failing to produce a valid number, in which case you will get the `NaN` value.
It would be much more accurate to think of `NaN` as being "invalid number," "failed number," or even "bad number," than to think of it as "not a number."

```javascript
var a = 2 / "foo";
 
a == NaN;   // false
a === NaN;  // false
```
 
How to test for NaN
```javascript
var a = 2 / "foo";
 
isNaN( a ); // true
 
// hold on ....
var c = 2 / "foo";
var b = "foo";
 
c; // NaN
b; // "foo"
 
window.isNaN( c ); // true
window.isNaN( b ); // true -- ouch!
```

##### Infinities
`Number.POSITIVE_INFINITY` and `Number.NEGATIVE_INFINITY`

```javascript
var a = 1 / 0;  // Infinity
var b = -1 / 0; // -Infinity
```

```javascript
var a = Number.MAX_VALUE;   // 1.7976931348623157e+308
a + a;                      // Infinity
a + Math.pow( 2, 970 );     // Infinity
a + Math.pow( 2, 969 );     // 1.7976931348623157e+308
```

According to the specification, if an operation like addition results in a value that's too big to represent, the IEEE 754 "round-to-nearest" mode specifies what the result should be. So, in a crude sense, `Number.MAX_VALUE + Math.pow( 2, 969 )` is closer to `Number.MAX_VALUE` than to Infinity, so it "rounds down," whereas `Number.MAX_VALUE + Math.pow( 2, 970 )` is closer to Infinity so it "rounds up".

Once you overflow to either one of the infinities, however, there's no going back. In other words, in an almost poetic sense, you can go from finite to infinite but not from infinite back to finite.

`Infinity / Infinity` is not a defined operation. In JS, this results in `NaN`

##### Zeros
JavaScript has both a normal zero 0 (otherwise known as a positive zero `+0`) and a negative zero `-0`
Addition and subtraction cannot result in a negative zero.
However, if you try to stringify a negative zero value, it will always be reported as "0", according to the spec.

```javascript
var a = 0;
var b = 0 / -3;
 
a == b;     // true
-0 == 0;    // true
 
a === b;    // true
-0 === 0;   // true
 
0 > -0;     // false
a > b;      // false
```

Now, why do we need a negative zero, besides academic trivia?

There are certain applications where developers use the magnitude of a value to represent one piece of information (like speed of movement per animation frame) and the sign of that number to represent another piece of information (like the direction of that movement).

In those applications, as one example, if a variable arrives at zero and it loses its sign, then you would lose the information of what direction it was moving in before it arrived at zero. Preserving the sign of the zero prevents potentially unwanted information loss.

##### Special equality
As of ES6, there's a new utility that can be used to test two values for absolute equality, without any of these exceptions. It's called Object.is(..):

```javascript
var a = 2 / "foo";
var b = -3 * 0;
 
Object.is( a, NaN );    // true
Object.is( b, -0 ); // true
Object.is( b, 0 );  // false
```

`Object.is(..)` probably shouldn't be used in cases where `==` or `===` are known to be safe (see Chapter 4 "Coercion"), as the operators are likely much more efficient and certainly are more idiomatic/common

##### Value vs reference
A reference in JS points at a (shared) value, so if you have 10 different references, they are all always distinct references to a single shared value; none of them are references/pointers to each other.

```javascript
var a = 2;
var b = a; // `b` is always a copy of the value in `a`
b++;
a; // 2
b; // 3
 
var c = [1,2,3];
var d = c; // `d` is a reference to the shared `[1,2,3]` value
d.push( 4 );
c; // [1,2,3,4]
d; // [1,2,3,4]
```

Simple values (aka scalar primitives) are always assigned/passed by value-copy: `null`, `undefined`, `string`, `number`, `boolean`, and ES6's `symbol`.

Compound values -- objects (including arrays, and all boxed object wrappers -- see Chapter 3) and functions -- always create a copy of the reference on assignment or passing.

```javascript
function foo(x) {
    x.push( 4 );
    x; // [1,2,3,4]
 
    // later
    x = [4,5,6];
    x.push( 7 );
    x; // [4,5,6,7]
}
 
var a = [1,2,3];
 
foo( a );
 
a; // [1,2,3,4]  not  [4,5,6,7]
```

```javascript
function foo(x) {
    x.push( 4 );
    x; // [1,2,3,4]
 
    // later
    x.length = 0; // empty existing array in-place
    x.push( 4, 5, 6, 7 );
    x; // [4,5,6,7]
}
 
var a = [1,2,3];
 
foo( a );
 
a; // [4,5,6,7]  not  [1,2,3,4]
```

To effectively pass a compound value (like an array) by value-copy, you need to manually make a copy of it, so that the reference passed doesn't still point to the original. For example `foo( a.slice() );`

References are not like references/pointers in other languages -- they're never pointed at other variables/references, only at the underlying values.

### Natives
- `String()`
- `Number()`
- `Boolean()`
- `Array()`
- `Object()`
- `Function()`
- `RegExp()`
- `Date()`
- `Error()`
- `Symbol()` -- added in ES6!

Natives can be used as a constructor, however, the result can be surprising :

```javascript
var a = new String( "abc" );
 
typeof a; // "object" ... not "String"
 
a instanceof String; // true
 
Object.prototype.toString.call( a ); // "[object String]"
```

#### Internal [[Class]]

Objects subtypes have an internal property [[Class]] (for classification). It can't be accessed directly but can be revealed with the function `Object.prototype.toString(..)`.

```javascript
// null and undefined primitives
Object.prototype.toString.call( null );     // "[object Null]"
Object.prototype.toString.call( undefined );  // "[object Undefined]"
 
 
// Other primitives are 'boxed'
Object.prototype.toString.call( "abc" );  // "[object String]"
Object.prototype.toString.call( 42 );   // "[object Number]"
Object.prototype.toString.call( true );   // "[object Boolean]"
```

#### Boxing wrappers
The object wrappers serve a very important purpose. Primitive values don't have properties or methods, so to access `.length` or `.toString()` you need an object wrapper around the value. Thankfully, JS will automatically box (aka wrap) the primitive value to fulfill such accesses.

##### Unboxing
Use the `valueOf()` method.

#### Natives as constructors
For array, object, function, and regular-expression values, it's almost universally preferred that you use the literal form for creating the values, but the literal form creates the same sort of object as the constructor form does (that is, there is no nonwrapped value).

```javascript
var a = new Array( 1, 2, 3 );
a; // [1, 2, 3]
 
var b = [1, 2, 3];
b; // [1, 2, 3]
```

-  The `Array(..)` constructor does not require the new keyword in front of it. If you omit it, it will behave as if you have used it anyway. So `Array(1,2,3)` is the same outcome as `new Array(1,2,3)`.
- The `Array` constructor has a special form where if only one number argument is passed, instead of providing that value as contents of the array, it's taken as a length to "presize the array" (well, sorta).
- Avoid creating arrays with empty slots. Internal functions behave differently. Not reliable.

#### Object(..), Function(..) and RegExp(..)
There's practically no reason to ever use the `new Object()` constructor form, especially since it forces you to add properties one-by-one instead of many at once in the object literal form.

The Function constructor is helpful only in the rarest of cases, where you need to dynamically define a function's parameters and/or its function body. Do not just treat `Function(..)` as an alternate form of `eval(..)`. You will almost never need to dynamically define a function in this way.

Regular expressions defined in the literal form `(/^a*b+/g)` are strongly preferred, not just for ease of syntax but for performance reasons -- the JS engine precompiles and caches them before code execution. Unlike the other constructor forms we've seen so far, `RegExp(..)` has some reasonable utility: to dynamically define the pattern for a regular expression.

#### Date(..)
The `Date(..)` and `Error(..)` native constructors are much more useful than the other natives, because there is no literal form for either.
To create a date object value, you must use `new Date()`. But an even easier way is to just call the static helper function defined as of ES5: `Date.now()`

#### Error(..)
The `Error(..)` constructor (much like `Array()` above) behaves the same with the new keyword present or omitted.
The main reason you'd want to create an error object is that it captures the current execution stack context into the object (in most JS engines, revealed as a read-only .stack property once constructed). This stack context includes the function call-stack and the line-number where the error object was created, which makes debugging that error much easier.

Technically, in addition to the general `Error(..)` native, there are several other specific-error-type natives: `EvalError(..)`, `RangeError(..)`, `ReferenceError(..)`, `SyntaxError(..)`, `TypeError(..)`, and `URIError(..)`. But it's very rare to manually use these specific error natives. They are automatically used if your program actually suffers from a real exception (such as referencing an undeclared variable and getting a `ReferenceError` error).

#### Symbol(..)
New as of ES6, an additional primitive value type has been added, called `Symbol`. Symbols are special "unique" (not strictly guaranteed!) values that can be used as properties on objects with little fear of any collision. They're primarily designed for special built-in behaviors of ES6 constructs, but you can also define your own symbols.

To define your own custom symbols, use the Symbol(..) native. The Symbol(..) native "constructor" is unique in that you're not allowed to use new with it, as doing so will throw an error.

While symbols are not actually private (Object.getOwnPropertySymbols(..) reflects on the object and reveals the symbols quite publicly), using them for private or special properties is likely their primary use-case. For most developers, they may take the place of property names with _ underscore prefixes, which are almost always by convention signals to say, "hey, this is a private/special/internal property, so leave it alone!"

#### Native prototypes
Each of the built-in native constructors has its own .prototype object -- Array.prototype, String.prototype, etc.
- String#indexOf(..): find the position in the string of another substring
- String#charAt(..): access the character at a position in the string
- String#substr(..), String#substring(..), and String#slice(..): extract a portion of the string as a new string
- String#toUpperCase() and String#toLowerCase(): create a new string that's converted to either uppercase or lowercase
- String#trim(): create a new string that's stripped of any trailing or leading whitespace
None of the methods modify the string in place. Modifications (like case conversion or trimming) create a new value from the existing value.

Prototypes As Defaults

```javascript
function isThisCool(vals,fn,rx) {
  vals = vals || Array.prototype;
  fn = fn || Function.prototype;
  rx = rx || RegExp.prototype;

  return rx.test(
    vals.map( fn ).join( "" )
  );
}

isThisCool();   // true

isThisCool(
  ["a","b","c"],
  function(v){ return v.toUpperCase(); },
  /D/
);  
```
Be careful if using Array.prototype as a default value. Changing this array value afterwards will also change the Array.prototype value !!!

### Coercion
JavaScript coercions always result in one of the scalar primitive (see Chapter 2) values, like string, number, or boolean
Note that "type coercion" is a runtime conversion for dynamically typed languages
"implicit coercion" vs. "explicit coercion."

```javascript
var a = 42;

var b = a + "";     // implicit coercion

var c = String( a );  // explicit coercion
```

#### Abstract Value Operations
##### ToString
Built-in primitive values have natural stringification: null becomes "null", undefined becomes "undefined" and true becomes "true". numbers are generally expressed in the natural way you'd expect, but as we discussed in Chapter 2, very small or very large numbers are represented in exponent form.
For regular objects, unless you specify your own, the default toString() (located in Object.prototype.toString()) will return the internal [[Class]] (see Chapter 3), like for instance "[object Object]".
But as shown earlier, if an object has its own toString() method on it, and you use that object in a string-like way, its toString() will automatically be called, and the string result of that call will be used instead.
Arrays have an overridden default toString() that stringifies as the (string) concatenation of all its values (each stringified themselves), with "," in between each value:

###### JSON Stringification
The JSON.stringify(..) utility will automatically omit undefined, function, and symbol values when it comes across them. If such a value is found in an array, that value is replaced by null (so that the array position information isn't altered). If found as a property of an object, that property will simply be excluded.

```javascript
JSON.stringify( undefined );          // undefined
JSON.stringify( function(){} );         // undefined

JSON.stringify( [1,undefined,function(){},4] ); // "[1,null,null,4]"
JSON.stringify( { a:2, b:function(){} } );    // "{"a":2}"
```
But if you try to JSON.stringify(..) an object with circular reference(s) in it, an error will be thrown.
JSON stringification has the special behavior that if an object value has a toJSON() method defined, this method will be called first to get a value to use for serialization.

```javascript
var o = { };

var a = {
  b: 42,
  c: o,
  d: function(){}
};

// create a circular reference inside `a`
o.e = a;

// would throw an error on the circular reference
// JSON.stringify( a );

// define a custom JSON value serialization
a.toJSON = function() {
  // only include the `b` property for serialization
  return { b: this.b };
};

JSON.stringify( a ); // "{"b":42}"
```
- An optional second argument can be passed to JSON.stringify(..) that is called replacer. This argument can either be an array or a function. It's used to customize the recursive serialization of an object by providing a filtering mechanism for which properties should and should not be included, in a similar way to how toJSON() can prepare a value for serialization.
If replacer is an array, it should be an array of strings, each of which will specify a property name that is allowed to be included in the serialization of the object. If a property exists that isn't in this list, it will be skipped.
If replacer is a function, it will be called once for the object itself, and then once for each property in the object, and each time is passed two arguments, key and value. To skip a key in the serialization, return undefined. Otherwise, return the value provided.
- A third optional argument can also be passed to JSON.stringify(..), called space, which is used as indentation for prettier human-friendly output. space can be a positive integer to indicate how many space characters should be used at each indentation level. Or, space can be a string, in which case up to the first ten characters of its value will be used for each indentation level.

##### ToNumber
- ToNumber for a string value essentially works for the most part like the rules/syntax for numeric literals (see Chapter 3). If it fails, the result is NaN
- Objects (and arrays) will first be converted to their primitive value equivalent, and the resulting value (if a primitive but not already a number) is coerced to a number according to the ToNumber rules just mentioned.
If valueOf() is available and it returns a primitive value, that value is used for the coercion. If not, but toString() is available, it will provide the value for the coercion.
If neither operation can provide a primitive value, a TypeError is thrown.

##### ToBoolean
First and foremost, JS has actual keywords true and false, and they behave exactly as you'd expect of boolean values. It's a common misconception that the values 1 and 0 are identical to true/false. While that may be true in other languages, in JS the numbers are numbers and the booleans are booleans. You can coerce 1 to true (and vice versa) or 0 to false (and vice versa). But they're not the same.

###### Falsy Values
All of JavaScript's values can be divided into two categories:
- values that will become false if coerced to boolean
- everything else (which will obviously become true)
Falsy values:
- undefined
- null
- false
- +0, -0, and NaN
- ""

###### Falsy Objects
A "falsy object" is a value that looks and acts like a normal object (properties, etc.), but when you coerce it to a boolean, it coerces to a false value.

#### Explicit Coercion
##### Strings <=> numbers
To coerce between strings and numbers, we use the built-in String(..) and Number(..) functions (which we referred to as "native constructors" in Chapter 3), but very importantly, we do not use the new keyword in front of them. As such, we're not creating object wrappers.

```javascript
var a = 42;
var b = String( a );

var c = "3.14";
var d = Number( c );

b; // "42"
d; // 3.14

var a = 42;
var b = a.toString();

var c = "3.14";
var d = +c; // Unary + operator, wich coerce its operand to a number

b; // "42"
d; // 3.14
```

###### Date To number
Another common usage of the unary + operator is to coerce a Date object into a number, because the result is the unix timestamp (milliseconds elapsed since 1 January 1970 00:00:00 UTC) representation of the date/time value:

###### ~
The ~ operator first "coerces" to a 32-bit number value, and then performs a bitwise negation (flipping each bit's parity).
Consider -(x+1). What's the only value that you can perform that operation on that will produce a 0 (or -0 technically!) result? -1. In other words, ~ used with a range of number values will produce a falsy (easily coercible to false) 0 value for the -1 input value, and any other truthy number otherwise.

Why is that relevant?

-1 is commonly called a "sentinel value," which basically means a value that's given an arbitrary semantic meaning within the greater set of values of its same type (numbers). The C-language uses -1 sentinel values for many functions that return >= 0 values for "success" and -1 for "failure."

JavaScript adopted this precedent when defining the string operation indexOf(..), which searches for a substring and if found returns its zero-based index position, or -1 if not found.

```javascript
var a = "Hello World";

// Weird tests
if (a.indexOf( "lo" ) >= 0) { // true
  // found it!
}
if (a.indexOf( "lo" ) != -1) {  // true
  // found it
}

if (a.indexOf( "ol" ) < 0) {  // true
  // not found!
}
if (a.indexOf( "ol" ) == -1) {  // true
  // not found!
}

// Nicer ones !!!
~a.indexOf( "lo" );     // -4   <-- truthy!

if (~a.indexOf( "lo" )) { // true
  // found it!
}

~a.indexOf( "ol" );     // 0    <-- falsy!
!~a.indexOf( "ol" );    // true

if (!~a.indexOf( "ol" )) {  // true
  // not found!
}
```
~ takes the return value of indexOf(..) and transforms it: for the "failure" -1 we get the falsy 0, and every other value is truthy.

There's one more place ~ may show up in code you run across: some developers use the double tilde ~~ to truncate the decimal part of a number (i.e., "coerce" it to a whole number "integer"). It's commonly (though mistakingly) said this is the same result as calling Math.floor(..).

How ~~ works is that the first ~ applies the ToInt32 "coercion" and does the bitwise flip, and then the second ~ does another bitwise flip, flipping all the bits back to the original state. The end result is just the ToInt32 "coercion" (aka truncation).
Setting the Math.floor(..) difference aside, `~~x` can truncate to a (32-bit) integer. But so does x | 0, and seemingly with (slightly) less effort.

##### Explicitly: Parsing Numeric Strings
Parsing a numeric value out of a string is tolerant of non-numeric characters -- it just stops parsing left-to-right when encountered -- whereas coercion is not tolerant and fails resulting in the NaN value.

```javascript
var a = "42";
var b = "42px";

Number( a );  // 42
parseInt( a );  // 42

Number( b );  // NaN
parseInt( b );  // 42
```
If you pass a non-string, the value you pass will automatically be coerced to a string first (see "ToString" earlier), which would clearly be a kind of hidden implicit coercion. It's a really bad idea to rely upon such a behavior in your program, so never use parseInt(..) with a non-string value.

Prior to ES5, another gotcha existed with parseInt(..), which was the source of many JS programs' bugs. If you didn't pass a second argument to indicate which numeric base (aka radix) to use for interpreting the numeric string contents, parseInt(..) would look at the beginning character(s) to make a guess.

###### Parsing Non-Strings

```javascript
parseInt( 0.000008 );   // 0   ("0" from "0.000008")
parseInt( 0.0000008 );    // 8   ("8" from "8e-7")
parseInt( false, 16 );    // 250 ("fa" from "false")
parseInt( parseInt, 16 ); // 15  ("f" from "function..")

parseInt( "0x10" );     // 16
parseInt( "103", 2 );   // 2
```

##### Everything => Boolean
While Boolean(..) is clearly explicit, it's not at all common or idiomatic.

Just like the unary + operator coerces a value to a number (see above), the unary ! negate operator explicitly coerces a value to a boolean. The problem is that it also flips the value from truthy to falsy or vice versa. So, the most common way JS developers explicitly coerce to boolean is to use the !! double-negate operator, because the second ! will flip the parity back to the original
Can be used in a boolean context such as an if (..) .. statement

#### Implicit Coercion
Implicit coercion refers to type conversions that are hidden, with non-obvious side-effects that implicitly occur from other actions. In other words, implicit coercions are any type conversions that aren't obvious (to you).

Let's define the goal of implicit coercion as: to reduce verbosity, boilerplate, and/or unnecessary implementation detail that clutters up our code with noise that distracts from the more important intent.

##### Strings <--> Numbers
The + operator is overloaded to serve the purposes of both number addition and string concatenation. So how does JS know which type of operation you want to use? Consider:

```javascript
var a = "42";
var b = "0";

var c = 42;
var d = 0;

a + b; // "420"
c + d; // 42
```
If either operand to + is a string (or becomes one with valueOf() chained with toString()), the operation will be string concatenation. Otherwise, it's always numeric addition.

##### Booleans --> Numbers
Implicit coercion can really shine is in simplifying certain types of complicated boolean logic into simple numeric addition. Of course, this is not a general-purpose technique, but a specific solution for specific cases.

```javascript
function onlyOne(a,b,c) {
  return !!((a && !b && !c) ||
    (!a && b && !c) || (!a && !b && c));
}

var a = true;
var b = false;

onlyOne( a, b, b ); // true
onlyOne( b, a, b ); // true

onlyOne( a, b, a ); // false


function betterOnlyOne() {
  var sum = 0;
  for (var i=0; i < arguments.length; i++) {
    // skip falsy values. same as treating
    // them as 0's, but avoids NaN's.
    if (arguments[i]) {
      sum += arguments[i];
    }
  }
  return sum == 1;
}

var a = true;
var b = false;

betterOnlyOne( b, a );    // true
betterOnlyOne( b, a, b, b, b ); // true

betterOnlyOne( b, b );    // false
betterOnlyOne( b, a, b, b, b, a );  // false
```

##### * --> Boolean
Sort of expression operations that require/force (implicitly) a boolean coercion:
- The test expression in an if (..) statement.
- The test expression (second clause) in a for ( .. ; .. ; .. ) header.
- The test expression in while (..) and do..while(..) loops.
- The test expression (first clause) in ? : ternary expressions.
- The left-hand operand (which serves as a test expression -- see below!) to the || ("logical or") and && ("logical and") operators.

#### Operators || and &&
Call them "operand selector operators." Because they result in the value of one (and only one) of their two operands. In other words, they select one of the two operand's values.

```javascript
var a = 42;
var b = "abc";
var c = null;

a || b;   // 42
a && b;   // "abc"

c || b;   // "abc"
c && b;   // null
```
Process : 
1. Both || and && operators perform a boolean test on the first operand (a or c). If the operand is not already boolean (as it's not, here), a normal ToBoolean coercion occurs, so that the test can be performed.
2. For the || operator, if the test is true, the || expression results in the value of the first operand (a or c). If the test is false, the || expression results in the value of the second operand (b).
3. Inversely, for the && operator, if the test is true, the && expression results in the value of the second operand (b). If the test is false, the && expression results in the value of the first operand (a or c).

#### Symbol Coercion
Explicit coercion of a symbol to a string is allowed, but implicit coercion of the same is disallowed and throws an error.
Symbol values cannot coerce to number at all (throws an error either way), but strangely they can both explicitly and implicitly coerce to boolean (always true).

```javascript
var s1 = Symbol( "cool" );
String( s1 );         // "Symbol(cool)"

var s2 = Symbol( "not cool" );
s2 + "";  
```

#### Loose Equals vs. Strict Equals
The correct description is: "== allows coercion in the equality comparison and === disallows coercion."
The implication here then is that both == and === check the types of their operands. The difference is in how they respond if the types don't match.



##### Abstract equality
The == operator's behavior is defined as "The Abstract Equality Comparison Algorithm"
1. Basically, the first clause (11.9.3.1) says, if the two values being compared are of the same type, they are simply and naturally compared via Identity as you'd expect. For example, 42 is only equal to 42, and "abc" is only equal to "abc".
Some minor exceptions to normal expectation to be aware of:
- NaN is never equal to itself (see Chapter 2)
- +0 and -0 are equal to each other (see Chapter 2)
2. The final provision in clause 11.9.3.1 is for == (but same for === !!!) loose equality comparison with objects (including functions and arrays). Two such values are only equal if they are both references to the exact same value. No coercion occurs here.

###### Comparing: strings to numbers
4. If Type(x) is Number and Type(y) is String, return the result of the comparison x == ToNumber(y).
5. If Type(x) is String and Type(y) is Number, return the result of the comparison ToNumber(x) == y.

###### Comparing: anything to boolean
6. If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
7. If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).

```javascript
var a = "42";

// bad (will fail!):
if (a == true) {
  // ..
}

// also bad (will fail!):
if (a === true) {
  // ..
}

// good enough (works implicitly):
if (a) {
  // ..
}

// better (works explicitly):
if (!!a) {
  // ..
}

// also great (works explicitly):
if (Boolean( a )) {
  // ..
}
```
If you avoid ever using == true or == false (aka loose equality with booleans) in your code, you'll never have to worry about this truthiness/falsiness mental gotcha.

###### Comparing: nulls to undefineds
2. If x is null and y is undefined, return true.
3. If x is undefined and y is null, return true.

The coercion between null and undefined is safe and predictable, and no other values can give false positives in such a check. I recommend using this coercion to allow null and undefined to be indistinguishable and thus treated as the same value.

```javascript
// Good !!!
var a = doSomething();

if (a == null) {
  // ..
}

// Bad !!!
var a = doSomething();

if (a === undefined || a === null) {
  // ..
}
```

###### Comparing: objects to non-objects
8. If Type(x) is either String or Number and Type(y) is Object, return the result of the comparison x == ToPrimitive(y).
9. If Type(x) is Object and Type(y) is either String or Number, return the result of the comparison ToPrimitive(x) == y.


###### Edge Cases
7 "bad" cases

```javascript
"0" == false;     // true -- UH OH!
false == 0;       // true -- UH OH!
false == "";      // true -- UH OH!
false == [];      // true -- UH OH!
"" == 0;        // true -- UH OH!
"" == [];       // true -- UH OH!
0 == [];        // true -- UH OH!
```

###### Safely Using Implicit Coercion
1. If either side of the comparison can have true or false values, don't ever, EVER use ==.
2. If either side of the comparison can have [], "", or 0 values, seriously consider not using ==.
3. Use of typeof. typeof is always going to return you one of seven strings (see Chapter 1), and none of them are the empty "" string

##### Abstract Relational Comparison
The algorithm divides itself into two parts: what to do if the comparison involves both string values (second half), or anything else (first half).
1. The algorithm first calls ToPrimitive coercion on both values, and if the return result of either call is not a string, then both values are coerced to number values using the ToNumber operation rules, and compared numerically.

```javascript
var a = [ 42 ];
var b = [ "43" ];

a < b;  // true
b < a;  // false
```

2. However, if both values are strings for the < comparison, simple lexicographic (natural alphabetic) comparison on the characters is performed:

```javascript
var a = [ "42" ];
var b = [ "043" ];

a < b;  // false
```
a and b are not coerced to numbers, because both of them end up as strings after the ToPrimitive coercion on the two arrays. So, "42" is compared character by character to "043", starting with the first characters "4" and "0", respectively. Since "0" is lexicographically less than than "4", the comparison returns false.

```javascript
var a = { b: 42 };
var b = { b: 43 };

a < b;  // ??
```
a < b is also false, because a becomes [object Object] and b becomes [object Object], and so clearly a is not lexicographically less than b.

#### Other oerators
- The != loose not-equality operation is defined exactly as you'd expect, in that it's literally the == operation comparison performed in its entirety, then the negation of the result. The same goes for the !== strict not-equality operation.
- The spec says for a <= b, it will actually evaluate b < a first, and then negate that result. Since b < a is also false, the result of a <= b is true.
That's probably awfully contrary to how you might have explained what <= does up to now, which would likely have been the literal: "less than or equal to." JS more accurately considers <= as "not greater than" (!(a > b), which JS treats as !(b < a)). Moreover, a >= b is explained by first considering it as b <= a, and then applying the same reasoning.

### Grammar
#### Statements & expressions
Statements are sentences, expressions are phrases, and operators are conjunctions/punctuation.

```javascript
var a = 3 * 6;
var b = a;
b;
```

In this snippet, 3 * 6 is an expression (evaluates to the value 18). But a on the second line is also an expression, as is b on the third line. The a and b expressions both evaluate to the values stored in those variables at that moment, which also happens to be 18.

Moreover, each of the three lines is a statement containing expressions. var a = 3 * 6 and var b = a are called "declaration statements" because they each declare a variable (and optionally assign a value to it). The a = 3 * 6 and b = a assignments (minus the vars) are called assignment expressions.

The third line contains just the expression b, but it's also a statement all by itself (though not a terribly interesting one!). This is generally referred to as an "expression statement."

##### Statement Completion Values
- var statement itself results in undefined
- proposal for ES7 called "do expression." to retrieve an assignment statement completion value

##### Expression Side Effects
- The expression a++ has two separate behaviors. First, it returns the current value of a, which is 42 (which then gets assigned to b). But next, it changes the value of a itself, incrementing it by one.
- The result value of the delete operator is true if the requested operation is valid/allowable, or false otherwise. But the side effect of the operator is that it removes the property (or array slot).
- =. It may not seem like = in a = 42 is a side-effecting operator for the expression. But if we examine the result value of the a = 42 statement, it's the value that was just assigned (42), so the assignment of that same value into a is essentially a side effect.
Example of use:

```javascript
function vowels(str) {
  var matches;

  if (str) {
    // pull out all the vowels
    matches = str.match( /[aeiou]/g );

    if (matches) {
      return matches;
    }
  }
}

// Can be simplified as 
function vowels(str) {
  var matches;

  // pull out all the vowels
  if (str && (matches = str.match( /[aeiou]/g ))) {
    return matches;
  }
}

vowels( "Hello World" ); // ["e","o","o"]
```

##### Contextual Rules
###### { .. } Curly Braces
There's two main places (and more coming as JS evolves!) that a pair of { .. } curly braces will show up in your code. Let's take a look at each of them.
- Object literals

```javascript

var a = {
  foo: bar()
};

// What happens if we remove the var a = part of the above snippet?
{
    foo: bar()
}
```

- Labels
Here, { .. } is just a regular code block. It's because of a little known (and, frankly, discouraged) feature in JavaScript called "labeled statements." foo is a label for the statement bar() (which has omitted its trailing ;)

```javascript
// `foo` labeled-loop
foo: for (var i=0; i<4; i++) {
  for (var j=0; j<4; j++) {
    if ((i * j) >= 3) {
      console.log( "stopping!", i, j );
      // break out of the `foo` labeled loop
      break foo;
    }

    console.log( i, j );
  }
}
// 0 0
// 0 1
// 0 2
// 0 3
// 1 0
// 1 1
// 1 2
// stopping! 1 3
```

A label can apply to a non-loop block, but only break can reference such a non-loop label. You can do a labeled break ___ out of any labeled block, but you cannot continue ___ a non-loop label, nor can you do a non-labeled break out of a block.

```javascript
function foo() {
  // `bar` labeled-block
  bar: {
    console.log( "Hello" );
    break bar;
    console.log( "never runs" );
  }
  console.log( "World" );
}

foo();
// Hello
// World
```

- Blocks
```javascript
[] + {}; // "[object Object]"
{} + []; // 0
```
On the first line, `{}` 

- Object Destructuring
```javascript
var { a, b } = getData();
```
Object destructuring with a { .. } pair can also be used for named function arguments, which is sugar for this same sort of implicit object property assignment:

```javascript
function foo({ a, b, c }) {
  // no need for:
  // var a = obj.a, b = obj.b, c = obj.c
  console.log( a, b, c );
}

foo( {
  c: [1,2,3],
  a: 42,
  b: "foo"
} );  // 42 "foo" [1, 2, 3]
```


##### Operator Precedence
In general, operators are either left-associative or right-associative, referring to whether grouping happens from the left or from the right.
It's important to note that associativity is not the same thing as left-to-right or right-to-left processing.
If hypothetically && was right-associative, it would be processed the same as if you manually used ( ) to create grouping like a && (b && c). But that still doesn't mean that c would be processed before b. Right-associativity does not mean right-to-left evaluation, it means right-to-left grouping. Either way, regardless of the grouping/associativity, the strict ordering of evaluation will be a, then b, then c (aka left-to-right).

link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

<table>
 <tbody>
  <tr>
   <th>Precedence</th>
   <th>Operator type</th>
   <th>Associativity</th>
   <th>Individual operators</th>
  </tr>
  <tr>
   <td>20</td>
   <td><code>Grouping</code></td>
   <td>n/a</td>
   <td><code>( … )</code></td>
  </tr>
  <tr>
   <td colspan="1" rowspan="4">19</td>
   <td><code>Member Access</code></td>
   <td>left-to-right</td>
   <td><code>… . …</code></td>
  </tr>
  <tr>
   <td><code>Computed Member Access</code></td>
   <td>left-to-right</td>
   <td><code>… [ … ]</code></td>
  </tr>
  <tr>
   <td><code>new</code> (with argument list)</td>
   <td>n/a</td>
   <td><code>new … ( … )</code></td>
  </tr>
  <tr>
   <td>Function Call</td>
   <td>left-to-right</td>
   <td><code>… (&nbsp;<var>…&nbsp;</var>)</code></td>
  </tr>
  <tr>
   <td rowspan="1">18</td>
   <td><code>new</code>&nbsp;(without argument list)</td>
   <td>right-to-left</td>
   <td><code>new …</code></td>
  </tr>
  <tr>
   <td rowspan="2">17</td>
   <td><code>Postfix Increment</code></td>
   <td>n/a</td>
   <td><code>… ++</code></td>
  </tr>
  <tr>
   <td><code>Postfix Decrement</code></td>
   <td>n/a</td>
   <td><code>… --</code></td>
  </tr>
  <tr>
   <td rowspan="9">16</td>
   <td>Logical NOT</td>
   <td>right-to-left</td>
   <td><code>! …</code></td>
  </tr>
  <tr>
   <td>Bitwise NOT</td>
   <td>right-to-left</td>
   <td><code>~ …</code></td>
  </tr>
  <tr>
   <td>Unary Plus</td>
   <td>right-to-left</td>
   <td><code>+ …</code></td>
  </tr>
  <tr>
   <td>Unary Negation</td>
   <td>right-to-left</td>
   <td><code>- …</code></td>
  </tr>
  <tr>
   <td>Prefix Increment</td>
   <td>right-to-left</td>
   <td><code>++ …</code></td>
  </tr>
  <tr>
   <td>Prefix Decrement</td>
   <td>right-to-left</td>
   <td><code>-- …</code></td>
  </tr>
  <tr>
   <td>typeof</td>
   <td>right-to-left</td>
   <td><code>typeof …</code></td>
  </tr>
  <tr>
   <td>void</td>
   <td>right-to-left</td>
   <td><code>void …</code></td>
  </tr>
  <tr>
   <td>delete</td>
   <td>right-to-left</td>
   <td><code>delete …</code></td>
  </tr>
  <tr>
   <td>15</td>
   <td>Exponentiation</td>
   <td>right-to-left</td>
   <td><code>… ** …</code></td>
  </tr>
  <tr>
   <td rowspan="3">14</td>
   <td>Multiplication</td>
   <td>left-to-right</td>
   <td><code>… *&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Division</td>
   <td>left-to-right</td>
   <td><code>… /&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Remainder</td>
   <td>left-to-right</td>
   <td><code>… %&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="2">13</td>
   <td>Addition</td>
   <td>left-to-right</td>
   <td><code>… +&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Subtraction</td>
   <td>left-to-right</td>
   <td><code>… -&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="3">12</td>
   <td>Bitwise Left Shift</td>
   <td>left-to-right</td>
   <td><code>… &lt;&lt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Bitwise Right Shift</td>
   <td>left-to-right</td>
   <td><code>… &gt;&gt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Bitwise Unsigned Right Shift</td>
   <td>left-to-right</td>
   <td><code>… &gt;&gt;&gt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="6">11</td>
   <td>Less Than</td>
   <td>left-to-right</td>
   <td><code>… &lt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Less Than Or Equal</td>
   <td>left-to-right</td>
   <td><code>… &lt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Greater Than</td>
   <td>left-to-right</td>
   <td><code>… &gt;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Greater Than Or Equal</td>
   <td>left-to-right</td>
   <td><code>… &gt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td>in</td>
   <td>left-to-right</td>
   <td><code>… in&nbsp;…</code></td>
  </tr>
  <tr>
   <td>instanceof</td>
   <td>left-to-right</td>
   <td><code>… instanceof&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="4">10</td>
   <td>Equality</td>
   <td>left-to-right</td>
   <td><code>… ==&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Inequality</td>
   <td>left-to-right</td>
   <td><code>… !=&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Strict Equality</td>
   <td>left-to-right</td>
   <td><code>… ===&nbsp;…</code></td>
  </tr>
  <tr>
   <td>Strict Inequality</td>
   <td>left-to-right</td>
   <td><code>… !==&nbsp;…</code></td>
  </tr>
  <tr>
   <td>9</td>
   <td>Bitwise AND</td>
   <td>left-to-right</td>
   <td><code>… &amp;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>8</td>
   <td>Bitwise XOR</td>
   <td>left-to-right</td>
   <td><code>… ^&nbsp;…</code></td>
  </tr>
  <tr>
   <td>7</td>
   <td>Bitwise OR</td>
   <td>left-to-right</td>
   <td><code>… |&nbsp;…</code></td>
  </tr>
  <tr>
   <td>6</td>
   <td>Logical AND</td>
   <td>left-to-right</td>
   <td><code>… &amp;&amp;&nbsp;…</code></td>
  </tr>
  <tr>
   <td>5</td>
   <td>Logical OR</td>
   <td>left-to-right</td>
   <td><code>… ||&nbsp;…</code></td>
  </tr>
  <tr>
   <td>4</td>
   <td>Conditional</td>
   <td>right-to-left</td>
   <td><code>… ? … : …</code></td>
  </tr>
  <tr>
   <td rowspan="13">3</td>
   <td rowspan="13">Assignment</td>
   <td rowspan="13">right-to-left</td>
   <td><code>… =&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… +=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… -=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… **=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… *=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… /=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… %=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &lt;&lt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &gt;&gt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &gt;&gt;&gt;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… &amp;=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… ^=&nbsp;…</code></td>
  </tr>
  <tr>
   <td><code>… |=&nbsp;…</code></td>
  </tr>
  <tr>
   <td rowspan="2">2</td>
   <td>yield</td>
   <td>right-to-left</td>
   <td><code>yield&nbsp;…</code></td>
  </tr>
  <tr>
   <td>yield*</td>
   <td>right-to-left</td>
   <td><code>yield*&nbsp;…</code></td>
  </tr>
  <tr>
   <td>1</td>
   <td>Spread</td>
   <td>n/a</td>
   <td><code>...</code>&nbsp;…</td>
  </tr>
  <tr>
   <td>0</td>
   <td>Comma / Sequence</td>
   <td>left-to-right</td>
   <td><code>… ,&nbsp;…</code></td>
  </tr>
 </tbody>
</table>

###### Short circuited
For both && and || operators, the right-hand operand will not be evaluated if the left-hand operand is sufficient to determine the outcome of the operation. Hence, the name "short circuited" (in that if possible, it will take an early shortcut out).

##### Automatic Semicolon Insertion (ASI)
ASI (Automatic Semicolon Insertion) is a parser-error-correction mechanism built into the JS engine.

##### Errors
- Using variables too early : ES6 defines a (frankly confusingly named) new concept called the TDZ ("Temporal Dead Zone")
```javascript
{
  a = 2;    // ReferenceError!
  let a;
}
```

#### try..finally

```javascript
function foo() {
  try {
    return 42;
  }
  finally {
    console.log( "Hello" );
  }

  console.log( "never runs" );
}

console.log( foo() );
// Hello
// 42
```
- Return statement in a try block will be executed before the finally block, setting up the englobing function completion value. But the finally block will be executed before the completion value is returned back.
- A return inside a finally has the special ability to override a previous return from the try or catch clause, but only if return is explicitly called

#### switch
The matching mechanism on each case expression is identical to the === algorithm.
To use a coercive equality : 
```javascript
var a = "42";

switch (true) {
  case a == 10:
    console.log( "10 or '10'" );
    break;
  case a == 42:
    console.log( "42 or '42'" );
    break;
  default:
    // never gets here
}
// 42 or '42'
```

#### How to code on legacy environmnents
- Never extend native prototypes
- Shim (compliance tested), polyfill (existence checked) or transpile (babel, traceur)

## Async & performance
### Event Loop
Until recently (ES6)? JavaScript itself has actually never had any direct notion of asynchrony built into it.

What!? That seems like a crazy claim, right? In fact, it's quite true. The JS engine itself has never done anything more than execute a single chunk of your program at any given moment, when asked to.

It's important to note that setTimeout(..) doesn't put your callback on the event loop queue. What it does is set up a timer; when the timer expires, the environment places your callback into the event loop, such that some future tick will pick it up and execute it.

### Parallel Threading
JavaScript never shares data across threads
#### Run to completion
Because of JavaScript's single-threading, the code inside of a function is atomic. This means that once the function code starts running, the entirety of its code will finish before any of other functions code can run.

#### Concurrency
Event Loop Queue:
```
onscroll, request 1   <--- Process 1 starts
onscroll, request 2
response 1            <--- Process 2 starts
onscroll, request 3
response 2
response 3
onscroll, request 4
onscroll, request 5
onscroll, request 6
response 4
onscroll, request 7   <--- Process 1 finishes
response 6
response 5
response 7            <--- Process 2 finishes
```


"Process 1" and "Process 2" run concurrently (task-level parallel), but their individual events run sequentially on the event loop queue.

#### Noninteracting
As two or more "processes" are interleaving their steps/events concurrently within the same program, they don't necessarily need to interact with each other if the tasks are unrelated (no race conditions). If they don't interact, nondeterminism is perfectly acceptable.

#### Interaction
More commonly, concurrent "processes" will by necessity interact, indirectly through scope and/or the DOM. When such interaction will occur, you need to coordinate these interactions to prevent "race conditions," as described earlier.

Use concurrency interaction conditions:

```javascript
// Condition the result assignment
function response(data) {
  if (data.url == "http://some.url.1") {
    res[0] = data;
  }
  else if (data.url == "http://some.url.2") {
    res[1] = data;
  }
}

// Condition a function call
function foo(x) {
  a = x * 2;
  if (a && b) {
    baz();
  }
}

// Condition the response function
function foo(x) {
  if (a == undefined) {
    a = x * 2;
    baz();
  }
}
```

#### Cooperation
Another expression of concurrency coordination is called "cooperative concurrency." Here, the focus isn't so much on interacting via value sharing in scopes (though that's obviously still allowed!). The goal is to take a long-running "process" and break it up into steps or batches so that other concurrent "processes" have a chance to interleave their operations into the event loop queue.

For example : buffering a response to avoid single-thread process allocation & event-loop blocking

```javascript
var res = [];

// `response(..)` receives array of results from the Ajax call
function response(data) {
  // let's just do 1000 at a time
  var chunk = data.splice( 0, 1000 );

  // add onto existing `res` array
  res = res.concat(
    // make a new transformed array with all `chunk` values doubled
    chunk.map( function(val){
      return val * 2;
    } )
  );

  // anything left to process?
  if (data.length > 0) {
    // async schedule next batch
    setTimeout( function(){
      response( data );
    }, 0 );
  }
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", response );
ajax( "http://some.url.2", response );
```

### Jobs
As of ES6, there's a new concept layered on top of the event loop queue, called the "Job queue." The most likely exposure you'll have to it is with the asynchronous behavior of Promises.
So, the best way to think about this that I've found is that the "Job queue" is a queue hanging off the end of every tick in the event loop queue. Certain async-implied actions that may occur during a tick of the event loop will not cause a whole new event to be added to the event loop queue, but will instead add an item (aka Job) to the end of the current tick's Job queue.
Jobs are kind of like the spirit of the setTimeout(..0) hack, but implemented in such a way as to have a much more well-defined and guaranteed ordering: later, but as soon as possible.

```javascript
console.log( "A" );

setTimeout( function(){
  console.log( "B" );
}, 0 );

// theoretical "Job API"
schedule( function(){
  console.log( "C" );

  schedule( function(){
    console.log( "D" );
  } );
} );
```

You might expect this to print out A B C D, but instead it would print out A C D B, because the Jobs happen at the end of the current event loop tick, and the timer fires to schedule for the next event loop tick (if available!).

### Callbacks
The callback function wraps or encapsulates the continuation of the program.

```javascript
// A
setTimeout( function(){
  // C
}, 1000 );
// B
```
"Do A, setup the timeout for 1,000 milliseconds, then do B, then after the timeout fires, do C."
However that description is deficient in explaining this code in a way that matches our brains to the code, and the code to the JS engine. The disconnect is both subtle and monumental, and is at the very heart of understanding the shortcomings of callbacks as async expression and management.

#### Nested/Chained Callbacks
Callback hell is not really related to nesting issues but rather related to code linear reading, keeping in mind that some chunks of code will be executed later.
Steps sequence has to be harcoded within the callback responses.
How to properly handle errors & failures?

The brittle nature of manually hardcoded callbacks (even with hardcoded error handling) is often far less graceful. Once you end up specifying (aka pre-planning) all the various eventualities/paths, the code becomes so convoluted that it's hard to ever maintain or update it.
That is what "callback hell" is all about! The nesting/indentation are basically a side show, a red herring.
Furthermore, what about parallel callbacks, gates etc...

#### Trust issues
Callback are often used as an inversion of control (IOC) mechanism that allow to run third party code / libraries.
Example of issues : 
- Call the callback too early (before it's been tracked)
- Call the callback too late (or never)
- Call the callback too few or too many times (like the problem you encountered!)
- Fail to pass along any necessary environment/parameters to your callback
- Swallow any errors/exceptions that may happen
- ...

#### Trying to Save Callbacks
- split callbacks (one for the success notification, one for the error notification)
- "error-first style", where the first argument of a single callback is reserved for an error object (if any). If success, this argument will be empty/falsy and any subsequent arguments will be the success data.. If an error is signaled, this argument is set/truthy

What about those issues : 
- Call the callback too early (before it's been tracked)
- Call the callback too late (or never)
- Call the callback too few or too many times (like the problem you encountered!)

Beware of zalgo functions (not predictable : synchronous or asynchronous ?) 
https://oren.github.io/blog/zalgo.html
- So when you write a function that accept a callback, make sure your function always sync or always async. don't mix the two.

```javascript
// don't do ...
if (errors.length) {
    return callback(null, errors);
}

// ... instead to :
if (errors.length) {
  process.nextTick(function() {
    callback(null, errors);
  });
  return;
}
```

### Promises
Callbacks: lack of sequentiality and lack of trustability.
Promises: uninvert the inversion of control. "here's what happens later, after the current step finishes."
Promises uses the Job queue, which is executed after the current event and before the next one in the event-loop.

#### Future value

Once a Promise is resolved, it stays that way forever -- it becomes an immutable value at that point -- and can then be observed as many times as necessary

#### Completion event
Return a listener object from a function, that will fire 'completion' or 'failure' events. Callback functions used as IOC pattern. Inversion of inversion of control => uninversion of control. Control is restored back to the calling code.

Uninversion of control enables a nicer separation of concerns :

```javascript
var evt = foo( 42 );

evt.on( "completion", function(){
  // now we can do the next step!
} );

evt.on( "failure", function(err){
  // oops, something went wrong in `foo(..)`
} );


// let `bar(..)` listen to `foo(..)`'s completion
bar( evt );

// also, let `baz(..)` listen to `foo(..)`'s completion
baz( evt );
```

#### Promise "Events"

```javascript
new Promise( function(resolve,reject){
    // eventually, call `resolve(..)` or `reject(..)`,
    // which are the resolution callbacks for
    // the promise.
  } );
```
Whenever a promise is resolved, its next step will always be the same, both now and later.

#### Thenable Duck Typing
It was decided that the way to recognize a Promise (or something that behaves like a Promise) would be to define something called a "thenable" as any object or function which has a then(..) method on it. It is assumed that any such value is a Promise-conforming thenable.

```javascript
if (
  p !== null &&
  (
    typeof p === "object" ||
    typeof p === "function"
  ) &&
  typeof p.then === "function"
) {
  // assume it's a thenable!
}
else {
  // not a thenable
}
```

If you try to fulfill a Promise with any object/function value that happens to have a then(..) function on it, but you weren't intending it to be treated as a Promise/thenable, you're out of luck, because it will automatically be recognized as thenable and treated with special rules (see later in the chapter).

```javascript
var o = { then: function(){} };

// make `v` be `[[Prototype]]`-linked to `o`
var v = Object.create( o );

v.someStuff = "cool";
v.otherStuff = "not so cool";

v.hasOwnProperty( "then" );   // false
```

#### Promise Trust
##### Calling Too Early
This is a concern of whether code can introduce Zalgo-like effects (see Chapter 2), where sometimes a task finishes synchronously and sometimes asynchronously, which can lead to race conditions.
Promises by definition cannot be susceptible to this concern, because even an immediately fulfilled Promise (like new Promise(function(resolve){ resolve(42); })) cannot be observed synchronously (Job queue VS event queue).

##### Calling Too Late
Similar to the previous point, a Promise's then(..) registered observation callbacks are automatically scheduled when either resolve(..) or reject(..) are called by the Promise creation capability. Those scheduled callbacks will predictably be fired at the next asynchronous moment.

```javascript
p.then( function(){
  p.then( function(){
    console.log( "C" );
  } );
  console.log( "A" );
} );
p.then( function(){
  console.log( "B" );
} );
// A B C
```


##### Never Calling the Callback
First, nothing (not even a JS error) can prevent a Promise from notifying you of its resolution (if it's resolved). If you register both fulfillment and rejection callbacks for a Promise, and the Promise gets resolved, one of the two callbacks will always be called.

But what if the Promise itself never gets resolved either way? Even that is a condition that Promises provide an answer for, using a higher level abstraction called a "race" (`Promise.race(<iterable>)`).

##### Calling Too Few or Too Many Times
The "too many" case is easy to explain. Promises are defined so that they can only be resolved once. If for some reason the Promise creation code tries to call resolve(..) or reject(..) multiple times, or tries to call both, the Promise will accept only the first resolution, and will silently ignore any subsequent attempts.
Because a Promise can only be resolved once, any then(..) registered callbacks will only ever be called once (each).

##### Failing to Pass Along Any Parameters/Environment
If you don't explicitly resolve with a value either way, the value is undefined, as is typical in JS. But whatever the value, it will always be passed to all registered (and appropriate: fulfillment or rejection) callbacks, either now or in the future.

##### Swallowing Any Errors/Exceptions
Cannot catch an error in the fulfilled callback IN the same then context rejected callback. It would violate the fundamental principle that Promises are immutable once resolved. Chaining a new `then` clause would allow us to handle that new rejected callback


##### Trustable Promise?
If you pass an immediate, non-Promise, non-thenable value to Promise.resolve(..), you get a promise that's fulfilled with that value. 

##### Trust build
Promises are a pattern that augments callbacks with trustable semantics, so that the behavior is more reason-able and more reliable. By uninverting the inversion of control of callbacks, we place the control with a trustable system (Promises) that was designed specifically to bring sanity to our async.


#### Chain Flow
The key to making this work is built on two behaviors intrinsic to Promises:
- Every time you call then(..) on a Promise, it creates and returns a new Promise, which we can chain with.
- Whatever value you return from the then(..) call's fulfillment callback (the first parameter) is automatically set as the fulfillment of the chained Promise (from the first point).
The Promise chain we construct is not only a flow control that expresses a multistep async sequence, but it also acts as a message channel to propagate messages from step to step.
What if something went wrong in one of the steps of the Promise chain? An error/exception is on a per-Promise basis, which means it's possible to catch such an error at any point in the chain, and that catching acts to sort of "reset" the chain back to normal operation at that point:

```javascript
// step 1:
request( "http://some.url.1/" )

// step 2:
.then( function(response1){
  foo.bar(); // undefined, error!

  // never gets here
  return request( "http://some.url.2/?v=" + response1 );
} )

// step 3:
.then(
  function fulfilled(response2){
    // never gets here
  },
  // rejection handler to catch the error
  function rejected(err){
    console.log( err ); // `TypeError` from `foo.bar()` error
    return 42;
  }
)

// step 4:
.then( function(msg){
  console.log( msg );   // 42
} );
```

Returning a promise from a fulfillment or a rejected handler can delay the next step.
A thrown exception inside either the fulfillment or rejection handler of a then(..) call causes the next (chained) promise to be immediately rejected with that exception.

If you call then(..) on a promise, and you only pass a fulfillment handler to it, an assumed rejection handler is substituted:
```javascript
var p = new Promise( function(resolve,reject){
  reject( "Oops" );
} );

var p2 = p.then(
  function fulfilled(){
    // never gets here
  }
  // assumed rejection handler, if omitted or
  // any other non-function value passed
  // function(err) {
  //     throw err;
  // }
);
```

If a proper valid function is not passed as the fulfillment handler parameter to then(..), there's also a default handler substituted:
```javascript
var p = Promise.resolve( 42 );

p.then(
  // assumed fulfillment handler, if omitted or
  // any other non-function value passed
  // function(v) {
  //     return v;
  // }
  null,
  function rejected(err){
    // never gets here
  }
);
```


Let's review briefly the intrinsic behaviors of Promises that enable chaining flow control:
- A then(..) call against one Promise automatically produces a new Promise to return from the call.
- Inside the fulfillment/rejection handlers, if you return a value or an exception is thrown, the new returned (chainable) Promise is resolved accordingly.
- If the fulfillment or rejection handler returns a Promise, it is unwrapped, so that whatever its resolution is will become the resolution of the chained Promise returned from the current then(..).

While chaining flow control is helpful, it's probably most accurate to think of it as a side benefit of how Promises compose (combine) together, rather than the main intent. As we've discussed in detail several times already, Promises normalize asynchrony and encapsulate time-dependent value state, and that is what lets us chain them together in this useful way.

#### Terminology: Resolve, Fulfill, and Reject

```javascript
var p = new Promise( function(X,Y){
  // X() for fulfillment
  // Y() for rejection
} );
```

Promise.resolve(..) is a good, accurate name for the API method, because it can actually result in either fulfillment or rejection.

```javascript
var rejectedTh = {
  then: function(resolved,rejected) {
    rejected( "Oops" );
  }
};

var rejectedPr = Promise.resolve( rejectedTh );
```

Resolve indicates a callback than can handle both fulfilled or rejected values.

#### Error Handling
The most natural form of error handling for most developers is the synchronous try..catch construct. Unfortunately, it's synchronous-only, so it fails to help in async code patterns:

```javascript
function foo() {
  setTimeout( function(){
    baz.bar();
  }, 100 );
}

try {
  foo();
  // later throws global error from `baz.bar()`
}
catch (err) {
  // never gets here
}
```

Solution ? Always end your chain with a final catch(..) ?

```javascript
var p = Promise.resolve( 42 );

p.then(
  function fulfilled(msg){
    // numbers don't have string functions,
    // so will throw an error
    console.log( msg.toLowerCase() );
  }
)
.catch( handleErrors );
```

What if there is an error too within the catch(..) statement ?

#### Uncaught errors
Some Promise libraries have added methods for registering something like a "global unhandled rejection" handler, which would be called instead of a globally thrown error. But their solution for how to identify an error as "uncaught" is to have an arbitrary-length timer, say 3 seconds, running from time of rejection. If a Promise is rejected but no error handler is registered before the timer fires, then it's assumed that you won't ever be registering a handler, so it's "uncaught."
Another more common suggestion is that Promises should have a done(..) added to them, which essentially marks the Promise chain as "done." done(..) doesn't create and return a Promise, so the callbacks passed to done(..) are obviously not wired up to report problems to a chained Promise that doesn't exist.

This might sound more attractive than the never-ending chain or the arbitrary timeouts. But the biggest problem is that it's not part of the ES6 standard, so no matter how good it sounds, at best it's a lot longer way off from being a reliable and ubiquitous solution.

#### Promise Patterns
##### Promise.all([ .. ])
In classic programming terminology, a "gate" is a mechanism that waits on two or more parallel/concurrent tasks to complete before continuing. It doesn't matter what order they finish in, just that all of them have to complete for the gate to open and let the flow control through.
In the Promise API, we call this pattern all([ .. ]).   

The main promise returned from Promise.all([ .. ]) will only be fulfilled if and when all its constituent promises are fulfilled. If any one of those promises instead is rejected, the main Promise.all([ .. ]) promise is immediately rejected, discarding all results from any other promises.

##### Promise.race([ .. ])
While Promise.all([ .. ]) coordinates multiple Promises concurrently and assumes all are needed for fulfillment, sometimes you only want to respond to the "first Promise to cross the finish line," letting the other Promises fall away.

This pattern is classically called a "latch," but in Promises it's called a "race."
Similar to Promise.all([ .. ]), Promise.race([ .. ]) will fulfill if and when any Promise resolution is a fulfillment, and it will reject if and when any Promise resolution is a rejection.

##### "Finally"
Beware of resource cleaning when using promises. May need a `finally`-like statement cleaning objects.

##### Variations on all([ .. ]) and race([ .. ])

While native ES6 Promises come with built-in Promise.all([ .. ]) and Promise.race([ .. ]), there are several other commonly used patterns with variations on those semantics:
- none([ .. ]) is like all([ .. ]), but fulfillments and rejections are transposed. All Promises need to be rejected -- rejections become the fulfillment values and vice versa.
- any([ .. ]) is like all([ .. ]), but it ignores any rejections, so only one needs to fulfill instead of all of them.
- first([ .. ]) is like a race with any([ .. ]), which is that it ignores any rejections and fulfills as soon as the first Promise fulfills.
- last([ .. ]) is like first([ .. ]), but only the latest fulfillment wins.

#### Promise limitations
##### Sequence Error Handling
The limitations of how Promises are designed -- how they chain, specifically -- creates a very easy pitfall where an error in a Promise chain can be silently ignored accidentally.
- Errors not handled and silently ignored (error handler on last step may fix this.)
- But in-chain [maybe hidden] error handling may silent an error (next error handlers will be ignored)

It's basically the same limitation that exists with a try..catch that can catch an exception and simply swallow it. So this isn't a limitation unique to Promises, but it is something we might wish to have a workaround for.

##### Single value
Promises by definition only have a single fulfillment value or a single rejection reason. In simple examples, this isn't that big of a deal, but in more sophisticated scenarios, you may find this limiting.
- Splitting values : Sometimes you can take this as a signal that you could/should decompose the problem into two or more Promises.
- Unwrap/Spread Arguments : ES6 destructuring `function([x,y])`

##### Single Resolution

##### Inertia
No standard promisory wrapping. Use libaries or custom wrapper that returns a function producing a new Promise for each .

##### Promise Uncancelable
Once you create a Promise and register a fulfillment and/or rejection handler for it, there's nothing external you can do to stop that progression if something else happens to make that task moot.
This cancel feature violates the future-value's trustability (external immutability), but moreover is the embodiment of the "action at a distance" anti-pattern.

##### Promise Performance
Comparing how many pieces are moving with a basic callback-based async task chain versus a Promise chain, it's clear Promises have a fair bit more going on, which means they are naturally at least a tiny bit slower. Think back to just the simple list of trust guarantees that Promises offer, as compared to the ad hoc solution code you'd have to layer on top of callbacks to achieve the same protections.

### Generators
#### Breaking Run-to-Completion
As bizarre as it may seem, ES6 introduces a new type of function that does not behave with the run-to-completion behavior. This new type of function is called a "generator."

##### Input and Output
###### Iteration messaging

```javascript
function *foo(x) {
  var y = x * (yield "Hello");  // <-- yield a value!
  return y;
}

var it = foo( 6 );

var res = it.next();  // first `next()`, don't pass anything
res.value;        // "Hello"

res = it.next( 7 );   // pass `7` to waiting `yield`
res.value;    // 42 
```

###### Multiple iterators
each time you construct an iterator, you are implicitly constructing an instance of the generator which that iterator will control.

#### Iterators & iterables
An object that has the next() method on its interface is called an iterator. But a closely related term is iterable, which is an object that contains an iterator that can iterate over its values.
As of ES6, the way to retrieve an iterator from an iterable is that the iterable must have a function on it, with the name being the special ES6 symbol value Symbol.iterator

#### Holy grail ! Handle asynchronous requests through a synchronous flow
We have totally synchronous-looking code inside the generator (other than the yield keyword itself), but hidden behind the scenes, inside of foo(..), the operations can complete asynchronously.

That's huge! That's a nearly perfect solution to our previously stated problem with callbacks not being able to express asynchrony in a sequential, synchronous fashion that our brains can relate to.

In essence, we are abstracting the asynchrony away as an implementation detail, so that we can reason synchronously/sequentially about our flow control: "Make an Ajax request, and when it finishes print out the response." And of course, we just expressed two steps in the flow control, but this same capability extends without bounds, to let us express however many steps we need to.

#### Synchronous Error Handling
The yield-pause nature of generators means that not only do we get synchronous-looking return values from async function calls, but we can also synchronously catch errors from those async function calls!

#### Generators + Promises
The best of all worlds in ES6 is to combine generators (synchronous-looking async code) with Promises (trustable and composable).
But what should the iterator do with the promise?
It should listen for the promise to resolve (fulfillment or rejection), and then either resume the generator with the fulfillment message or throw an error into the generator with the rejection reason.
The natural way to get the most out of Promises and generators is to yield a Promise, and wire that Promise to control the generator's iterator.

##### Promises, Hidden
As a word of stylistic caution, be careful about how much Promise logic you include inside your generators. The whole point of using generators for asynchrony in the way we've described is to create simple, sequential, sync-looking code, and to hide as much of the details of asynchrony away from that code as possible.
We treat asynchrony, and indeed Promises, as an implementation detail.

#### Generator Delegation
`yield *` delegates/transfers the iterator instance control to the next generator.
`yield *[1,2,3]` also works.
The purpose of yield-delegation is mostly code organization
##### Delegating messages
Message are delegated both ways.

##### Error delegations
Exceptions are also delegated.

#### TL;DR
the generator can be paused in mid-completion (entirely preserving its state), and it can later be resumed from where it left off.

This pause/resume interchange is cooperative rather than preemptive, which means that the generator has the sole capability to pause itself, using the yield keyword, and yet the iterator that controls the generator has the sole capability (via next(..)) to resume the generator.

The yield / next(..) duality is not just a control mechanism, it's actually a two-way message passing mechanism. A yield .. expression essentially pauses waiting for a value, and the next next(..) call passes a value (or implicit undefined) back to that paused yield expression.

The key benefit of generators related to async flow control is that the code inside a generator expresses a sequence of steps for the task in a naturally sync/sequential fashion. The trick is that we essentially hide potential asynchrony behind the yield keyword -- moving the asynchrony to the code where the generator's iterator is controlled.

In other words, generators preserve a sequential, synchronous, blocking code pattern for async code, which lets our brains reason about the code much more naturally, addressing one of the two key drawbacks of callback-based async.

### performance
Asynchrony objective : performance.

#### Web workers
Run processing intensive tasks on secondary process thread to prevent blocking the main process thread.
From JS program, invoke a worker with

```javascript
var w1 = new Worker( "http://some.url.1/mycoolworker.js" );
```

Workers do not share any scope or resources with each other or the main program -- that would bring all the nightmares of threaded programming to the forefront -- but instead have a basic event messaging mechanism connecting them.

Here's how to listen for events (actually, the fixed "message" event):

```javascript
w1.addEventListener( "message", function(evt){
    // evt.data
} );
```

And you can send the "message" event to the Worker:

```javascript
w1.postMessage( "something cool to say" );
```

Inside the Worker, the messaging is totally symmetrical:

```javascript
// "mycoolworker.js"

addEventListener( "message", function(evt){
    // evt.data
} );

postMessage( "a really cool reply" );
```

To kill a Worker immediately from the program that created it, call terminate() on the Worker object (like w1 in the previous snippets). Abruptly terminating a Worker thread does not give it any chance to finish up its work or clean up any resources. It's akin to you closing a browser tab to kill a page.

##### Worker Environment
Inside the Worker, you do not have access to any of the main program's resources. That means you cannot access any of its global variables, nor can you access the page's DOM or other resources. Remember: it's a totally separate thread.

You can, however, perform network operations (Ajax, WebSockets) and set timers. Also, the Worker has access to its own copy of several important global variables/features, including navigator, location, JSON, and applicationCache.

You can also load extra JS scripts into your Worker, using importScripts(..):

```javascript
// inside the Worker
importScripts( "foo.js", "bar.js" );
```

##### Data transfer
If you pass an object, a so-called "Structured Cloning Algorithm" (https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm) is used to copy/duplicate the object on the other side. This algorithm is fairly sophisticated and can even handle duplicating objects with circular references. The to-string/from-string performance penalty is not paid, but we still have duplication of memory using this approach. There is support for this in IE10 and above, as well as all the other major browsers.

An even better option, especially for larger data sets, is "Transferable Objects" (http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast). What happens is that the object's "ownership" is transferred, but the data itself is not moved. Once you transfer away an object to a Worker, it's empty or inaccessible in the originating location -- that eliminates the hazards of threaded programming over a shared scope. Of course, transfer of ownership can go in both directions.

There really isn't much you need to do to opt into a Transferable Object; any data structure that implements the Transferable interface (https://developer.mozilla.org/en-US/docs/Web/API/Transferable) will automatically be transferred this way (support Firefox & Chrome).

For example, typed arrays like Uint8Array (see the ES6 & Beyond title of this series) are "Transferables." This is how you'd send a Transferable Object using postMessage(..):

```javascript
// `foo` is a `Uint8Array` for instance

postMessage( foo.buffer, [ foo.buffer ] );
```

The first parameter is the raw buffer and the second parameter is a list of what to transfer.

Browsers that don't support Transferable Objects simply degrade to structured cloning, which means performance reduction rather than outright feature breakage.

#### Review
Web Workers let you run a JS file (aka program) in a separate thread using async events to message between the threads. They're wonderful for offloading long-running or resource-intensive tasks to a different thread, leaving the main UI thread more responsive.

SIMD proposes to map CPU-level parallel math operations to JavaScript APIs for high-performance data-parallel operations, like number processing on large data sets.

Finally, asm.js describes a small subset of JavaScript that avoids the hard-to-optimize parts of JS (like garbage collection and coercion) and lets the JS engine recognize and run such code through aggressive optimizations. asm.js could be hand authored, but that's extremely tedious and error prone, akin to hand authoring assembly language (hence the name). Instead, the main intent is that asm.js would be a good target for cross-compilation from other highly optimized program languages -- for example, Emscripten (https://github.com/kripken/emscripten/wiki) transpiling C/C++ to JavaScript.

### Benchmark & performance
Measuring execution time with `(new Date()).getTime();` is not a solution.

#### Repetition
Do not use single samples, repeat samples for a given length of time.
The length of time to repeat across should be based on the accuracy of the timer you're using, specifically to minimize the chances of inaccuracy. The less precise your timer, the longer you need to run to make sure you've minimized the error percentage.

#### Benchmark.js
JS performance test in a specific environment

#### jsPerf.com
It uses the Benchmark.js library we talked about earlier to run statistically accurate and reliable tests, and makes the test on an openly available URL that you can pass around to others.

Each time a test is run, the results are collected and persisted with the test, and the cumulative test results are graphed on the page for anyone to see.

Graphic logo from [github.com/voodootikigod/logo.js/](https://github.com/voodootikigod/logo.js/)
