const genHouseInfoStr = (info) => `\n標題：${info.title}\n地址：${info.addr}\n租金：${info.rentalPrice}\n可養寵物：${info.pet}\n可開伙：${info.cook}\n管理費：${info.managementFee}\n提供設備：${info.equipments}\n格局：${info.pattern}\n坪數：${info.pin}\n樓層：${info.floor}\n建物型態：${info.type}\n連結：${info.link}`;
  
export default genHouseInfoStr