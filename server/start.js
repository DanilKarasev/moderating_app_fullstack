const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.get("/get_data", (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  //Читаем файл выполненных задач и сравниваем его с текущими. Возвращаем разницу выполненных\невыполненных.
  // => начальный индекс всегда 0
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
    //Проверка на то что задачи еще имеются
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
