const Cuisines = require("../service/cuisineService");

const cuisines = new Cuisines();

const fetchAllCuisinesHandler = (req, res) => {
  //COMPLETE TASK 1(a) HERE
};

const fetchCuisineByIdHandler = (req, res, cuisineId) => {
  //COMPLETE TASK 1(a) HERE
};

module.exports = {
  fetchAllCuisinesHandler,
  fetchCuisineByIdHandler,
};
