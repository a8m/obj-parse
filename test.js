'use strict';

var should = require('should');
var parse  = require('./');
var _      = require('./lib/utils');

describe('parse api', function() {

  it('should return a function', function() {
    var getter1 = parse('key');
    var getter2 = parse(_.noop);
    var getter3 = parse([1,2,3]);
    _.noop();

    (typeof getter1).should.equal('function');
    (typeof getter2).should.equal('function');
    (typeof getter3).should.equal('function');
    getter3.should.equal(_.noop);
  });

  it('should return a noop function', function() {
    (parse([])).should.equal(_.noop);
    (parse({})).should.equal(_.noop);
    (parse(24)).should.equal(_.noop);
  });

  it('should bind `assign` function to return value +' +
    'only for string expression', function() {
    (parse('key')).should.have.property('assign');
    (parse(_.noop)).should.not.have.property('assign');
  });

  describe('getterFn in action', function() {
    var person = {
      name: 'Ariel Mashraki',
      age: 25,
      address: { country: { name: 'Israel', city: 'Tel Aviv' }  }
    };

    var local = {
      name: 'Daniel Turing',
      occupation: 'Scuba Diver',
      address: { postal: 'HOH-OHO', planet: { name: 'Earth', sun: 'Sol'} }
    };

    it('should pull equally from either scope or local', function() {
      (parse('name')(person,local)).should.equal(local.name);
      (parse('age')(person,local)).should.equal(person.age);
      (parse('address.country.name')(person,local)).should.equal(person.address.country.name);
      (parse('address.postal')(person,local)).should.equal(local.address.postal);
      (parse('address.planet.name')(person,local)).should.equal(local.address.planet.name);

    })

    it('should return the getter value', function() {
      (parse('name')(person)).should.equal(person.name);
      (parse('age')(person)).should.equal(person.age);
      (parse('address.country')(person)).should.equal(person.address.country);
      (parse('address.country.name')(person)).should.equal(person.address.country.name);
    });

    it('should return undefined if the key path not match', function() {
      should(parse('Name')(person)).eql(undefined);
      should(parse('name.age')(person)).eql(undefined);
      should(parse('name.age').assign(person, 34)).eql(undefined)
      should(parse('name.age.whatever')(person)).eql(undefined)
    });

    it('should be reusable function(not hold state)', function() {
      var persons = [
        { name: 'A' }, { name: 'B' }, { name: 'C' }
      ];
      var getter = parse('name');

      persons.forEach(function(p, i) {
        getter(p).should.equal(p.name);
      });
    });

    it('should be able to pass overrider scope', function() {
      (parse('name')(person, { name: 'foo bar' })).should.equal('foo bar');
    });

    it('should run the function on the given context', function() {
      //fake spyer
      var scopes = [];
      var expected = [[person, undefined], [person, {}]];
      function toRun(s, l) {
        scopes.push([s, l]);
      }
      var getter = parse(toRun);
      getter(person);
      getter(person, {});
      //expect.HaveBeenCalledWith
      should(scopes).eql(expected);
    });

    it('should work fine with functions', function() {
      function ifCanadian(person) {
        return person.address.country.name === 'Canada';
      }
      var getter = parse(ifCanadian);
      (getter(person)).should.equal(false);
    });
  });

  describe('setterFn in action', function() {
    var person = {
      name: 'Ariel Mashraki',
      age: 25,
      address: { country: { name: 'Israel', city: 'Tel Aviv' }  }
    };

    it('should be able to set value', function() {
      var nameSetter = parse('name').assign;
      var citySetter = parse('address.country.city').assign;

      citySetter(person, 'New York');
      nameSetter(person, 'Obama');

      (person.name).should.equal('Obama');
      (person.address.country.city).should.equal('New York');
    });
  });

  describe('should use cache', function() {
    it('should return the same function by reference', function() {
      var time1 = parse('a.b');
      var time2 = parse('a.b');
      var time3 = parse('a');
      time1.should.equal(time2);
      time1.should.not.equal(time3);
    });
  });

});
