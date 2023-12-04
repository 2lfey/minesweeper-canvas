const settings = {
  grid: {
    horizontalCount: 16,
    verticalCount: 16,
    size: 30,
    color: "#6b7280",
  },
  item: {
    hidden: {
      borderTopLeft: "#d4d4d4",
      borderBottomRight: "#737373",
      color: "#a3a3a3",
    },
    flag: {
      color: "#e11d48",
      arrow: "#171717",
    },
    mine: {
      color: "#e11d48",
    },
    0: {
      color: "black",
    },
    1: {
      color: "#4f46e5",
    },
    2: {
      color: "#16a34a",
    },
    3: {
      color: "#e11d48",
    },
    4: {
      color: "#581c87",
    },
    5: {
      color: "#881337",
    },
    6: {
      color: "#059669",
    },
    7: {
      color: "#171717",
    },
    8: {
      color: "#fafafa",
    },
  },
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const isHorizontalOrientation = window.innerHeight < window.innerWidth;

canvas.height = settings.grid.verticalCount * settings.grid.size;
canvas.width = settings.grid.horizontalCount * settings.grid.size;

const countHorizontalLines = Math.round(canvas.width / settings.grid.size);
const countVerticalLines = Math.round(canvas.height / settings.grid.size);

// const drawHorizontalLines = (count) => {
//   for (let i = 0; i < count; ++i) {
//     const y = Math.round(canvas.height / count) * i;
//     ctx.beginPath();
//     ctx.strokeStyle = settings.grid.color;
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
//   }
// };

// const drawVerticalLines = (count) => {
//   for (let i = 0; i < count; ++i) {
//     const x = Math.round(canvas.width / count) * i;
//     ctx.beginPath();
//     ctx.strokeStyle = settings.grid.color;
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, canvas.height);
//     ctx.stroke();
//   }
// };

const drawHiddenItem = (x, y) => {
  ctx.fillStyle = settings.item.hidden.borderBottomRight;
  ctx.fillRect(x, y, settings.grid.size, settings.grid.size);

  ctx.beginPath();

  ctx.moveTo(x, y + settings.grid.size);
  ctx.lineTo(x, y);
  ctx.lineTo(x + settings.grid.size, y);

  ctx.fillStyle = settings.item.hidden.borderTopLeft;
  ctx.fill();

  ctx.fillStyle = settings.item.hidden.color;
  ctx.fillRect(x + 4, y + 4, settings.grid.size - 8, settings.grid.size - 8);
};

const drawRevealedItem = (x, y, color, count) => {
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

  if (count > 0) {
    ctx.font = "700 18px sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      count,
      column * settings.grid.size + settings.grid.size / 2,
      row * settings.grid.size + settings.grid.size / 2
    );
  }
};

const drawFlag = (x, y) => {
  y += 4;
  x += 4;

  ctx.beginPath();

  ctx.moveTo(x + settings.grid.size / 2, y);
  ctx.lineTo(x + settings.grid.size / 2, y + settings.grid.size / 2);
  ctx.lineTo(x + 3, y + settings.grid.size / 4);

  ctx.fillStyle = settings.item.flag.color;
  ctx.fill();

  ctx.beginPath();

  ctx.moveTo(x + settings.grid.size / 2 - 2, y);
  ctx.lineTo(x + settings.grid.size / 2 - 2, y + settings.grid.size / 2 + 4);

  x -= 3;

  ctx.moveTo(x + settings.grid.size / 4 + 2, y + settings.grid.size - 12);
  ctx.lineTo(x + settings.grid.size / 2 + 6, y + settings.grid.size - 12);

  ctx.lineWidth = 4;
  ctx.strokeStyle = settings.item.flag.arrow;

  ctx.stroke();
};

const drawMine = (x, y) => {
  const circle = 2 * Math.PI;
  const angleIncrement = circle / 8;
  const centerX = x + settings.grid.size / 2;
  const centerY = y + settings.grid.size / 2;

  ctx.lineWidth = 4;
  ctx.strokeStyle = settings.item.mine.color;

  for (let i = 1; i <= 8; ++i) {
    const angle = i * angleIncrement;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, 5, angle, angle + angleIncrement);

    const cosa = Math.cos(angle);
    const sina = Math.sin(angle);

    ctx.lineTo(
      centerX + 10 * cosa,
      centerY + 10 * sina
    );

    ctx.stroke();
  }
};

const setupCanvas = () => {
  // Remove previous scatch
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < countHorizontalLines; ++i) {
    for (let j = 0; j < countVerticalLines; ++j) {
      drawHiddenItem(i * settings.grid.size, j * settings.grid.size);
    }
  }
};
