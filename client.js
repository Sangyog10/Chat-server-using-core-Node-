const { rejects } = require("assert");
const net = require("net");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;

//socket is client , socket is duplex stream
const socket = net.createConnection(
  { host: "127.0.0.1", port: 3000 },
  async () => {
    //returns net.socket
    console.log("connected to server");

    const ask = async () => {
      const message = await rl.question("Enter a message > ");
      await moveCursor(0, -1); //move the cursor one line up
      await clearLine(0); //clear current line that the cursor is at
      socket.write(`${id}-message-${message}`);
    };

    ask();

    socket.on("data", async (data) => {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      if (data.toString("utf-8").substring(0, 2) === "id") {
        id = data.toString("utf-8").substring(3); //everything from third character
        console.log(`Your id is ${id}:\n`);
      } else {
        console.log(data.toString("utf-8"));
      }
      ask();
    });
  }
);

socket.on("end", () => {
  console.log("Connection was ended!!");
});
