const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.get("/get_data", (req, res) => {
  //Если страница обновляется, придется заново обрабатывать объявления, но дублироваться в completedList они в итоге не будут.
  // Можно решить здесь, а можно и через cookies/localStorage(я решать не стал =) )
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  fs.readFile("data/dataList.json", "utf8", (err, data) => {
    const checkedAdList = JSON.parse(
      fs.readFileSync("data/completedList.json", "utf8")
    );
    const adList = JSON.parse(data);
    const results = {};
    //Проверочка на длины массивов начальных и проверенных данных, если сравняются, вернем заглушку
    if (checkedAdList.length < adList.length) {
      if (endIndex < adList.length) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      } else results.next = false;

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      results.allAdsCompleted = false;
      results.body = adList.slice(startIndex, endIndex);
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
    //Создаем коллекцию существующих id
    const ids = new Set(checkedAds.map((el) => el.id));
    //Убираем дубликаты
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
