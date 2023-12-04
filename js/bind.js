const timerBlock = document.getElementById("timer");
const mineCountBlock = document.getElementById("mineCount");
const restartBtn = document.getElementById("restartBtn");
const mineCount = createNumberContainer(0)

const diff8x8 = document.querySelector('#diff8x8')
const diff16x16 = document.querySelector('#diff16x16')
const diff40x16 = document.querySelector('#diff40x16')

const getDifficult = () => {
  return {
    [diff8x8.checked]: DIFF8X8,
    [diff16x16.checked]: DIFF16X16,
    [diff40x16.checked]: DIFF40X16,
  }[true]
}

let timer = createTimer(timerBlock);

mineCountBlock.appendChild(mineCount);

setupCanvas();

const { board, reveal, flag } = createBoard(
  countHorizontalLines,
  countVerticalLines
);

restartBtn.addEventListener("click", () => {
  timerBlock.innerHTML = "";
  timer.stop();
  timer = createTimer(timerBlock);

  clearBoard(board);

  fillBombs(board);

  shuffleItems(board);

  calcAdjacentMines(board);

  setupCanvas();

  renderNumber(mineCount, board.mineCount - board.flagCount)
});

renderNumber(mineCount, board.mineCount - board.flagCount)

const onLeftClick = (column, row) => {
  // console.log(`Reveal on ${column}, ${row}`);
  reveal(column, row);
};

const onRightClick = (column, row) => {
  // console.log(`Flag ${column}, ${row}`);
  flag(column, row);
};

canvas.addEventListener("contextmenu", (e) => e.preventDefault());
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const column = Math.floor(x / settings.grid.size);
  const row = Math.floor(y / settings.grid.size);

  if (e.button === 0) {
    onLeftClick(column, row);
  } else if (e.button === 2) {
    onRightClick(column, row);
  }
});

const onReveal = (column, row, item) => {
  console.log(`[onReveal] Reveal ${column} x ${row} cell`);
};

const onMine = (column, row) => {
  console.log("[onMine]");

  drawMine(column * settings.grid.size, row * settings.grid.size);
};

const onSpace = (column, row, item) => {
  console.log(`[onSpace] Space on ${column}, ${row}`);

  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size,
    row * settings.grid.size,
    settings.grid.size,
    settings.grid.size
  );

  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(
    column * settings.grid.size + 1,
    row * settings.grid.size + 1,
    settings.grid.size - 2,
    settings.grid.size - 2
  );

  if (item.countAdjacentMines > 0) {
    ctx.font = "700 18px sans-serif";
    ctx.fillStyle = settings.item[item.countAdjacentMines].color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      item.countAdjacentMines,
      column * settings.grid.size + settings.grid.size / 2,
      row * settings.grid.size + settings.grid.size / 2
    );
  }
};

const onStart = () => {
  console.log("[onStart]");

  timer.start();
};

const onFail = () => {
  console.log("[onFail] Game over");

  timer.stop();
};

const onVictory = () => {
  console.log("[onVictory] Victory");

  timer.stop();
};

const onFlug = (column, row) => {
  console.log("[onFlug]");

  drawFlag(column * settings.grid.size, row * settings.grid.size);

  renderNumber(mineCount, board.mineCount - board.flagCount)
};

const onUnflug = (column, row) => {
  console.log("[onUnflag]");

  drawHiddenItem(column * settings.grid.size, row * settings.grid.size);

  renderNumber(mineCount, board.mineCount - board.flagCount)
};

const events = [
  { onReveal },
  { onMine },
  { onSpace },
  { onStart },
  { onFail },
  { onVictory },
  { onFlug },
  { onUnflug },
];

events.forEach((obj) => {
  const [event, callback] = Object.entries(obj)[0];
  appendEventListener(board, event, callback);
});
