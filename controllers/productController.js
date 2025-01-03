const mongoose = require("mongoose");
const Product = require("../models/productModel");

const createProduct = async (req, res) => {
  try {
    const { productName, price, productDescription, specification } = req.body;

    if (!productName || !price || !productDescription) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the mandatory fields.",
      });
    }

    const newProd = await Product.create({
      productName,
      price,
      productDescription,
      specification,
    });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProd,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    if (!allProducts) {
      return res.status(400).json({
        success: false,
        message: "No products found",
      });
    }
    // Respond with success
    return res.status(201).json({
      success: true,
      message: "All Products fetched successfully.",
      product: allProducts,
    });
  } catch (error) {
    console.error("Error while fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = { createProduct, getAllProduct };
