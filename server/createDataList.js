const fs = require("fs");
const { faker } = require("@faker-js/faker");

const adsQuantity = 50;

const adds = [];

for (let i = 0; i < adsQuantity; i++) {
  const fakeDate = faker.date.recent(20);
  const fakeDateString = fakeDate.toLocaleString().split(",");

  adds.push({
    id: i + 1,
    publishDate: Date.parse(fakeDate),
    publishDateString: `${fakeDateString[0].slice(
      0,
      5
    )},${fakeDateString[1].slice(0, 6)}`,
    ownerId: i + +(Math.random() * 37653).toFixed(0),
    ownerLogin: faker.name.findName(),
    bulletinSubject: `Add №${i + 1} ${faker.lorem.words(3)}`,
    bulletinText: `<p>${faker.lorem.paragraphs(
      Math.random() * 2
    )}</p><ul><li>${faker.lorem.lines(1)}</li><li>${faker.lorem.lines(
      1
    )}</li><li>${faker.lorem.lines(1)}</li></ul><p>${faker.lorem.paragraphs(
      Math.random() * 2
    )}</p>`,
    bulletinImages: [
      "https://static.baza.farpost.ru/v/1510541224458_hugeBlock",
    ],
  });
}
fs.writeFile("data/dataList.json", JSON.stringify(adds), () => {
  console.log(`${adds.length} adds was created`);
});
