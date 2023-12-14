let count = 0;

const DIFF9X9 = {
  x: 9,
  y: 9,
  p: 0.12345679012,
};

const DIFF16X16 = {
  x: 16,
  y: 16,
  p: 0.15625,
};

const DIFF30X16 = {
  x: 30,
  y: 16,
  p: 0.20625,
};

/**
 * Creates a new item object.
 *
 * @return {object} The newly created item.
 */
const createItem = () => {
  const item = {
    // isMine: Math.round(Math.random()) === 1,
    isMine: false,
    isFlagged: false,
    isRevealed: false,
    countAdjacentMines: 0,
  };

  return item;
};

/**
 * Calculates the number of adjacent mines for each item on the board.
 *
 * @param {object} board - The board object containing information about the board.
 */
const calcAdjacentMines = (board) => {
  const { columns, rows, items } = board;

  items.forEach((item, index) => {
    if (item.isMine) {
      return;
    }

    // What the fuck?

    const row = Math.floor(index / columns);
    const column = index % columns;

    if (row > 0) {
      item.countAdjacentMines += items[index - columns].isMine ? 1 : 0; // top

      if (column > 0) {
        item.countAdjacentMines += items[index - columns - 1].isMine ? 1 : 0; // top-left
      }

      if (column < columns - 1) {
        item.countAdjacentMines += items[index - columns + 1].isMine ? 1 : 0; // top-right
      }
    }

    if (column < columns - 1) {
      item.countAdjacentMines += items[index + 1].isMine ? 1 : 0; // right
    }

    if (row < rows - 1) {
      item.countAdjacentMines += items[index + columns].isMine ? 1 : 0; // bottom

      if (column > 0) {
        item.countAdjacentMines += items[index + columns - 1].isMine ? 1 : 0; // bottom-left
      }

      if (column < columns - 1) {
        item.countAdjacentMines += items[index + columns + 1].isMine ? 1 : 0; // bottom-right
      }
    }

    if (column > 0) {
      item.countAdjacentMines += items[index - 1].isMine ? 1 : 0; // left
    }
  });
};

/**
 * Reveals all items on the board.
 *
 * @param {object} board - The board object containing the items.
 * @return {void} This function does not return a value.
 */
const revealAll = (board) => {
  board._isRevialing = true;

  for (const index in board.items) {
    const row = Math.floor(index / board.columns);
    const column = index % board.columns;

    reveal(column, row);
  }

  board._isRevialing = false;
};

/**
 * Reveals the neighboring cells of a given cell on the board.
 *
 * @param {number} board - the game board
 * @param {number} column - the column of the cell
 * @param {number} row - the row of the cell
 */
const revealCloud = (board, column, row) => {
  // Check top cell
  if (row > 0) {
    reveal(column, row - 1);

    // Check top-left cell
    if (column > 0) {
      reveal(column - 1, row - 1);
    }

    // Check top-right cell
    if (column < board.columns - 1) {
      reveal(column + 1, row - 1);
    }
  }

  // Check left cell
  if (column > 0) {
    reveal(column - 1, row);
  }

  // Check bottom cell
  if (row < board.rows - 1) {
    reveal(column, row + 1);

    // Check bottom-left cell
    if (column > 0) {
      reveal(column - 1, row + 1);
    }

    // Check bottom-right cell
    if (column < board.columns - 1) {
      reveal(column + 1, row + 1);
    }
  }

  // Check right cell
  if (column < board.columns - 1) {
    reveal(column + 1, row);
  }
};

/**
 * Adds an event listener to the board for a specific event type.
 *
 * @param {object} board - The board object.
 * @param {string} eventType - The type of event to listen for.
 * @param {function} callback - The callback function to be called when the event is triggered.
 */
const appendEventListener = (board, eventType, callback) => {
  console.log(`[addEventListener] ${eventType}`);

  board.events[eventType].push(callback);
};

/**
 * Triggers an event on the board.
 *
 * @param {object} board - The board object.
 * @param {string} eventType - The type of event to trigger.
 * @param {number} column - The column index.
 * @param {number} row - The row index.
 * @param {object} item - The item associated with the event.
 */
const triggerEvent = (board, eventType, column, row, item) => {
  board.events[eventType].forEach((callback) => {
    callback(column, row, item);
  });
};

/**
 * Remove an event listener from the board.
 *
 * @param {object} board - The board object.
 * @param {string} eventType - The type of event.
 * @param {function} callback - The callback function to remove.
 */
const removeEventListener = (board, eventType, callback) => {
  const events = board.events[eventType];
  const eventIndex = events.indexOf(callback);
  events = events.splice(eventIndex, 1);
};

const shuffleItems = (board) => {
  let currentIndex = board.items.length;
  let randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [board.items[currentIndex], board.items[randomIndex]] = [
      board.items[randomIndex],
      board.items[currentIndex],
    ];
  }
};

/**
 * Fills the board with bombs.
 *
 * @param {Object} board - The board object.
 */
const fillBombs = (board) => {
  for (let i = 0; i < board.mineCount; i++) {
    const item = board.items[i];
    item.isMine = true;
  }
};

const clearBoard = (board) => {
  board.items.forEach((item) => {
    item.isMine = false;
    item.isFlagged = false;
    item.isRevealed = false;
    item.countAdjacentMines = 0;
  });
  board.flagCount = 0;
  board._isFirstReveal = true;
}

/**
 * Creates a game board with the specified number of columns and rows.
 *
 * @param {object} diff - The difficulty level of the game.
 * @return {object} An object containing the game board and two functions,
 * reveal and flag, for interacting with the game board.
 */
const createBoard = (diff) => {
  console.log(`[createBoard] Creating board with ${diff.x} x ${diff.y} cells`);

  const board = {
    columns: diff.x,
    rows: diff.y,
    isStoped: false,
    flagCount: 0,
    revealCount: 0,
    mineCount: Math.round(diff.x * diff.y * diff.p),
    items: Array.from({ length: diff.x * diff.y }, () => createItem()),
    _isRevialing: false,
    _isFirstReveal: true,
    events: {
      onStart: [],
      onFail: [],
      onVictory: [],
      onMine: [],
      onSpace: [],
      onReveal: [],
      onFlug: [],
      onUnflug: [],
    },
  };

  /**
   * Reveals a cell on the game board.
   *
   * @param {number} column - The column index of the cell to reveal.
   * @param {number} row - The row index of the cell to reveal.
   */
  const reveal = (column, row) => {
    if (board.isStoped) {
      return;
    }

    const index = board.columns * row + column;

    const item = board.items[index];

    if (item.isFlagged || item.isRevealed) {
      return;
    }

    if (board._isFirstReveal) {
      board._isFirstReveal = false;
      triggerEvent(board, "onStart", column, row, item);
    }

    item.isRevealed = true;
    ++board.revealCount;

    if (item.isMine) {
      if (!board._isRevialing) {
        triggerEvent(board, "onFail", column, row, item);
        revealAll(board);
      }

      triggerEvent(board, "onMine", column, row, item);
      return;
    }

    if (
      !board._isRevialing && board.items.length - board.revealCount ===
      board.mineCount
    ) {
      triggerEvent(board, "onVictory");
      board.isStoped = true;
    }

    if (
      !board._isRevialing &&
      item.isRevealed &&
      item.countAdjacentMines === 0
    ) {
      revealCloud(board, column, row);
    }

    triggerEvent(board, "onSpace", column, row, item);
  };

  /**
   * Flags or unflags a cell on the board.
   *
   * @param {number} column - the column index of the cell
   * @param {number} row - the row index of the cell
   */
  const flag = (column, row) => {
    if (board.isStoped) {
      return;
    }
    
    const index = board.columns * row + column;
    const item = board.items[index];

    if (board.mineCount <= board.flagCount) {
      console.log("[flag] Not enough mines left to flag");
      return;
    }

    if (item.isRevealed) {
      return;
    }

    if (item.isFlagged) {
      console.log(`[flag] Unflagging cell ${index} [${column}, ${row}]`);
      --board.flagCount;
      item.isFlagged = false;
      triggerEvent(board, "onUnflug", column, row, item);
      return;
    }

    console.log(`[flag] Flagging cell ${index} [${column}, ${row}]`);

    ++board.flagCount;
    item.isFlagged = true;
    triggerEvent(board, "onFlug", column, row, item);
  };

  fillBombs(board);

  shuffleItems(board);

  calcAdjacentMines(board);

  return {
    board,
    reveal,
    flag,
  };
};
