const net = require("net");

const server = net.createServer(); //returns net.server

const clients = []; //array of clients

server.on("connection", (socket) => {
  console.log("A new connection is made");

  const clientId = clients.length + 1;

  clients.map((client) => {
    client.socket.write(`User ${clientId} has joined the server`);
  });

  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    clients.map((client) => {
      client.socket.write(`>User ${id}:${message}`);
    });
  });

  socket.on("end", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} has left the server`);
    });
  });

  clients.push({ id: clientId.toString(), socket });
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Server running at `, server.address());
});
