const xLen = 100;

const xSize = 10;
const ySize = 10;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const rand = (x) => {
  const res = Math.sin(x) * 10000;
  const I = Math.floor(res);
  return res - I;
};

const smoothstep = (min, max, x) => {
  if (x < min) return 0;
  if (x > max) return 1;
  t = (x - min) / (max - min);
  return t * t * (3 - 2 * t);
};

const mix = (x, y, a) => x * (1 - a) + y * a;

let x = Array.from({ length: xLen }, (_, x) => x / xSize);

let y = x.map((x, i, arr) => {
  const I = Math.floor(x);
  const F = x - I;

  let y;

  y = Math.sin(x) * 256;  // rand(x)

  y = y - Math.floor(y)
  // y = rand(I);
  // y = mix(rand(I), rand(I + 1), F);

  // y = mix(rand(I), rand(I + 1), smoothstep(0, 1, F));

  return y;
});



canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

canvas.classList.add("bg-white");

const graph = (x, y) => {
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: x,
      datasets: [
        {
          backgroundColor: "#e11d48",
          borderColor: "#678952",
          data: y,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "X",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Y",
          },
        },
      },
    },
  });

  chart.update();
};

graph(x, y);
