const onReveal = (column, row, item) => {
  console.log(`[onReveal] Reveal ${column} x ${row} cell`);
};

const onMine = (column, row) => {
  console.log("[onMine]");

  drawMine(column * settings.grid.size, row * settings.grid.size);
};

const onSpace = (column, row, item) => {
  // console.log(`[onSpace] Space on ${column}, ${row}`);

  drawRevealedItem(
    column * settings.grid.size,
    row * settings.grid.size,
    settings.item[item.countAdjacentMines].color,
    item.countAdjacentMines
  );
};

const onStart = () => {
  console.log("[onStart]");

  timer.start();
};

const onFail = () => {
  console.log("[onFail] Game over");

  restartBtn.innerText = "Oh no!";

  timer.stop();
};

const onVictory = () => {
  console.log("[onVictory] Victory");

  restartBtn.innerText = "Yes! Yes! Yes!";

  timer.stop();
};

const onFlug = (column, row) => {
  console.log("[onFlug]");

  drawFlag(column * settings.grid.size, row * settings.grid.size);

  renderNumber(mineCount, board.mineCount - board.flagCount);
};

const onUnflug = (column, row) => {
  console.log("[onUnflag]");

  drawHiddenItem(column * settings.grid.size, row * settings.grid.size);

  renderNumber(mineCount, board.mineCount - board.flagCount);
};
