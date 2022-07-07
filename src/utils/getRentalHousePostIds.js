import cheerio from "cheerio";

const getRentalHousePostIds = async (browser) => {    
    const page = await browser.newPage();
    await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle0', timeout: 100000 });
    const htmlContent = await page.content();

    const postIds = [];
    const $ = cheerio.load(htmlContent);
    $("section.vue-list-rent-item")
    .each((i, elem) => {
        postIds[i] = $(elem).attr("data-bind")
    })
    
    return postIds;
};
  
export default getRentalHousePostIds