/* Copyright (c) 2017 MIT 6.813/6.831 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/**
 * Board represents the state of the candy-board. A candy-board is a square
 * array of squares. The candy-board can be any size.
 *
 * Each square of the candy-board contains exactly one candy.
 * Each square is identified by its row and column, numbered from 0 to
 * size-1.  Square [0,0] is in the upper-left corner of the candy-board.
 * Rows are numbered downward, and columns are numbered to the right.
 * The candy type on each square is random.
 *
 * Candies are mutable: a candy can be added, removed, and moved.
 * (The size of a board is immutable, however.)
 *
 * The board broadcasts four event types: "add",
 * "remove", "move", and "scoreUpdate".
 */

var Board = function (size) {
  // A unique ID for each candy.
  var candyCounter = 0

  // Score, one point per candy crushed.
  this.score = 0

  // boardSize is number of squares on one side of candy-board
  this.boardSize = size

  // square is a two dimensional array representating the candyboard
  // square[row][col] is the candy in that square, or null if square is empty
  this.square = new Array(this.boardSize)
  // make an empty candyboard
  for (var i = 0; i <= this.boardSize; i++) {
    this.square[i] = []
  }

  /*
   * Returns true/false depending on whether row and column
   * identify a valid square on the board.
   */
  this.isValidLocation = function (row, col) {
    return (
      row >= 0 &&
      col >= 0 &&
      row <= this.boardSize &&
      col <= this.boardSize &&
      row == Math.round(row) &&
      col == Math.round(col)
    )
  }

  /*
   * Returns true/false depending on whether the
   * square at [row,col] is empty (does not contain a candy).
   */
  this.isEmptyLocation = function (row, col) {
    if (this.getCandyAt(row, col)) {
      return false
    }
    return true
  }

  ////////////////////////////////////////////////
  // Public methods
  //

  /*
   * Perform an a valid move automatically on the board. Flips the
   * appropriate candies, but does not crush the candies.
   */
  this.doAutoMove = function () {
    var move = rules.getRandomValidMove()
    var toCandy = board.getCandyInDirection(move.candy, move.direction)
    this.flipCandies(move.candy, toCandy)
  }

  /*
   * Returns the number of squares on each side of the board
   */
  this.getSize = function () {
    return this.boardSize
  }

  /**
   * Get the candy found on the square at [row,column], or null
   * if the square is empty.  Requires row,column < size.
   */
  this.getCandyAt = function (row, col) {
    if (this.isValidLocation(row, col)) {
      return this.square[row][col]
    }
  }

  /**
   * Get location of candy (row and column) if it's found on this
   * board, or null if not found.
   */
  this.getLocationOf = function (candy) {
    return { row: candy.row, col: candy.col }
  }

  /**
   * Get a list of all candies on the board, in no particular order.
   */
  this.getAllCandies = function () {
    var results = []
    for (var r in this.square) {
      for (var c in this.square[r]) {
        if (this.square[r][c]) {
          results.push(this.square[r][c])
        }
      }
    }
    return results
  }

  /*
   * Add a new candy to the board.  Requires candies to be not currently
   * on the board, and (row,col) must designate a valid empty square.
   *
   * The optional spawnRow, spawnCol indicate where the candy
   * was "spawned" the moment before it moved to row, col. This location,
   * which may be off the board, is added to the 'add' event and
   * can be used to animate new candies that are coming in from offscreen.
   */
  this.add = function (candy, row, col, spawnRow, spawnCol) {
    if (this.isEmptyLocation(row, col)) {
      var details = {
        candy: candy,
        toRow: row,
        toCol: col,
        fromRow: spawnRow,
        fromCol: spawnCol,
      }

      candy.row = row
      candy.col = col

      this.square[row][col] = candy

      $(this).triggerHandler('add', details)
    } else {
      console.log('add already found a candy at ' + row + ',' + col)
    }
  }


  this.addIfWhite = function (candy, row, col, spawnRow, spawnCol) {

      var details = {
        candy: candy,
        toRow: row,
        toCol: col,
        fromRow: spawnRow,
        fromCol: spawnCol,
      }

      candy.row = row
      candy.col = col

      this.square[row][col] = candy

      $(this).triggerHandler('add', details)
  }

  /**
   * Move a candy from its current square to another square.
   * Requires candy to be already found on this board, and (toRow,toCol)
   * must denote a valid empty square.
   */
  this.moveTo = function (candy, toRow, toCol) {
    if (this.isEmptyLocation(toRow, toCol)) {
      var details = {
        candy: candy,
        toRow: toRow,
        toCol: toCol,
        fromRow: candy.row,
        fromCol: candy.col,
      }

      delete this.square[candy.row][candy.col]
      this.square[toRow][toCol] = candy

      candy.row = toRow
      candy.col = toCol

      $(this).triggerHandler('move', details)
    }
  }

  /**
   * Remove a candy from this board.
   * Requires candy to be found on this board.
   */
  this.remove = function (candy) {
    var details = {
      candy: candy,
      fromRow: candy.row,
      fromCol: candy.col,
    }
    delete this.square[candy.row][candy.col]
    candy.row = candy.col = null
    $(this).triggerHandler('remove', details)
  }

  /**
   * Remove a candy at a given location from this board.
   * Requires candy to be found on this board.
   */
  this.removeAt = function (row, col) {
    if (this.isEmptyLocation(row, col)) {
      console.log('removeAt found no candy at ' + r + ',' + c)
    } else {
      this.remove(this.square[row][col])
    }
  }

  /**
   * Remove all candies from board.
   */
  this.clear = function () {
    for (var r in this.square) {
      for (var c in this.square[r]) {
        if (this.square[r][c]) {
          this.removeAt(r, c)
        }
      }
    }
  }

  ////////////////////////////////////////////////
  // Utilities
  //

  /*
  Adds a candy of specified color to row, col. 
  */
  this.addCandy = function (color, row, col, spawnRow, spawnCol) {
    var candy = new Candy(color, candyCounter++)
    this.add(candy, row, col, spawnRow, spawnCol)
  }

  /**
   * Adds a candy of random color at row, col.
   */

  this.addRandomCandy = function (row, col, spawnRow, spawnCol) {
    var candy = new Candy(
      Candy.colors[Math.floor(Math.random() * 6)],
      candyCounter++,
    )
    return this.add(candy, row, col, spawnRow, spawnCol)
  }

  this.addRandomCandyIfWhite = function (row, col, spawnRow, spawnCol) {
    var candy = new Candy(
      Candy.colors[Math.floor(Math.random() * 6)],
      candyCounter++,
    )
    return this.addIfWhite(candy, row, col, spawnRow, spawnCol)
  }

  /*
  Returns the candy immediately in the direction specified by direction
  ['up', 'down', 'left', 'right'] from the candy passed as fromCandy
  */
  this.getCandyInDirection = function (fromCandy, direction) {
    switch (direction) {
      case 'up': {
        return this.getCandyAt(fromCandy.row - 1, fromCandy.col)
      }
      case 'down': {
        return this.getCandyAt(fromCandy.row + 1, fromCandy.col)
      }
      case 'left': {
        return this.getCandyAt(fromCandy.row, fromCandy.col - 1)
      }
      case 'right': {
        return this.getCandyAt(fromCandy.row, fromCandy.col + 1)
      }
    }
  }

  /* Flip candy1 with candy2 in one step, firing two move events.
   * Does not verify the validity of the flip. Does not crush candies
   * produced by flip. */
  this.flipCandies = function (candy1, candy2) {
    // Swap the two candies simultaneously.
    var details1 = {
      candy: candy1,
      toRow: candy2.row,
      toCol: candy2.col,
      fromRow: candy1.row,
      fromCol: candy1.col,
    }
    var details2 = {
      candy: candy2,
      toRow: candy1.row,
      toCol: candy1.col,
      fromRow: candy2.row,
      fromCol: candy2.col,
    }
    candy1.row = details1.toRow
    candy1.col = details1.toCol
    this.square[details1.toRow][details1.toCol] = candy1
    candy2.row = details2.toRow
    candy2.col = details2.toCol
    this.square[details2.toRow][details2.toCol] = candy2

    // Trigger two move events.
    $(this).triggerHandler('move', details1)
    $(this).triggerHandler('move', details2)
  }

  /*
   * Resets the score
   */
  this.resetScore = function () {
    this.score = 0
    $(this).triggerHandler('scoreUpdate', [{ score: 0 }])
  }

  /*
   * Adds some score.
   */
  this.incrementScore = function (candy, row, col) {
    this.score += 1
    $(this).triggerHandler('scoreUpdate', [
      {
        score: this.score,
        candy: candy,
        row: row,
        col: col,
      },
    ])
  }

  /*
   * Gets the current score
   */
  this.getScore = function () {
    return this.score
  }

  /**
   * Get a string representation for the board as a multiline matrix.
   */
  this.toString = function () {
    var result = ''
    for (var r = 0; r < this.boardSize; ++r) {
      for (var c = 0; c < this.boardSize; ++c) {
        var candy = this.square[r][c]
        if (candy) {
          result += candy.toString().charAt(0) + ' '
        } else {
          result += '_ '
        }
      }
      result += '<br/>'
    }
    return result.toString()
  }
}

let fullId = '';
let inputField = '';
let firstTime = true;
const width = 8;
let isStable = false;
let letterRow = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let newBoard = new Board(width);
let rule = new Rules(newBoard);

document.addEventListener('DOMContentLoaded', () => {
  createBoard()
  makeBoardStable(newBoard);
  fillRandomAll(newBoard);
  
})

function createBoard() {
  const table = document.querySelector('.candyMain')

  for (let i = 0; i < width; i++) {
    const row = document.createElement('tr')
    let tr = table.appendChild(row)
    for (let j = 0; j < width; j++) {
      let td = document.createElement('td')
      tr.appendChild(td)
      td.setAttribute('id', i + '' + j)
      td.innerHTML = letterRow[j] + '' + (i + 1)

      td.style.height = '50px'
      td.style.width = '50px'
      td.style.color = 'white'
      td.style.border = '5px solid white'
      td.style.borderRadius = '10px 10px 10px 10px'
      td.style.textAlign = 'center'

      if (board.getCandyAt(i, j) == null) {
        newBoard.addRandomCandy(i, j, i, j)
      }
      td.style.backgroundColor = newBoard.getCandyAt(i, j).color
    }
  }
}

function newGame() {
  newBoard.clear()
  const table = document.querySelector('.candyMain')
  table.innerHTML = '';
  document.getElementById('mInput').value = '';
  firstTime = true;
  createBoard();
  makeBoardStable(newBoard);
}

function reply_click(clicked_id)
{
  let directionBtn = document.getElementById(clicked_id);
  if(inputField.length == 0 || inputField.length == 1){
    alert("choose a valid input first");
  }
  else if(directionBtn.style.backgroundColor != 'green'){
    alert("you can choose only the green moves!");
  }
  else if (directionBtn.style.backgroundColor == 'green'){
    console.log(directionBtn.id);
    if(directionBtn.id == 'down'){
      console.log(inputField , fullId)
      console.log(newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])))

      let tempColor = newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color;
      newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color = newBoard.getCandyAt(parseInt(fullId[0]) + 1, parseInt(fullId[1])).color;
      newBoard.getCandyAt(parseInt(fullId[0])+1 , parseInt(fullId[1])).color = tempColor;
    }
    if(directionBtn.id == 'up'){
      console.log(inputField , fullId)
      let tempColor = newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color;
      newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color = newBoard.getCandyAt(parseInt(fullId[0]) - 1, parseInt(fullId[1])).color;
      newBoard.getCandyAt(parseInt(fullId[0])-1 , parseInt(fullId[1])).color = tempColor;
    }
    if(directionBtn.id == 'left'){
      console.log(inputField , fullId)
      let tempColor = newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color;
      newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color = newBoard.getCandyAt(parseInt(fullId[0]), parseInt(fullId[1]) - 1).color;
      newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1]) - 1).color = tempColor;
    }
    if(directionBtn.id == 'right'){
      console.log(inputField , fullId)
      let tempColor = newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color;
      newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1])).color = newBoard.getCandyAt(parseInt(fullId[0]), parseInt(fullId[1]) + 1).color;
      newBoard.getCandyAt(parseInt(fullId[0]) , parseInt(fullId[1]) + 1).color = tempColor;
    }


    applyBoardStyle(newBoard);
  }

}


function makeGreyArrow(){
    let up = document.getElementById('up');
    up.style.backgroundColor = '#e3dede' ;

    let down = document.getElementById('down');
    down.style.backgroundColor = '#e3dede' ;
  

    let left = document.getElementById('left');
    left.style.backgroundColor = '#e3dede' ;
  
    let right = document.getElementById('right');
    right.style.backgroundColor = '#e3dede' ;
}

function CheckInput(e) {
  function isCharacterALetter(char) {
    return (/[a-zA-Z]/).test(char)
  }
  //console.log(document.getElementById('mInput').value);
  let iVal = document.getElementById('mInput').value;
  inputField = iVal;

  if(inputField.length == 0 || inputField == 1){
    console.log('1111');
    makeGreyArrow()
  }

  if (iVal.length == 2 && isCharacterALetter(iVal[0]) && Number.isInteger(parseInt(iVal[1])) && parseInt(iVal[1]) <= width && parseInt(iVal[1]) > 0 && iVal[0] < 'i') {
    // console.log("valid input");
    let iId;
    for (let i = 0; i < width; i++) {
      if (iVal[0] == letterRow[i]) {
        iId = i;
        fullId = (parseInt(iVal[1]) - 1) + '' + iId;
        console.log("fullId ", fullId);
        let searchArray = rule.getRandomValidMove(); 
        for( let x = 0 ; x < searchArray.length ; x++){
          let directions = new Array(4);
          if(searchArray[x].candy.row  == (parseInt(iVal[1]) - 1)  && searchArray[x].candy.col == iId){
              directions.push(searchArray[x].direction);
         

              for(let d = 0 ; d < directions.length ; d++){
                
                if(directions[d] == 'up'){
                  let left = document.getElementById('up');
                  left.style.backgroundColor = 'green' ;
                }
                if(directions[d] == 'down'){
                  let left = document.getElementById('down');
                  left.style.backgroundColor = 'green' ;
                }
                if(directions[d] == 'left'){
                  let left = document.getElementById('left');
                  left.style.backgroundColor = 'green' ;
                }
                if(directions[d] == 'right'){
                  let left = document.getElementById('right');
                  left.style.backgroundColor = 'green' ;
                }

                }
          }
        }
        let square = newBoard.getCandyAt((parseInt(iVal[1]) - 1), parseInt(iId));
        console.log(square.color);
      }
    }
    newBoard.getCandyAt();

  } else if (iVal.length == 2) {
    alert("input not valid try again \n first letter a - h , second number 1 - 8");
    console.log('1111');
    makeGreyArrow()
    document.getElementById('mInput').value = '';
  }
  else{
      
    console.log('1111');
      makeGreyArrow();
      
  }
}















//make stable board
function makeBoardStable(newBoard) {
  //  five
  function checkRowForFive() {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width - 4; j++) {
        let currCandy = newBoard.getCandyAt(i, j)
        let rowOfFive = [j, j + 1, j + 2, j + 3, j + 4]
        let decidedColor = newBoard.getCandyAt(i, j).color
        const isBlank = decidedColor === 'white'
        if (
          rowOfFive.every(
            (jRow) =>
              newBoard.getCandyAt(i, jRow).color == decidedColor && !isBlank,
          )
        ) {
          rowOfFive.forEach((jRow) => {
            newBoard.getCandyAt(i, jRow).color = 'white'
          })
        }
      }
    }
  }


  function checkColumnForFive() {
    for (let i = 0; i < width - 4; i++) {
      for (let j = 0; j < width; j++) {
        let columnOfFive = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
        ]
        let decidedColor = newBoard.getCandyAt(i, j).color;
        const isBlank = decidedColor === 'white';
        if (
          columnOfFive.every(
            (iCol) =>{
             return newBoard.getCandyAt(iCol, j).color == decidedColor && (isBlank !== 'white')
            }
          )
        ) {
          columnOfFive.forEach(
            (iCol) =>
            newBoard.getCandyAt(iCol, j).color = 'white'
          )
        }
      }
    }
  }


  // four

  function checkRowForFour() {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width - 3; j++) {
        let currCandy = newBoard.getCandyAt(i, j)
        let rowOfFour = [j, j + 1, j + 2, j + 3]
        let decidedColor = newBoard.getCandyAt(i, j).color
        const isBlank = decidedColor === 'white'
        if (
          rowOfFour.every(
            (jRow) =>
              newBoard.getCandyAt(i, jRow).color == decidedColor && !isBlank,
          )
        ) {
          rowOfFour.forEach((jRow) => {
            newBoard.getCandyAt(i, jRow).color = 'white'
          })
        }
      }
    }
  }



  function checkColumnForFour() {
    for (let i = 0; i < width - 3; i++) {
      for (let j = 0; j < width; j++) {
        let columnOfFour = [
          i,
          i + 1,
          i + 2,
          i + 3,
        ]
        let decidedColor = newBoard.getCandyAt(i, j).color;
        const isBlank = decidedColor === 'white';
        if (
          columnOfFour.every(
            (iCol) =>{
             return newBoard.getCandyAt(iCol, j).color == decidedColor && (isBlank !== 'white')
            }
          )
        ) {
          columnOfFour.forEach(
            (iCol) =>
            newBoard.getCandyAt(iCol, j).color = 'white'
          )
        }
      }
    }
  }


  // three

  function checkRowForThree() {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width - 2; j++) {
        let currCandy = newBoard.getCandyAt(i, j)
        let rowOfThree = [j, j + 1, j + 2]
        let decidedColor = newBoard.getCandyAt(i, j).color
        const isBlank = decidedColor === 'white'
        if (
          rowOfThree.every(
            (jRow) =>
              newBoard.getCandyAt(i, jRow).color == decidedColor && !isBlank,
          )
        ) {
          rowOfThree.forEach((jRow) => {
            newBoard.getCandyAt(i, jRow).color = 'white'
          })
        }
      }
    }
  }


  function checkColumnForThree() {
    for (let i = 0; i < width - 2; i++) {
      for (let j = 0; j < width; j++) {
        let columnOfThree = [
          i,
          i + 1,
          i + 2,
        ]
        let decidedColor = newBoard.getCandyAt(i, j).color;
        const isBlank = decidedColor === 'white';
        if (
          columnOfThree.every(
            (iCol) =>{
             return newBoard.getCandyAt(iCol, j).color == decidedColor && (isBlank !== 'white')
            }
          )
        ) {
         // console.log("yes yes yes col 3");
          columnOfThree.forEach(
            (iCol) =>
            newBoard.getCandyAt(iCol, j).color = 'white'
          )
        }
      }
    }
  }

   checkRowForFive()
   checkColumnForFive()

   checkRowForFour()
   checkColumnForFour()

   checkRowForThree()
   checkColumnForThree()

  //copy over board to html
  applyBoardStyle(newBoard);
}

function applyBoardStyle(newBoard){
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      let td = document.getElementById(i + '' + j)
      td.style.backgroundColor = newBoard.getCandyAt(i, j).color
    }
  }
}




// check if board is stable
function isBoardStable(newBoard) {
  //  five
  let stable = true;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      if(newBoard.getCandyAt(i,j) == 'white'){
        stable = false;
      }
    }
  }

 
  function checkRowForFive() {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width - 4; j++) {
        let rowOfFive = [j, j + 1, j + 2, j + 3, j + 4]
        let decidedColor = newBoard.getCandyAt(i, j).color
        const isBlank = decidedColor === 'white'
        if (
          rowOfFive.every(
            (jRow) =>
              newBoard.getCandyAt(i, jRow).color == decidedColor && !isBlank,
          )
        ) {
          stable = false;
        }
      }
    }
  }


  function checkColumnForFive() {
    for (let i = 0; i < width - 4; i++) {
      for (let j = 0; j < width; j++) {
        let columnOfFive = [
          i,
          i + 1,
          i + 2,
          i + 3,
          i + 4,
        ]
        let decidedColor = newBoard.getCandyAt(i, j).color;
        const isBlank = decidedColor === 'white';
        if (
          columnOfFive.every(
            (iCol) =>{
             return newBoard.getCandyAt(iCol, j).color == decidedColor && (isBlank !== 'white')
            }
          )
        ) {
          stable = false;
        }
      }
    }
  }


  // four

  function checkRowForFour() {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width - 3; j++) {
        let currCandy = newBoard.getCandyAt(i, j)
        let rowOfFour = [j, j + 1, j + 2, j + 3]
        let decidedColor = newBoard.getCandyAt(i, j).color
        const isBlank = decidedColor === 'white'
        if (
          rowOfFour.every(
            (jRow) =>
              newBoard.getCandyAt(i, jRow).color == decidedColor && !isBlank,
          )
        ) {
          stable = false;
        }
      }
    }
  }



  function checkColumnForFour() {
    for (let i = 0; i < width - 3; i++) {
      for (let j = 0; j < width; j++) {
        let columnOfFour = [
          i,
          i + 1,
          i + 2,
          i + 3,
        ]
        let decidedColor = newBoard.getCandyAt(i, j).color;
        const isBlank = decidedColor === 'white';
        if (
          columnOfFour.every(
            (iCol) =>{
             return newBoard.getCandyAt(iCol, j).color == decidedColor && (isBlank !== 'white')
            }
          )
        ) {
          stable = false;
        }
      }
    }
  }


  // three

  function checkRowForThree() {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width - 2; j++) {
        let currCandy = newBoard.getCandyAt(i, j)
        let rowOfThree = [j, j + 1, j + 2]
        let decidedColor = newBoard.getCandyAt(i, j).color
        const isBlank = decidedColor === 'white'
        if (
          rowOfThree.every(
            (jRow) =>
              newBoard.getCandyAt(i, jRow).color == decidedColor && !isBlank,
          )
        ) {
          stable = false;
        }
      }
    }
  }


  function checkColumnForThree() {
    for (let i = 0; i < width - 2; i++) {
      for (let j = 0; j < width; j++) {
        let columnOfThree = [
          i,
          i + 1,
          i + 2,
        ]
        let decidedColor = newBoard.getCandyAt(i, j).color;
        const isBlank = decidedColor === 'white';
        if (
          columnOfThree.every(
            (iCol) =>{
             return newBoard.getCandyAt(iCol, j).color == decidedColor && (isBlank !== 'white')
            }
          )
        ) {
         // console.log("yes yes yes col 3");
            stable = false;
        }
      }
    }
  }

   checkRowForFive()
   checkColumnForFive()

   checkRowForFour()
   checkColumnForFour()

   checkRowForThree()
   checkColumnForThree()

   return stable;
}









function fillRandomAll(newBoard){

  for (let i = width-2; i != -1; i--) {
    for (let j = width -1; j != -1; j--) {
      let tdDown = document.getElementById((i+1) + '' + j);
      if(newBoard.getCandyAt(i + 1, j).color == 'white'){
         tdDown.style.backgroundColor = newBoard.getCandyAt(i, j).color;
         newBoard.getCandyAt(i + 1, j).color = newBoard.getCandyAt(i, j).color;

         let td = document.getElementById(i + '' + j);
         newBoard.getCandyAt(i, j).color = 'white';
         td.style.backgroundColor = 'white';
      }
     // td.style.backgroundColor = newBoard.getCandyAt(i, j).color
    }
  }

  for(let j = 0 ; j < width; j++){
    let td = document.getElementById(0 + '' + j);
    if(td.style.backgroundColor == 'white'){
      newBoard.addRandomCandyIfWhite(0,j);
      td.style.backgroundColor = newBoard.getCandyAt(0,j).color; 
    }
  }


}

function crushOnce(id){

  document.getElementById('mInput').value = '';

  makeGreyArrow();
  setTimeout(function(){
    fillRandomAll(newBoard);
    makeBoardStable(newBoard);
    console.log('4444');
 

  },500)

   let interval1 = setInterval(() => {
    if(!isStable){
    fillRandomAll(newBoard);
    makeBoardStable(newBoard);
    }else{
      isStable = true;
      makeGreyArrow();
      clearInterval(interval1);
    }
  }, 500);
}


window.setInterval(function () {
  //fillRandomAll(newBoard);
 
  isStable = isBoardStable(newBoard) ;

  
}, 40)

window.setInterval(function () {
  //fillRandomAll(newBoard);
 
 // isStable = isBoardStable(newBoard) ;
   console.log("isStable : " , isStable);
   if(!isStable && firstTime){
    fillRandomAll(newBoard);
    makeBoardStable(newBoard);
   }else{
     firstTime = false;
   }
  
}, 500)



// for (index = 0; index < allInputs.length; ++index) {
//   console.log(allInputs[index].disabled = false);
// }
window.setInterval(function () {
  let lastColumn = document.getElementById('lastColumn');
  let allInputs = lastColumn.getElementsByTagName('input');
  let cOnce = document.getElementById('crushOnce');
  if(isStable){
    for (index = 0; index < allInputs.length; ++index) {
      allInputs[index].disabled = false;
    }
    cOnce.disabled = true;
  }else{
  
    
    for (index = 0; index < allInputs.length; ++index) {
      allInputs[index].disabled = true;
    }

    if(firstTime){
      cOnce.disabled = true;
    }else{
      cOnce.disabled = false;
    }
  }
}, 50)

