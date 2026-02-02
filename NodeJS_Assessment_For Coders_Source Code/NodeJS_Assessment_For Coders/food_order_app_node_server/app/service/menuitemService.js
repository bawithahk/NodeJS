const fs = require("fs");
const Menus = require("../service/menuService");
const Fooditems = require("../service/fooditemService");
const menus = new Menus();
const fooditems = new Fooditems();

class Menuitems {
  constructor() {
    this.menuitems = JSON.parse(fs.readFileSync("./app/data/menuitems.json", "utf-8"));
  }

  getAllMenuitems() {
    return this.menuitems;
  }

  getMenuitemById(id) {
    const menuitem = this.menuitems.find((menuitem) => menuitem.id == id);
    return menuitem;
  }

  getAllMenuitemsByFooditemId(fooditemId) {
    const menuitems = this.menuitems.filter((menuitem) => menuitem.fooditemId == fooditemId);
    return menuitems;
  }

  getAllMenuitemsByRestaurantId(restaurantId, selectedCategoryId = null, selectedCuisineId = null) {
    //Get menuId by restaurantId
    const selectedMenuId = menus.getMenuByRestaurantId(restaurantId).id;
    //Get all menuitems of the selected menuId
    let filteredMenuitems = this.menuitems.filter((menuitem) => menuitem.menuId == selectedMenuId);
    //Stores all resultant menuitems such that each menuitem has its-
    // id, fooditemId, fooditem title, fooditem image and fooditem price
    let resultantMenuitems = []
    //loop through each of the menuitems to extract only the required fields
    filteredMenuitems.forEach(menuitem => {
      resultantMenuitems.push(
        {
          "Menuitem Id": menuitem.id,
          "Fooditem Id": menuitem.fooditemId,
          "Fooditem Name": fooditems.getFooditemById(menuitem.fooditemId).name,
          "Fooditem Image": fooditems.getFooditemById(menuitem.fooditemId).image,
          "Fooditem Price": menuitem.fooditemPrice
        })
    })
    //If categoryId or cuisineId is provided then the resultant menuitems should be reordered such that
    // the menu items of the given categoryId or cuisineId should be displaye first
    // and then the remaining menuitems should be displayed
    //Check if selectedcategoryId is not null or selectedcuisineId is not null
    if (selectedCategoryId != null || selectedCuisineId != null) {
      //Variable to store the filtered menuitems belonging to the selected categoryId or cuisineId
      let filteredFooditems;
      if (selectedCategoryId) {
        // Filter food items with the given categoryId
        filteredFooditems = fooditems.getFooditemsByCategoryId(selectedCategoryId);
      }
      else {
        // Filter food items with the given cuisineId
        filteredFooditems = fooditems.getFooditemsByCuisineId(selectedCuisineId);
      }
      //Extract the fooditem Ids of all the filtered fooditems
      const filteredFooditemIds = filteredFooditems.map(fooditem => fooditem.id);
      //Array variables to store the preferred menu items and the remaining menu items
      let preferredMenuItemsOrder = [], remainingMenuItems = [];
      //Filter out the preffered menuitems
      preferredMenuItemsOrder = resultantMenuitems.filter(item => filteredFooditemIds.includes(item["Fooditem Id"]));
      //Filter out the remaining menuitems
      remainingMenuItems = resultantMenuitems.filter(item => !filteredFooditemIds.includes(item["Fooditem Id"]));
      //Push the remaining fooditems in the end of the preferredMenuItemsOrder
      remainingMenuItems.forEach(item => {
        preferredMenuItemsOrder.push(item)
      })
      //Return the preferredMenuItemsOrder variable
      return preferredMenuItemsOrder;
    }
    else {
      //If no categoryId or cuisineId is passed then simply return the resultantMenuItems
      return resultantMenuitems;
    }
  }
  
}

module.exports = Menuitems;