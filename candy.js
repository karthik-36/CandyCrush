/* Copyright (c) 2017 MIT 6.813/6.831 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

 /**
 * This object represents a candy on the board. Candies have a row
 * and a column, and a color
 */

var Candy = function(color, id)
{
 ////////////////////////////////////////////////
 // Representation
 //

 // Two immutable properties
 Object.defineProperty(this, 'color', {value: color, writable: true});
 Object.defineProperty(this, 'id', {value: id, writable: true});

 // Two mutable properties
 this.row = null;
 this.col = null;

 ////////////////////////////////////////////////
 // Public methods
 //
 this.toString = function()
 {
   var name = this.color;
   return name;
 }
};


// yellow was too bright
Candy.colors = [
  'red',
  'rgba(255,223,5,1)',
  'green',
  'orange',
  'blue',
  'purple'
];
