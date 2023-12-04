const _xmlns = "http://www.w3.org/2000/svg";

const _paths = {
  64: "M32.0711 25H67.9289L92.9289 0L7.07107 0L32.0711 25Z", // top
  32: "M75 67.9289L87.5 80.4289L100 67.9289V7.07107L75 32.0711V67.9289Z", // right
  16: "M32.0711 75L19.5711 87.5L32.0711 100H67.9289L80.4289 87.5L67.9289 75H32.0711Z", // mid
  8: "M25 32.0711L0 7.07107V67.9289L12.5 80.4289L25 67.9289V32.0711Z", // left
  4: "M0 167.929L25 142.929V107.071L12.5 94.5711L0 107.071V167.929Z", // left2
  2: "M100 107.071L87.5 94.5711L75 107.071V142.929L100 167.929V107.071Z", // right2
  1: "M92.9289 175L67.9289 150H32.0711L7.07107 175H92.9289Z", // bottom
};

const _numbers = {
  // top, right, mid, left, left2, right2, bottom
  0: 0x6f,
  1: 0x22,
  2: 0x75,
  3: 0x73,
  4: 0x3a,
  5: 0x5b,
  6: 0x5f,
  7: 0x62,
  8: 0x7f,
  9: 0x7b,
};

const renderNumber = (container, value) => {
  container.innerHTML = ""

  const digits = value.toString().padStart(3, '0').split('');

  for (const digit of digits) {

    const num = _numbers[digit];

    const svg = document.createElementNS(_xmlns, "svg");

    svg.setAttributeNS(null, "width", "19");
    svg.setAttributeNS(null, "height", "23");
    svg.setAttributeNS(null, "viewBox", "0 0 100 185");

    for (const [key, value] of Object.entries(_paths)) {
      const path = document.createElementNS(_xmlns, "path");

      path.setAttributeNS(null, "d", value);
      path.setAttributeNS(null, "fill", "currentColor");
      path.classList.add(num & key ? "text-red-600" : "text-red-600/40");

      svg.appendChild(path);
    }

    container.appendChild(svg);
  }
};

const createNumberContainer = (value = 0) => {
  const container = document.createElement("div");
  container.className =
    "h-full bg-black border-4 border-neutral-300 border-l-neutral-500 border-t-neutral-500 flex items-center justify-center p-1";

  renderNumber(container, value);

  return container;
};
