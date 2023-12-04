const canvas = document.getElementById("canvas");

const timerBlock = document.getElementById("timer");
const mineCountBlock = document.getElementById("mineCount");
const restartBtn = document.getElementById("restartBtn");

// Difficult radio
const diff9x9 = document.querySelector("#diff9x9");
const diff16x16 = document.querySelector("#diff16x16");
const diff30x16 = document.querySelector("#diff30x16");

// Events
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

const getDifficult = () => {
  const diff = {
    [diff9x9.checked]: DIFF9X9,
    [diff16x16.checked]: DIFF16X16,
    [diff30x16.checked]: DIFF30X16,
  }[true];

  return diff;
};

const mineCount = createNumberContainer(0);

let timer = createTimer(timerBlock);

mineCountBlock.appendChild(mineCount);

let currentDiff = null;
let settings = null;

let board = null,
  reveal = null,
  flag = null;

let drawHiddenItem = null,
  drawRevealedItem = null,
  drawFlag = null,
  drawMine = null,
  clearCanvas = null;

const start = () => {
  restartBtn.innerText = "Restart";

  currentDiff = getDifficult();

  settings = {
    ...defaultSettings,
    grid: {
      ...defaultSettings.grid,
      diff: currentDiff,
    },
  };

  const cnv = setupCanvas(canvas, settings);

  drawHiddenItem = cnv.drawHiddenItem;
  drawRevealedItem = cnv.drawRevealedItem;
  drawFlag = cnv.drawFlag;
  drawMine = cnv.drawMine;
  clearCanvas = cnv.clearCanvas;

  const brd = createBoard(currentDiff);

  board = brd.board;
  reveal = brd.reveal;
  flag = brd.flag;

  timerBlock.innerHTML = "";
  timer.stop();
  timer = createTimer(timerBlock);

  events.forEach((obj) => {
    const [event, callback] = Object.entries(obj)[0];
    appendEventListener(board, event, callback);
  });

  renderNumber(mineCount, board.mineCount - board.flagCount);
};

restartBtn.addEventListener("click", start);

start();

const onLeftClick = (column, row) => {
  // console.log(`Reveal on ${column}, ${row}`);
  reveal(column, row);
};

const onRightClick = (column, row) => {
  console.log(`Flag ${column}, ${row}`);
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
