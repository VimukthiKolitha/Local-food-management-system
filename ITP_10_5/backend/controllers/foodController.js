import foodModel from "../models/foodModel.js";
import mongoose from 'mongoose';
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        image: `/images/${image_filename}`
    });
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding food" });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error listing foods" });
    }
};

// Find a food item by ID
const findAFood = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the ObjectID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        res.status(200).json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving food item", error: error.message });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            fs.unlink(`uploads/${food.image}`, () => {});
            await foodModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: "Food Removed" });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food" });
    }
};

// Edit food item
const editFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (food) {
            const { name, description, price, category, quantity } = req.body;
            const image = req.file ? req.file.filename : food.image;

            await foodModel.findByIdAndUpdate(req.params.id, {
                name,
                description,
                price,
                category,
                quantity,
                image
            });

            res.json({ success: true, message: "Food Updated" });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food" });
    }
};

export { addFood, listFood, removeFood, editFood, findAFood };
