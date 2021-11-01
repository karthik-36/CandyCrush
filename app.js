document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const width = 10
  const squares = []
  let score = 0;

  const candyColors = ['red', 'yellow', 'orange', 'purple', 'green', 'blue']

  // board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')

      square.setAttribute('draggable', true)
      square.setAttribute('id', i)
      let randomColor = Math.floor(Math.random() * candyColors.length)
      // console.log(randomColor)
      square.style.backgroundColor = candyColors[randomColor]
      grid.appendChild(square)
      squares.push(square)
    }
  }

  createBoard()

  //

  let colorBeingDragged
  let colorBeingReplaced
  let squareIdBeingDragged
  let squareIdBeingReplaced

  squares.forEach((square) => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragend', dragEnd)
    square.addEventListener('dragleave', dragLeave)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('dragenter', dragEnter)
  })

  squares.forEach((square) => square.addEventListener('drop', dragDrop))

  function dragStart() {
    colorBeingDragged = this.style.backgroundColor
    squareIdBeingDragged = parseInt(this.id)
    //  console.log(colorBeingDragged)
    //   console.log(this.id , "start");
  }
  function dragOver(e) {
    e.preventDefault()
    //   console.log(this.id , "dragover");
  }
  function dragEnter(e) {
    e.preventDefault()
    //   console.log(this.id , "dragenter");
  }
  function dragLeave() {
    //   console.log(this.id , "dragleave");
  }

  function dragDrop(e) {
    //  console.log(this.id, 'dragdrop')
    colorBeingReplaced = this.style.backgroundColor
    squareIdBeingReplaced = parseInt(this.id)

    //   squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced
    //  squares[squareIdBeingReplaced].style.backgroundColor = colorBeingDragged
    console.log('here')
  }

  function dragEnd() {
    let validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width,
    ]
    let validMove = validMoves.includes(squareIdBeingReplaced)
    // console.log(validMoves)
    //  console.log('valid moves', validMove)
    // console.log(this.id, 'dragend')

    if (squareIdBeingReplaced && validMove) {
      console.log('isValid')

      console.log(squares)
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced
      squares[squareIdBeingReplaced].style.backgroundColor = colorBeingDragged
              squareIdBeingReplaced = null
    } else if (squareIdBeingReplaced && !validMove) {
      console.log('not valid')
      alert('not a valid move')
    } else {
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged
    }
  }



  // four


  function checkRowForFour(){
    for(let i = 0 ; i < 96; i++){

       // console.log((width - (i%width)));
        if((width - (i%width)) <= 3){  
            continue;
        }

        let rowOfFour = [i , i+1 , i+2 , i+3];
        let decidedColor = squares[i].style.backgroundColor;
        const isBlank = squares[i].style.backgroundColor === '';
        if(rowOfFour.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)){
           score = score + 4;
            rowOfFour.forEach(index => {
                squares[index].style.backgroundColor = 'white';
            })
        }
    }

  }


  function checkColumnForFour(){
  for(let i = 0 ; i < 69; i++){
      let columnOfFour = [i , i+width , i+(2*width) , i+(3*width)];
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === '';
      console.log("decided" , "  ", );
      if(columnOfFour.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)){
         score = score + 4;
         columnOfFour.forEach(index => {
              squares[index].style.backgroundColor = 'white';
          })
      }
  }

}



  // three
  function checkRowForThree(){
    for(let i = 0 ; i < 97; i++){

       // console.log((width - (i%width)));
        if((width - (i%width)) <= 2){  
            continue;
        }

        let rowOfThree = [i , i+1 , i+2];
        let decidedColor = squares[i].style.backgroundColor;
        const isBlank = squares[i].style.backgroundColor === '';
        if(rowOfThree.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)){
           score = score + 3;
            rowOfThree.forEach(index => {
                squares[index].style.backgroundColor = 'white';
            })
        }
    }

  }


  function checkColumnForThree(){
  for(let i = 0 ; i < 79; i++){
      let columnOfThree = [i , i+width , i+(2*width)];
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === '';
      console.log("decided" , "  ", );
      if(columnOfThree.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)){
         score = score + 3;
         columnOfThree.forEach(index => {
              squares[index].style.backgroundColor = 'white';
          })
      }
  }

}
checkRowForFour();
checkColumnForFour();
  checkRowForThree();
  checkColumnForThree();


  score = 0;
  window.setInterval(function(){
    checkRowForFour()
    checkColumnForFour()
    checkRowForThree()
    checkColumnForThree()
   // checkColumnForThree()
   // moveIntoSquareBelow()
  }, 100)


})
