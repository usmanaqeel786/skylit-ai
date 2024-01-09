const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, INTEGER, DECIMAL } = require("sequelize");
const routes = require("./routes/index.route");
const WebSocket = require("ws");
const { TradeQuote, OpenInterest } = require("./models");

const app = express();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "127.0.0.1",
  username: "postgres",
  password: "1234",
  database: "skylit-ai",
});

app.use(bodyParser.json());
app.use("/api", routes);

// WebSocket server URL
const serverURL = "ws://127.0.0.1:25520/v1/events";

// Message to send
const messageToSend = {
  msg_type: "STREAM_BULK",
  sec_type: "OPTION",
  req_type: "TRADE",
  add: true,
  id: 0,
};

// Create a WebSocket connection
const socket = new WebSocket(serverURL);

// Event listener for connection open
socket.on("open", () => {
  console.log("Connected to the WebSocket server");
  socket.send(JSON.stringify(messageToSend));
});

let counter = 0;
// Event listener for incoming messages
// socket.on("message", async (message) => {
//   const currentDate = new Date();

//   // Add one month to the current date
//   currentDate.setMonth(currentDate.getMonth() + 1);

//   // Format the date as YYYYMMDD
//   const year = currentDate.getFullYear();
//   const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
//   const day = currentDate.getDate().toString().padStart(2, "0");

//   const formattedDate = year + month + day;
//   let counterStatus = "No Status";
//   let object = {};
//   const result = JSON.parse(message.toString());
//   if (
//     result.header.type === "TRADE" &&
//     result.contract.root === "SPXW" &&
//     result.contract.expiration <= formattedDate
//   ) {
//     if (result.trade.price === result.quote.ask) {
//       counter++;
//       counterStatus = "Incremented";
//       await TradeQuote.create({
//         counter_value: counter,
//         counter_status: counterStatus,
//         root: result.contract.root,
//         date: result.trade.date,
//         expiration: result.contract.expiration,
//         strike: result.contract.strike,
//         right: result.contract.right,
//       });
//       console.log(`Counter: ${counter} Status: ${counterStatus} }`);
//     } else if (result.trade.price === result.quote.bid) {
//       counter--;
//       counterStatus = "Decremented";
//       await TradeQuote.create({
//         counter_value: counter,
//         counter_status: counterStatus,
//         root: result.contract.root,
//         date: result.trade.date || result.quote.date,
//         expiration: result.contract.expiration,
//         strike: result.contract.strike,
//         right: result.contract.right,
//       });
//       console.log(`Counter: ${counter} Status: ${counterStatus} }`);
//     } else {
//       delete object.keys;
//       delete object.values;
//     }
//   }
// });
socket.on("message", async (message) => {
  const currentDate = new Date();

  // Add one month to the current date
  currentDate.setMonth(currentDate.getMonth() + 1);

  // Format the date as YYYYMMDD
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  let counterStatus = "No Status";
  const result = JSON.parse(message.toString());

  if (
    result.header.type === "TRADE" &&
    result.contract.root === "SPXW" &&
    result.contract.expiration <= formattedDate
  ) {
    let dateToUse = result.trade.date || result.quote.date;

    if (result.trade.price === result.quote.ask) {
      counter++;
      counterStatus = "Incremented";
    } else if (result.trade.price === result.quote.bid) {
      counter--;
      counterStatus = "Decremented";
    }

    await TradeQuote.create({
      counter_value: counter,
      counter_status: counterStatus,
      date: dateToUse,
      root: result.contract.root,
      expiration: result.contract.expiration,
      strike: result.contract.strike,
      right: result.contract.right,
    });

    let openint = await OpenInterest.findOne({
      where: {
        root: String(result.contract.root),
        expiration: INTEGER(result.contract.expiration),
        strike: DECIMAL(result.contract.strike),
        right: String(result.contract.right),
      },
    });
    if (openint) {
      openint.counter = counter;
      openint.ddoi = counter + openint.open_interest;

      await openint.save();
    }

    console.log(`Counter: ${counter} Status: ${counterStatus}`);
  }
});

// Check the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync().then(() => {
  console.log("Database synchronized");
  // Start the server
  app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
  });
});
