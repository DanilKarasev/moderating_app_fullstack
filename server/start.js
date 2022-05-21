const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.get("/get_data", (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  //Reading completed tasks file and comparing it with currents. Returning difference of completed\uncompleted.
  // => start index is always 0
  const startIndex = 0;
  const endIndex = limit;

  fs.readFile("data/dataList.json", "utf8", (err, data) => {
    const checkedAdList = JSON.parse(
      fs.readFileSync("data/completedList.json", "utf8")
    );
    const checkedAdsIds = new Set(checkedAdList.map((el) => el.id));
    const rawAdList = JSON.parse(data);

    const readyAdList = rawAdList.filter((el) => !checkedAdsIds.has(el.id));
    const results = {};
    //Checking that tasks still exist
    if (readyAdList.length !== 0) {
      if (endIndex < readyAdList.length) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      } else results.next = false;
      results.allAdsCompleted = false;
      results.body = readyAdList.slice(startIndex, endIndex);
    } else {
      results.body = [];
      results.allAdsCompleted = true;
      results.next = false;
    }
    res.send(results);
  });
});

const jsonParser = bodyParser.json();
app.post("/send_data", jsonParser, (req, res) => {
  fs.readFile("data/completedList.json", "utf8", (err, data) => {
    const checkedAds = JSON.parse(data);
    const newCheckedAds = req.body;
    //Making a collection of existing ids
    const ids = new Set(checkedAds.map((el) => el.id));
    //Removing duplicates
    const uniqueCheckedAds = [
      ...checkedAds,
      ...newCheckedAds.filter((d) => !ids.has(d.id)),
    ];
    fs.writeFile(
      "data/completedList.json",
      JSON.stringify(uniqueCheckedAds.sort((a, b) => a.id - b.id)),
      (err) => {
        if (err) {
          console.log(err.message);
        } else console.log("Data added!");
        res.end();
      }
    );
  });
});

app.put("/clear_data", jsonParser, (req, res) => {
  fs.writeFile("data/completedList.json", "[]", (err) => {
    if (err) {
      console.log(err.message);
    } else console.log("Data cleared!");
    res.end();
  });
});
