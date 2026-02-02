const fs = require("fs");

class Cuisines {
  constructor() {
    this.cuisines = JSON.parse(fs.readFileSync("./app/data/cuisines.json", "utf-8"));
  }
  //COMPLETE TASK 1(b) HERE
  
}

module.exports = Cuisines;