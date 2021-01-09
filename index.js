import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const lineNotify = async (msg) => {
  await axios.post("https://notify-api.line.me/api/notify", null, {
    headers: {
      Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
    },
    params: { message: msg },
  });
  return;
};

const getRentalHousePostIds = async () => {
  const res = await axios.get(process.env.TARGET_URL, {
    params: {
      is_new_list: 1,
      type: 1,
      kind: 0,
      searchtype: 1,
      region: process.env.REGION,
      hasimg: 1,
      not_cover: 1,
      role: 1,
      rentprice: process.env.RENTAL_PRICE,
    },
  });
  const { data: htmlContent } = res;
  const postIds = [];
  const $ = cheerio.load(htmlContent);

  $("#content")
    .first()
    .children("ul")
    .each((i, elem) => {
      postIds[i] = $(elem)
        .children("li")
        .first()
        .children("img")
        .first()
        .attr("data-bind");
    });

  return postIds;
};

const rentInfoNotify = async () => {
  const rentalHousePostIds = await getRentalHousePostIds();
  await Promise.all(
    rentalHousePostIds.map(async (postId) => {
      await lineNotify(`\nhttps://rent.591.com.tw/rent-detail-${postId}.html`);
    })
  );
};

const startService = () => {
  let notificationInterval;
  try {
    notificationInterval = setInterval(
      rentInfoNotify,
      process.env.NOTIFICATION_INTERVAL
    );
  } catch (err) {
    console.error(err);
    clearInterval(notificationInterval);
  }
};

startService();
