const fs = require("fs");
const Cuisines = require("../service/cuisineService");
const Categories = require("./categoryService");
const Fooditems = require("../service/fooditemService");
const Menuitems = require("../service/menuitemService");
const Menus = require("../service/menuService");

const cuisines = new Cuisines();
const categories = new Categories();
const fooditems = new Fooditems();
const menuitems = new Menuitems();
const menus = new Menus();

class Restaurants {
  constructor() {
    this.restaurants = JSON.parse(fs.readFileSync("./app/data/restaurants.json", "utf-8"));
  }

  getAllRestaurants() {
    return this.restaurants;
  }

  getRestaurantById(id) {
    const restaurant = this.restaurants.find((restaurant) => restaurant.id == id);
    return restaurant;
  }

  getAllRestaurantsByCategory(category) {
    try {
      // Step 1: Find category id of the matching category
      const categoryId = categories.getCategoryByName(category).id;

      // Step 2: Find food items matching the selected category
      const selectedCategoryFooditems = fooditems.getFooditemsByCategoryId(categoryId);

      // Step 3 : Find ids of the food items matching the selected category
      const selectedCategoryFooditemsIds = selectedCategoryFooditems.map(fooditem => fooditem.id);

      // Step 4: Find menu items with food items matching the selected category
      const selectedCategoryMenuitems = []
      selectedCategoryFooditemsIds.map(fooditemId => {
        menuitems.getAllMenuitemsByFooditemId(fooditemId).forEach(menuitem => {
          selectedCategoryMenuitems.push(menuitem);
        });
      })

      // Step 5: Find ids of menus having menu items matching the selected category
      const selectedCategoryMenuIds = selectedCategoryMenuitems.map(menuitem => menuitem.menuId);
      const selectedCategoryMenus = []
      selectedCategoryMenuIds.forEach(menuId => {
        selectedCategoryMenus.push(menus.getMenuById(menuId));
      });

      // Step 6: Find restaurants with menus matching the selected category
      const filteredRestaurants = this.restaurants.filter(restaurant =>
        selectedCategoryMenus.some(menu => menu.restaurantId === restaurant.id)
      );
      return filteredRestaurants;
    }
    catch {
      console.log("No Route")
    }
    return `No Restaurants serving ${category} category`;
  }
  
  getAllRestaurantsByCuisine(cuisine) {
  //COMPLETE TASK 2(b) HERE
  }
  
}


module.exports = Restaurants;