
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
  available: [],
  selected: [],
  board: document.getElementById("chess-board"),


  // Using chars to represent a single piece in the table.



  /* Starting possitions of all of the pieces
     We are going to use this table to check if the move
     is valid or not,and move the pieces accordingly.
  */
  initialTable:
    [
      [wRook, wKnight, wBishop, wKing, wQueen, wBishop, wKnight, wRook],
      [wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn],
      [bRook, bKnight, bBishop, bKing, bQueen, bBishop, bKnight, bRook]
    ],

  currentTable:
    [
      [wRook, wKnight, wBishop, wKing, wQueen, wBishop, wKnight, wRook],
      [wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn],
      [bRook, bKnight, bBishop, bKing, bQueen, bBishop, bKnight, bRook]
    ],




  // Methods
  /*Initialize the board with white and black squares
      and save the squares in an array so we can loop thru them
  */
  init: function () {

    // assign the board

    for (var i = 0; i < 8; i++) {
      var collumn = [];
      for (var j = 0; j < 8; j++) {
        var square = document.createElement("div");
        if ((i + j) % 2 == 0) {
          this.board.appendChild(square).classList.add("white-square");

        }
        else {
          this.board.appendChild(square).classList.add("black-square");
        }
        square.addEventListener("click", readInput);
        collumn.push(square);
      }
      this.squares.push(collumn);
    }
  },

  // Using the initialTable,set the pieces at starting positions.
  resetGame: function () {

    for (let i = 0; i < this.squares.length; ++i) {
      for (let j = 0; j < this.squares[i].length; ++j) {

        let path = this.getPath(this.initialTable[i][j]);
        let square = this.squares[i][j];

        if (square.childNodes[0])
          square.removeChild(this.squares[i][j].firstChild);

        if (path == this.empty) continue;
        var img = square.appendChild(document.createElement("img"));
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

  isEmptySquare: function (coordsY, coordsX) {
    return this.currentTable[coordsY][coordsX] == empty;
  },
  atStartingPosition(coordsY, coordsX) {
    return this.currentTable[coordsY][coordsX] == this.initialTable[coordsY][coordsX];
  },

  markAvailablePawnMoves: function (piece, squareCoords) {

    let squareCoordsY = squareCoords[0];
    let squareCoordsX = squareCoords[1];
    switch (piece) {
      case wPawn:
        // if the pawn is at starting position
        // highlight the two squares in front.
        if (this.atStartingPosition(squareCoordsY, squareCoordsX)) {

          if (this.isEmptySquare(squareCoordsY + 1, squareCoordsX)) {
            this.available.push([squareCoordsY + 1, squareCoordsX]);

            if (this.isEmptySquare(squareCoordsY + 2, squareCoordsX))
              this.available.push([squareCoordsY + 2, squareCoordsX]);
          }
        }
        // highlight the square in front of the pawn
        else if (squareCoordsY + 1 <= currentTable.length) {
          if (this.isEmptySquare(squareCoordsY + 1, squareCoordsX)) {
            this.available.push([squareCoordsY + 1, squareCoordsX]);
          }
        }

        // if pawn can capture a piece on the left
        if (squareCoordsX - 1 >= 0 && squareCoordsY + 1 <= this.currentTable.length) {
          switch (this.currentTable[squareCoordsY + 1][squareCoordsX - 1]) {
            case bPawn: case bBishop: case bRook: case bKnight:
            case bQueen:
              this.available.push([squareCoordsY + 1, squareCoordsX - 1]);
          }
        }

        // if pawn can capture a piece on the right
        if (squareCoordsX + 1 <= 8 && squareCoordsY + 1 <= 8) {
          switch (this.currentTable[squareCoordsY + 1][squareCoordsX + 1]) {
            case bPawn: case bBishop: case bRook: case bKnight:
            case bQueen:
              this.available.push([squareCoordsY + 1, squareCoordsX + 1]);
          }
        }
    }
  },


  HighlightAvailableMoves: function (squareCoords) {
    // get the piece in that square
    piece = this.getSquaresPiece(squareCoords);

    switch (piece) {
      case bPawn:
      case wPawn:
        this.markAvailablePawnMoves(piece, squareCoords);
        break;
    }

    for (let i = 0; i < this.available.length; ++i) {
      let markY = this.available[i][0];
      let markX = this.available[i][1];
      this.squares[markY][markX].classList.add("available");
    }
  },

  getSquareCoords: function (square) {

    for (let i = 0; i < this.squares.length; ++i) {
      for (let j = 0; j < this.squares[i].length; ++j) {
        if (this.squares[i][j] == square)
          return [i, j];
      }
    }
  },

  getSquaresPiece: function (squaresCoords) {


    return this.currentTable[squaresCoords[0]][squaresCoords[1]];
  },

  alreadyHaveSelected: function (squareCoords) {

    return this.selected.length > 0;

  },

  isValidMove: function (coords) {
    for (let i = 0; i < this.available.length; ++i) {
      let canMove = true;
      for (let j = 0; j < 2; ++j) {
        if (this.available[i][j] != coords[j]) {
          canMove = false;
          break;
        }
      }
      console.log(canMove);
      if (canMove) return true;
    }
    return false;
  },


  selectPiece: function (coords) {

    this.selected = coords;
    let selectedY = this.selected[0];
    let selectedX = this.selected[1];
    this.squares[selectedY][selectedX].classList.add("selected");
  },


  eraseSelectedAndAvailable() {
    // remove the selected square
    let selectedY = this.selected[0];
    let selectedX = this.selected[1];
    this.squares[selectedY][selectedX].classList.remove("selected");
    this.selected = [];

    // remove the available squares
    for (let i = 0; i < this.available.length; ++i) {
      let availableY = available[i][0];
      let availableX = available[i][1];
      this.squares[availableY][availableX].classList.remove("available");
    }
    available = [];
  },

  move: function (moveCoords) {
    let moveCoordsY = moveCoords[0];
    let moveCoordsX = moveCoords[1];
    if (this.squares[moveCoordsY][moveCoordsX] == empty) {
      this.eraseSelectedAndAvailable();
      return;
    }
    if (this.isValidMove(moveCoords)) {

      let selectedY = this.selected[0];
      let selectedX = this.selected[1];

      let moveY = moveCoords[0];
      let moveX = moveCoords[1];
      let selectedSquare = this.squares[selectedY][selectedX];
      let moveSquare = this.squares[moveY][moveX];

      let path = this.getPath(this.currentTable[selectedY][selectedX]);

      if (moveSquare.childNodes[0]) {
        moveSquare.removeChild(moveSquare.firstChild);
      }

      // update the user interface
      let img = moveSquare.appendChild(document.createElement("img"));
      img.src = path;
      img.classList.add("piece");
      selectedSquare.removeChild(selectedSquare.firstChild);
      this.whiteTurn = !this.whiteTurn;

      //update the current table
      let selectedPiece = currentTable[selectedY][selectedX];
      this.currentTable[selectedY][selectedX] = empty;
      this.currentTable[moveY][moveX] = selectedPiece;
      console.log("!");
      eraseSelectedAndAvailable();
    }
  },

  // should fix this function
  executeInput: function (square) {
    let squareCoords = this.getSquareCoords(square);
    if (this.alreadyHaveSelected(squareCoords)) {

      // check if its available move and move it...
      if (this.isValidMove(squareCoords)) {
        console.log("YUP");
        this.move(squareCoords);
      }
      // if the player selects other piece of hes own.
      else {
        if (this.isValidSelection(squareCoords)) {
          this.selectPiece(squareCoords);
          this.HighlightAvailableMoves(squareCoords)
        }
      }
    }
    else {
      // check if the selection is right and if so select the piece
      if (this.isValidSelection(squareCoords)) {
        this.selectPiece(squareCoords);
        this.HighlightAvailableMoves(squareCoords)
      }

    }
  },


  isWhitePiece: function (coords) {

    switch (this.currentTable[coords[0]][coords[1]]) {
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


  isValidSelection: function (coords) {
    if (this.whiteTurn) {
      return this.isWhitePiece(coords);
    }
    else
      return !this.isWhitePiece(coords);
  },
}

GameEngine.init();
GameEngine.resetGame();

function readInput() {
  GameEngine.executeInput(this);
}

