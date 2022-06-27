import cheerio from "cheerio";

const nameMap = {
    "租金含" : "rentalPriceInfo",
    "車位費": "parkingFee",
    "管理費": "managementFee"
}

const nameMap2 = {
    "格局" : "pattern",
    "坪數": "pin",
    "樓層": "floor",
    "型態": "type"
}

const getRentalHouseInfo = async (browser, postId) => {
    const page = await browser.newPage();
    await page.goto(`https://rent.591.com.tw/home/${postId}`, { waitUntil: 'networkidle0', timeout: 100000 });
    const htmlContent = await page.content();
    
    const info = {};
    const $ = cheerio.load(htmlContent);
    info.link = `https://rent.591.com.tw/home/${postId}`;
    info.title = $(".house-title h1").text();
    info.addr = $("span.load-map").text().trim();
    info.rentalPrice = $("span.price").text();
    try {
     info.pet = $(".service-rule").text().includes("不可養寵物") ?　"No" : "Yes";
     info.cook = $(".service-rule").text().includes("不可開伙") ?　"No" : "Yes";
    }
    catch(err) {
     info.pet =  info.cook = "-";
    }

    $(".main-info-left .content")
        .children()
        .each((i, elem)=>{
            try {
                const name = $(elem).find(".name").text()
                if(nameMap[name])
                    info[nameMap[name]] = $(elem).find(".text").text()
            }
            catch(err){
                console.error(err)
            }
        });
    
    const equipments = [];
    $(".service-list-box")
        .children()
        .each((i, elem)=>{
            if(!$(elem).hasClass("del"))
                equipments.push($(elem).find(".text").text());
        });
    info.equipments = equipments.join(",");

    const children = $(".house-pattern").children();
    Object.keys(nameMap2).map((key,i) => {
        info[nameMap2[key]] = $(children[i * 2]).text();
    })

    return info;
};
  
export default getRentalHouseInfo