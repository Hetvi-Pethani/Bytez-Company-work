const mongoose = require('mongoose');
const Category = require('../models/CategoryModel');
const exsubcategory = require('../models/ExsubcategoryModel');
const Subcategory = require('../models/SubcategoryModel');

const getSubcategories = async (req, res) => {
    try {
        const registerId = req.user.id;

        const subcategories = await Subcategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            { 
                $unwind: '$categoryData' 
            },
            {
                $match: {
                    'categoryData.registerId': new mongoose.Types.ObjectId(registerId)
                }
            },
            {
                $project: {
                    id: '$_id',
                    subcategory: 1,
                    status: 1,
                    categoryId: '$categoryData._id',
                    category: '$categoryData.category'
                }
            }

        ]);

        res.json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Error fetching subcategories' });
    }
};


const insertSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategory } = req.body.subcatdata;
        const registerId = req.user.id;
        const subcategoryData = new Subcategory({
            registerId,
            categoryId: categoryId,
            subcategory: subcategory
        });
        await subcategoryData.save();
        return res.status(201).json(subcategoryData);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Error adding subcategory' });
    }
};


const categories = async (req, res) => {
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

const deleteSubcategory = async (req, res) => {
    try {
        let id = req.body.id;
        const subcategoryData = await Subcategory.findByIdAndDelete(id);
        await Subcategory.findByIdAndDelete(id);
        await exsubcategory.deleteMany({ subcategoryId: id })

        return res.status(200).json({ message: 'category deleted successfully' })
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const editSubcategory = async (req, res) => {
    try {
        const { id } = req.body;
        const subcategory = await Subcategory.findById(id).populate('categoryId');
        const categories = await Category.find({ status: 'active' });
        return res.status(200).json({ subcategory, categories });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching subcategory' });
    }
};

const updateSubcategory = async (req, res) => {
    try {

        const { editid, category, subcategory, status } = req.body;

        const registerId = req.user.id;

        const updatedSubcategory = await Subcategory.findOneAndUpdate(
            { _id: editid, registerId: registerId },
            {
                $set: {
                    categoryId: category,
                    subcategory: subcategory,
                    status: status
                }
            })
        if (!updatedSubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        return res.status(200).json({ message: 'subcategory updated successfully' })
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Error updating subcategory' });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (status === 'inactive') {
            await Subcategory.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Subcategory.findByIdAndUpdate(id, {
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
    categories,
    getSubcategories,
    insertSubcategory,
    deleteSubcategory,
    editSubcategory,
    updateSubcategory,
    changeStatus
};