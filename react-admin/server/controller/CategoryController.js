const Category = require('../models/CategoryModel');
const exsubcategory = require('../models/ExsubcategoryModel');
const Subcategory = require('../models/SubcategoryModel')
const mongoose = require('mongoose');


const viewCategory = async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    }
    catch (err) {
        res.status(500).json({ message: ' Error fetching categories' });
    }
}

const getcategories = async (req, res) => {
    try {
        const registerId = req.user.id;
        const categories = await Category.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId)
                }
            }
        ]);
        return res.status(200).json(categories);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid  request' });
    }
}

const insertCategory = async (req, res) => {

    try {
        const { category } = req.body;
        const registerId = req.user.id;
        const categoryData = new Category({
            registerId,
            category: category,
        });
        await categoryData.save();
        return res.status(200).json({ message: 'category added successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        await Category.findByIdAndDelete(id);
        await Subcategory.deleteMany({ categoryId: id })
        await exsubcategory.deleteMany({ categoryId: id })
        return res.status(200).json({ message: 'category deleted successfully' })
    }

    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const editCategory = async (req, res) => {
    try {
        let { id } = req.body;
        let singleCategory = await Category.findById(id);
        return res.json(singleCategory)
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { editid, category, status } = req.body;

        const registerId = req.user.id;

        const upcategory = await Category.findOneAndUpdate(
            { _id: editid, registerId: registerId },
            {
                $set: {
                    category: category,
                    status: status
                }
            }
        );
        if (!upcategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'category updated successfully' });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'invalid request' });

    }
};


const changeStatus = async (req, res) => {

    try {
        const { id, status } = req.body;
        if (status == 'inactive') {
            await Category.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Category.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }

        return res.status(200).json({ message: "status changed successfully" })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invalid request' });
    }
}



module.exports = {
    viewCategory, getcategories, insertCategory, deleteCategory, editCategory, updateCategory, changeStatus
}


