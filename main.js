
wKnight = 'K';
wRook = 'R';
wBishop = 'B';
wKing = 'I';
wQueen = 'Q';
wPawn = 'P';

bPawn = 'G';
bRook = 'O';
bKnight = 'S';
bBishop = 'F';
bKing = 'X';
bQueen = 'M';

empty = 'E';


piece = 0;
state = 1;
idle = 0;
selected = 1;
available = 2;



var GameEngine =
{
  whiteTurn: true,

  squares: [],
  board: document.getElementById("chess-board"),


  // Using chars to represent a single piece in the table.



  /* Starting possitions of all of the pieces
     We are going to use this table to check if the move
     is valid or not,and move the pieces accordingly.
  */
  initialTable: [
    [[wRook, idle], [wKnight, idle], [wBishop, idle], [wKing, idle], [wQueen, idle], [wBishop, idle], [wKnight, idle], [wRook, idle]],
    [[wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle]],
    [[bRook, idle], [bKnight, idle], [bBishop, idle], [bKing, idle], [bQueen, idle], [bBishop, idle], [bKnight, idle], [bRook, idle]]],

  currentTable: [
    [[wRook, idle], [wKnight, idle], [wBishop, idle], [wKing, idle], [wQueen, idle], [wBishop, idle], [wKnight, idle], [wRook, idle]],
    [[wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle], [wPawn, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle], [empty, idle]],
    [[bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle], [bPawn, idle]],
    [[bRook, idle], [bKnight, idle], [bBishop, idle], [bKing, idle], [bQueen, idle], [bBishop, idle], [bKnight, idle], [bRook, idle]]],




  // Methods
  /*Initialize the board with white and black squares
      and save the squares in an array so we can loop thru them
  */
  init: function () {

    // assign the board
    board = document.getElementById("chess-board");

    for (var i = 0; i < 8; i++) {
      var collumn = [];
      for (var j = 0; j < 8; j++) {
        var square = document.createElement("div");
        if ((i + j) % 2 == 0) {
          board.appendChild(square).classList.add("white-square");
          square.addEventListener("click", readInput);

        }
        else {
          board.appendChild(square).classList.add("black-square");
          square.addEventListener("click", readInput);
        }
        collumn.push(square);
      }
      this.squares.push(collumn);
    }
  },

  // Using the initialTable,set the pieces at starting positions.
  resetGame: function () {

    for (var i = 0; i < this.squares.length; ++i) {
      for (var j = 0; j < this.squares[i].length; ++j) {

        var path = this.getPath(this.initialTable[i][j][this.piece]);

        if (this.squares[i][j].childNodes[0])
          this.squares[i][j].removeChild(this.squares[i][j].firstChild);

        if (path == empty) continue;
        var img = this.squares[i][j].appendChild(document.createElement("img"));
        img.src = path;
        img.classList.add("piece");
      }
    }
  },

  getPath: function (piece) {
    switch (piece) {
      case wRook: return "./images/whiteRook.png";
      case wKnight: return "./images/whiteKnight.png";
      case wBishop: return "./images/whiteBishop.png";
      case wQueen: return "./images/whiteQueen.png";
      case wKing: return "./images/whiteKing.png";
      case wPawn: return "./images/whitePawn.png";
      case bPawn: return "./images/blackPawn.png";
      case bRook: return "./images/blackRook.png";
      case bKnight: return "./images/blackKnight.png";
      case bBishop: return "./images/blackBishop.png";
      case bKing: return "./images/blackKing.png";
      case bQueen: return "./images/blackQueen.png";
      default: return this.empty;

    }
  },

  HighlightPawnMoves: function (piece, squareCoords) {

    switch (piece) {
      case wPawn:
        // if the pawn is at starting position
        // highlight the two squares in front.
        if (currentTable[squareCoords[0]][squareCoords[1]] == initialTable[squareCoords[0]][squareCoords[1]]) {
          if (currentTable[squareCoords[0] + 1][squareCoords[1]][piece] == empty) {
            currentTable[squareCoords[0] + 1][squareCoords[1]][state] =
              available;

            if (currentTable[squareCoords[0] + 2][squareCoords[1]][piece] == empty)
              currentTable[squareCoords[0] + 2][squareCoords[1]][state] =
                available;
          }
        }
        // highlight the square in front of the pawn
        else if (squareCoords[0] + 1 <= currentTable.length) {
          if (currentTable[squareCoords[0] + 1][squareCoords[1]][piece] == empty) {
            currentTable[squareCoords[0] + 1][squareCoords[1]][state] = available;
          }
        }

        // if pawn can capture a piece on the left
        if (squareCoords[1] - 1 >= 0 && squareCoords[0] + 1 <= currentTable.length) {
          switch (currentTable[squareCoords[0] + 1][squareCoords[1] - 1][piece]) {
            case bPawn: case bBishop: case bRook: case bKnight:
            case bQueen:
              currentTable[squareCoords[0] + 1][squareCoords[1] - 1][state] = available;
          }
        }

        // if pawn can capture a piece on the right
        if (squareCoords[1] + 1 <= currentTable[squareCoords[0]].length && squareCoords[0] + 1 <= currentTable[squareCoords[0]].length) {
          switch (currentTable[squareCoords[0] + 1][squareCoords[1] + 1][piece]) {
            case bPawn: case bBishop: case bRook: case bKnight:
            case bQueen:
              currentTable[squareCoords[0] + 1][squareCoords[1] + 1][state] = available;
          }
        }
    }
  },
  // should work on this one.
  HighlightAvailableMoves: function (squareCoords) {
    // get the piece in that square
    piece = getSquaresPiece(squareCoords);

    switch (piece) {
      case bPawn:
      case wPawn:
        HighlightPawnMoves(piece, squareCoords);
        break;
    }
  },

  getSquareCoords: function (square) {

    for (let i = 0; i < squares.length; ++i) {
      for (let j = 0; j < squares[i].length; ++j) {
        if (squares[i][j] == square)
          return [i, j];
      }
    }
  },

  getSquaresPiece: function (squaresCoords) {
    for (let i = 0; i < currentTable.length; ++i) {
      for (let j = 0; j < currentTable[i].length; ++j) {
        if (i == squaresCoords[0] && j == squaresCoords[1])
          return currentTable[i][j][piece];
      }
    }
  },

  alreadyHaveSelected: function () {
    for (let i = 0; i < currentTable.length; ++i) {
      for (let j = 0; j < currentTable[i].length; ++i) {
        if (currentTable[i][j][state] == selected)
          return true;
      }
    }
    return false;
  },

  isValidMove: function (availableMoves, coords) {
    for (let i = 0; i < availableMoves.length; ++i) {
      let canMove = true;
      for (let j = 0; j < 2; ++j) {
        if (availableMoves[j] != coords[j]) {
          canMove = false;
          break;
        }
      }
      if (canMove) return true;
    }
    return false;
  },

  isWhitePiece: function (coords) {

    switch (currentTable[coords[0]][coords[1][piece]]) {
      case wKnight:
      case wRook:
      case wKnight:
      case wBishop:
      case wQueen:
      case wPawn:
        return true;
      default:
        return false;
    }
  },
  isValidSelction: function (coords) {
    if (whiteTurn) {
      return isWhitePiece(coords);
    }
    else
      return !isWhitePiece(coords);
  },

  selectPiece: function (coords) {

    // change the state of the piece/square to selected
    currentTable[coords[0]][coords[1]][state] = selected;
    squares[coords[0]][coords[1]].classList.add("selected")
  },

  getAvailableMoves: function () {
    let availableMoves = [];
    for (let i = 0; i < currentTable.length; ++i) {
      for (let j = 0; j < currentTable[i].length; ++j) {
        if (table[i][j][state] == available)
          availableMoves.push([i, j]);
      }
    }
  },

  getSelectedCoords: function () {
    for (let i = 0; i < currentTable.length; ++i) {
      for (let j = 0; j < currentTable[i].length; ++j) {
        if (currentTable[i][j][state] == selected)
          return [i, j];
      }
    }

  },

  move: function (moveCoords) {

    let availableMoves = getAvailableMoves();
    if (isValidMove(availableMoves, moveCoords)) {

      let selectedCoords = getSelectedCoords();
      let selectedSquare = sqares[selectedCoords[0]][selectedCoords[1]];
      let moveSquare = square[moveCoords[0]][moveCoords[1]];

      let path = getPath(table[selectedCoords[0]][selectedCoords[1]][piece]);

      if (moveSquare.childNodes[0]) {
        moveSquare.removeChild(moveSquare.firstChild);
      }

      // update the user interface
      let img = moveSquare.appendChild(document.createElement("img"));
      img.src = path;
      img.classList.add("piece");
      selectedSquare.removeChild(selectedSquare.firstChild);
      whiteTurn = !whiteTurn;

      //update the current table
      let selectedPiece = currentTable[selectedCoords[0][selectedCoords[1]]]
      currentTable[selectedCoords[0][selectedCoords[1]]] = empty;
      currentTable[moveCoords[0]][moveCoords[1]] = selectedPiece;
    }
  },

  executeInput: function (square) {
    let squareCoords = getSquareCoords(square);
    if (this.alreadyHaveSelected()) {
      // check if its available move and move it...
      if (isValidMove(squareCoords)) {
        move(squareCoords)//pseudo
      }
      // if the player selects other piece of hes own.
      else {
        if (isValidSelction(squareCoords)) {
          selectPiece(squareCoords);
          HighlightAvailableMoves(squareCoords)//pseudo
        }
      }
    }
    else {
      // check if the selection is right and if so select the piece
      if (isValidSelction(squareCoords)) {
        selectPiece(squareCoords);
        HighlightAvailableMoves(squareCoords)//pseudo
      }

    }
  },
}

GameEngine.init();
GameEngine.resetGame();

function readInput() {
  GameEngine.executeInput(this);
}

