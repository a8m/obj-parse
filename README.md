# obj-parse [![Build Status](https://travis-ci.org/a8m/obj-parse.svg?branch=master)](https://travis-ci.org/a8m/obj-parse) [![Coverage Status](https://img.shields.io/coveralls/a8m/obj-parse.svg)](https://coveralls.io/r/a8m/obj-parse?branch=master)

> Get and Set object properties in a **Fast** and **Elegant** way. (with caching and no dependencies!)  
>Inspire by angular $parse service

**Note:** This kit works great with [deep-keys](https://github.com/a8m/deep-keys) _(creates an array composed of the own enumerable property names of an object)._

## Install

```sh
$ npm install --save obj-parse
```

## Usage
```js
var parse = require('obj-parse');

//object
var person1 = {
  name: 'Ariel Mashraki',
  address: { country: { name: 'Israel', city: 'Tel Aviv' }  }
};

var person2 = {
  name: 'Dan Louis',
  address: { country: { name: 'Canada', city: 'Toronto' }  }
};
    
//property getter
var nameGetter = parse('name');
nameGetter(person1); //Ariel Mashraki
nameGetter(person2); //Dan Louis

//nested propeties with dot notation
var cityGetter = parse('address.country.city');
cityGetter(person1); //Tel Aviv
cityGetter(person2); //Toronto

//bind a function
function ifCanadian(person) {
  return person.address.country.name === 'Canada';
}
var getter = parse(ifCanadian);
getter(person1); //false
getter(person2); //true

//property setter, use the assign function
//return function(scope, value)
var countrySetter = parse('address.country.name').assign;
countrySetter(person1, 'Canada'); //return person1 with changes
countrySetter(person2, 'Israel'); //return person2 with changes

//use again in the ifCanadian
getter(person1); //true
getter(person2); //false
```


## License

MIT © [Ariel Mashraki](https://github.com/a8m)
