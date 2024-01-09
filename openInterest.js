const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");

const thetaDataCredentials = {
  username: "jimin@skylit.ai",
  password: "Glitch!2023",
}; // Replace with your ThetaData credentials

const app = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ThetaData server is running!\n");
});

const io = new Server(app);

const thetaDataStreamUrl = "https://api.thetadata.com";

io.on("connection", (socket) => {
  console.log("Client connected");

  const subscribeToOpenInterest = async () => {
    try {
      const response = await axios.post(
        `${thetaDataStreamUrl}/v1/open_interest/subscribe`,
        {
          symbols: ["SPX", "SPXW"],
        },
        {
          auth: thetaDataCredentials,
        }
      );
      console.log("Subscribed to open interest:", response.data);
    } catch (error) {
      console.error("Error subscribing to open interest:", error.message);
    }
  };

  subscribeToOpenInterest();

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
