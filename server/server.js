// const { faker } = require("@faker-js/faker");

const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

// Создал json с данными объявлений
// const data = [];
//
// for (let i = 0; i < 50; i++) {
//   const fakeDate = faker.date.recent(20);
//   const fakeDateString = fakeDate.toLocaleString().split(",");
//
//   data.push({
//     id: i + 1,
//     publishDate: Date.parse(fakeDate),
//     publishDateString: `${fakeDateString[0].slice(
//       0,
//       5
//     )},${fakeDateString[1].slice(0, 6)}`,
//     ownerId: i + +(Math.random() * 37653).toFixed(0),
//     ownerLogin: faker.name.findName(),
//     bulletinSubject: `Объявление №${i + 1} ${faker.lorem.words(3)}`,
//     bulletinText: `<p>${faker.lorem.paragraphs(
//       Math.random() * 2
//     )}</p><ul><li>${faker.lorem.lines(1)}</li><li>${faker.lorem.lines(
//       1
//     )}</li><li>${faker.lorem.lines(1)}</li></ul><p>${faker.lorem.paragraphs(
//       Math.random() * 2
//     )}</p>`,
//     bulletinImages: [
//       "https://static.baza.farpost.ru/v/1510541224458_hugeBlock",
//     ],
//   });
// }
// fs.writeFile("data/dataList.json", JSON.stringify(data), () => {
//   console.log("Записали");
// });

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.get("/get_data", (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  fs.readFile("data/dataList.json", "utf8", (err, data) => {
    const adList = JSON.parse(data);
    const results = {};
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

    results.body = adList.slice(startIndex, endIndex);

    res.send(results);
  });
});
