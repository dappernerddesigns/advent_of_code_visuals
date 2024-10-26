const screen = document.getElementById("screen");
const go = document.getElementById("go");
const inputTextBox = document.getElementById("inputArea");

for (let i = 0; i < 6; i++) {
  const rowContainer = document.createElement("div");
  rowContainer.setAttribute("class", "row-container");
  for (let j = 0; j < 50; j++) {
    const pixelContainer = document.createElement("div");
    pixelContainer.setAttribute("class", "pixel-container");
    rowContainer.appendChild(pixelContainer);
  }
  screen.appendChild(rowContainer);
}

let inputTextNew;
inputTextBox.addEventListener("blur", (e) => {
  inputTextNew = e.target.value;
});

const row = new Array(50).fill(" ");
const screenArr = new Array(6).fill(row);

go.addEventListener("click", () => {
  console.log("clicked");
  const instructions = inputTextNew.split("\n");
  inputTextBox.value = "";
  runAnimation(instructions, screenArr);
});

const rectangles = (instr, screen) => {
  const size = instr.split(" ").pop();
  const [width, height] = size.split("x");
  for (let row = 0; row < +height; row++) {
    for (let col = 0; col < +width; col++) {
      screen[row][col] = "#";
    }
  }
};
const rotator = (line, value) => {
  const output = [];
  const rowLength = line.length;
  for (let i = 0; i < rowLength; i++) {
    const nextPosition = i + value;
    if (line[nextPosition]) {
      output[nextPosition] = line[i];
    } else {
      const newPosition = nextPosition - rowLength;
      output[newPosition] = line[i];
    }
  }
  return output;
};
const makeDisplay = (instr, screen) => {
  if (instr.startsWith("rect")) {
    rectangles(instr, screen);
  } else {
    const [_, rolCol, target, by, value] = instr.split(" ");
    const val = Number(value);
    if (rolCol === "row") {
      const [_, rowStr] = target.split("=");
      const row = Number(rowStr);
      const pixelsToRotate = screen[row];
      const rotated = rotator(pixelsToRotate, val);
      screen[row] = rotated;
    } else {
      const [_, column] = target.split("=");

      const col = Number(column);

      const pixelsToRotate = screen.map((row) => {
        return row[col];
      });
      const rotatedPixels = rotator(pixelsToRotate, val);
      for (let i = 0; i < screen.length; i++) {
        const row = screen[i];
        row[col] = rotatedPixels[i];
      }
    }
  }

  return screen;
};

const runAnimation = async (instructions, screenData) => {
  for (let i = 0; i < instructions.length; i++) {
    makeDisplay(instructions[i], screenData);

    screenData.forEach((row, index) => {
      for (let i = 0; i < row.length; i++) {
        while (screen.children[index].children[i].firstChild) {
          screen.children[index].children[i].removeChild(
            screen.children[index].children[i].firstChild
          );
        }
        const pixels = document.createElement("p");
        pixels.setAttribute("class", "pixel-glow");
        pixels.innerText = row[i];
        screen.children[index].children[i].appendChild(pixels);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};
