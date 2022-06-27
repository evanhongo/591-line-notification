import puppeteer from "puppeteer";

import getRentalHousePostIds from "./utils/getRentalHousePostIds.js";
import getRentalHouseInfo from "./utils/getRentalHouseInfo.js";
import genHouseInfoStr from "./utils/genHouseInfoStr.js";
import lineNotify from "./utils/lineNotify.js";

const main = async () => {
  try {
    const browser = await puppeteer.launch();
    const postIds = await getRentalHousePostIds(browser);
    const houseInfoArr = await Promise.all(
      postIds.map(async (postId) => getRentalHouseInfo(browser, postId))
    );
    
    await browser.close();
    
    await Promise.all(
      houseInfoArr.map(async (info) => lineNotify(genHouseInfoStr(info)))
    );
  }
  catch(err){
    console.error(err)
  }
};

main();
