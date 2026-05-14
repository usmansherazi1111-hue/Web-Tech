const mongoose = require("mongoose");

const Product = require("../models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/krogerDB");

const products = [
  {
    name: "Milk",
    price: 3,
    category: "Dairy",
    rating: 5,
    stock: 50,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500",
  },

  {
    name: "Cheddar Cheese",
    price: 6,
    category: "Dairy",
    rating: 4,
    stock: 30,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500",
  },

  {
    name: "Butter",
    price: 4,
    category: "Dairy",
    rating: 5,
    stock: 25,
    image: "https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg",
  },

  {
    name: "Yogurt",
    price: 2,
    category: "Dairy",
    rating: 4,
    stock: 40,
    image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500",
  },

  {
    name: "Eggs",
    price: 5,
    category: "Breakfast",
    rating: 5,
    stock: 60,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500",
  },

  {
    name: "Bread",
    price: 2,
    category: "Bakery",
    rating: 4,
    stock: 35,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
  },

  {
    name: "Croissant",
    price: 3,
    category: "Bakery",
    rating: 4,
    stock: 20,
    image:
      "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg",
  },

  {
    name: "Rice",
    price: 15,
    category: "Grains",
    rating: 5,
    stock: 45,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500",
  },

  {
    name: "Flour",
    price: 10,
    category: "Grains",
    rating: 4,
    stock: 50,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500",
  },

  {
    name: "Pasta",
    price: 4,
    category: "Grains",
    rating: 4,
    stock: 30,
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500",
  },

  {
    name: "Chicken Breast",
    price: 12,
    category: "Meat",
    rating: 5,
    stock: 18,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500",
  },

  {
    name: "Beef Steak",
    price: 20,
    category: "Meat",
    rating: 5,
    stock: 12,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
  },

  {
    name: "Fish Fillet",
    price: 14,
    category: "Seafood",
    rating: 4,
    stock: 16,
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500",
  },

  {
    name: "Apples",
    price: 5,
    category: "Fruits",
    rating: 5,
    stock: 70,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500",
  },

  {
    name: "Bananas",
    price: 3,
    category: "Fruits",
    rating: 4,
    stock: 80,
    image:
      "https://plus.unsplash.com/premium_photo-1664304188646-47b168d698aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmFuYW5hfGVufDB8fDB8fHww",
  },

  {
    name: "Oranges",
    price: 4,
    category: "Fruits",
    rating: 4,
    stock: 55,
    image: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500",
  },

  {
    name: "Tomatoes",
    price: 3,
    category: "Vegetables",
    rating: 5,
    stock: 60,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
  },

  {
    name: "Potatoes",
    price: 6,
    category: "Vegetables",
    rating: 5,
    stock: 90,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500",
  },

  {
    name: "Onions",
    price: 4,
    category: "Vegetables",
    rating: 4,
    stock: 75,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=500",
  },

  {
    name: "Carrots",
    price: 3,
    category: "Vegetables",
    rating: 4,
    stock: 40,
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500",
  },

  {
    name: "Coca Cola",
    price: 2,
    category: "Beverages",
    rating: 5,
    stock: 100,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500",
  },
  {
    name: "Orange Juice",
    price: 4,
    category: "Beverages",
    rating: 4,
    stock: 35,
    image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg",
  },

  {
    name: "Green Tea",
    price: 6,
    category: "Beverages",
    rating: 5,
    stock: 25,
    image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500",
  },

  {
    name: "Potato Chips",
    price: 3,
    category: "Snacks",
    rating: 4,
    stock: 65,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500",
  },

  {
    name: "Chocolate Cookies",
    price: 5,
    category: "Snacks",
    rating: 5,
    stock: 45,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
  },

  {
    name: "Popcorn",
    price: 4,
    category: "Snacks",
    rating: 4,
    stock: 30,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500",
  },

  {
    name: "Ice Cream",
    price: 7,
    category: "Frozen",
    rating: 5,
    stock: 22,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
  },

  {
    name: "Frozen Pizza",
    price: 9,
    category: "Frozen",
    rating: 4,
    stock: 18,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
  },

  {
    name: "Ketchup",
    price: 3,
    category: "Condiments",
    rating: 4,
    stock: 28,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
  },

  {
    name: "Mayonnaise",
    price: 4,
    category: "Condiments",
    rating: 5,
    stock: 20,
    image: "https://images.unsplash.com/photo-1625943555419-56a2cb596640?w=500",
  },
];

async function seedData() {
  await Product.deleteMany();

  await Product.insertMany(products);

  console.log("Products Added");

  mongoose.connection.close();
}

seedData();
