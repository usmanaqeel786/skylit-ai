const axios = require("axios");
const { spawn } = require("child_process");
const fs = require("fs");
const { OpenInterest } = require("../models");
const { random } = require("lodash");

class MainController {
  async calculateCounter(req, res) {
    try {
      const { req_type, sec, root, start_date, end_date, exp, ivl } = req.body;

      const response = await axios.get(
        `http://127.0.0.1:25510/bulk_at_time/${req_type}/${sec}?root=${root}&start_date=${start_date}&end_date=${end_date}&exp=${exp}&ivl=${ivl}`
      );

      const responseData = response.data;
      const format = responseData.header.format;

      const mappedData = responseData.response.map((item) => {
        const ticks = item.ticks[0];

        const mappedObject = format.reduce((acc, key, index) => {
          acc[key] = ticks[index];
          return acc;
        }, {});
        return mappedObject;
      });

      res.json(mappedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async registerOpenInterest(req, res) {
    try {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 1);
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");

      const formattedDate = year + month + day;

      const response = await axios.get(
        `http://127.0.0.1:25510/bulk_snapshot/option/open_interest?root=SPXW&exp=0`
      );

      const responseData = response.data;
      const formatKeys = responseData.header.format;
      const formattedData = responseData.response.map((entry) => {
        const { ms_of_day, open_interest, date } = entry.tick.reduce(
          (acc, value, index) => {
            acc[formatKeys[index]] = value;
            return acc;
          },
          {}
        );

        return {
          ms_of_day,
          open_interest,
          date,
          root: entry.contract.root,
          expiration: entry.contract.expiration,
          strike: entry.contract.strike,
          right: entry.contract.right,
        };
      });
      OpenInterest.bulkCreate(formattedData)
        .then((data) => {
          res.json({
            msg: "Records inserted successfully",
            data,
          });
        })
        .catch((error) => {
          console.error("Error inserting records:", error);
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async pythonScriptStreaming(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const python = spawn("python", ["scripts/option_trade_streaming.py"]);

    python.stdout.on("data", (data) => {
      console.log("Streaming data from python script ...");
      fs.readFile("stream.txt", "utf8", function (err, data) {
        if (err) throw err;
        processStreamData(data.toString())
          .then((counterChange) => {
            res.write(
              `data: ${JSON.stringify({ counter_change: counterChange })}\n\n`
            );
          })
          .catch((error) => {
            console.error("Error processing stream data:", error.message);
          });
        console.log(data);
      });
    });

    python.on("close", (code) => {
      console.log(`Child process close all stdio with code ${code}`);
    });

    req.on("close", () => {
      console.log("Client disconnected");
    });
  }

  async processStreamData(data) {
    try {
      const { con, trade } =
        "con: root: SPXW isOption: True exp: 2023 - 12 - 11 strike: 4615.0 isCall: True quote: ms_of_day: 10597054 bid_size: 76 bid_exchange: XCBO bid_price: 3.6 bid_condition: NATIONAL_BBO ask_size: 98 ask_exchange: XCBO ask_price: 3.8 ask_condition: NATIONAL_BBO date: 2023 - 12 - 11 ";

      const { root, expiration, strike, isCall } = con;
      const { price, bid_price, ask_price, bid_size, ask_size, size } = trade;

      let counterChange = 0;

      if (price >= ask_price) {
        counterChange -= size;
      } else if (price <= bid_price && bid_size < trade.bid_size) {
        counterChange += size;
      } else if (bid_size < trade.bid_size || ask_size < trade.ask_size) {
        counterChange += size;
      }

      // Store the data in PostgreSQL
      await pool.query(
        "INSERT INTO your_table_name (root, expiration, strike, is_call, price, bid_price, ask_price, bid_size, ask_size, size, counter_change) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [
          root,
          expiration,
          strike,
          isCall,
          price,
          bid_price,
          ask_price,
          bid_size,
          ask_size,
          size,
          counterChange,
        ]
      );

      // Return the counter change
      return counterChange;
    } catch (error) {
      console.error("Error processing stream data:", error.message);
      return 0; // Return 0 if an error occurs
    }
  }

  async getOpenInterest(req, res) {
    OpenInterest.findAll()
      .then((openInterests) => {
        res.send(openInterests);
      })
      .catch((err) => {
        // Handle any errors that occurred during the findAll operation
        console.error("Error retrieving open interests:", err);
      });
  }

  async getNetNotionalGamma(req, res) {
    const yValues = Array.from({ length: 81 }, (_, index) => 4815 - index * 5);

    const today = new Date();
    const xDates = Array.from({ length: 5 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date.toISOString().split("T")[0];
    });

    const data = yValues.map(() =>
      Array.from({ length: 5 }, () => random(-5000, 5000))
    );

    res.json({ yValues, xDates, data });
  }
}

module.exports = new MainController();
