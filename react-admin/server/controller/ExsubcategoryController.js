const mongoose = require('mongoose');
const Category = require('../models/CategoryModel');
const Subcategory = require('../models/SubcategoryModel')
const Exsubcategory = require('../models/ExsubcategoryModel');


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
            { $unwind: '$categoryData' },
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

const getexsubcategories = async (req, res) => {
    try {
        const registerId = req.user.id;

        const exsubcategories = await Exsubcategory.aggregate([

            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategoryId',
                    foreignField: '_id',
                    as: 'subcategoryData'
                }
            },
            {
                $unwind: '$subcategoryData'
            },

            {
                $lookup: {
                    from: 'categories',
                    localField: 'subcategoryData.categoryId',
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
                    categoryId: '$categoryData._id',
                    category: '$categoryData.category',
                    subcategoryId: '$subcategoryData._id',
                    subcategory: '$subcategoryData.subcategory',
                    status: 1,
                    exsubcategory: 1
                }
            }
        ]);

        return res.status(200).json(exsubcategories);
    } catch (error) {
        console.error('Error fetching exsubcategories:', error);
        return res.status(500).json({ message: 'Error fetching exsubcategories' });
    }
};


const ajaxcategorywiseRecord = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        const subcategories = await Subcategory.find({ categoryId: categoryId, status: 'active' }).populate('categoryId')

        res.status(200).send({
            status: true,
            message: 'Record Found',
            subcategory: subcategories
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ status: false, message: 'Server Error' });
    }
};

const insertExsubcategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId, exsubcategory } = req.body;
        
        const registerId = req.user.id;
        const exsubcategorydata = new Exsubcategory({
            registerId,
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            exsubcategory: exsubcategory,

        })
        await exsubcategorydata.save()
        return res.status(200).json({ message: 'Exsubcategory inserted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error adding subcategory' });
    }
}

const deleteExsubcategory = async (req, res) => {
    try {
        const id = req.body.id;
        await Exsubcategory.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Exsubcategory deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error deleting exsubcategory' });

    }
}


const editExsubcategory = async (req, res) => {
    try {
        let { id } = req.body;
        let singleexsubcategory = await Exsubcategory.findById(id).populate('categoryId').populate('subcategoryId')
        let category = await Category.find({ status: 'active' })
        let subcategory = await Subcategory.find({ status: 'active' })
        return res.status(200).json({ category, subcategory, singleexsubcategory })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching subcategory' });
    }
}


const updateExsubcategory = async (req, res) => {
    try {
        const { editid, category, subcategory, exsubcategory, status } = req.body;

        const upexsubcat = await Exsubcategory.findByIdAndUpdate(editid, {
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategory: exsubcategory,
            status: status
        });
        return res.status(200).json(upexsubcat)


    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Update failed", error: err });
    }
};



const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (status === 'inactive') {
            await Exsubcategory.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Exsubcategory.findByIdAndUpdate(id, {
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
    getSubcategories, getexsubcategories, categories, ajaxcategorywiseRecord, insertExsubcategory, deleteExsubcategory, editExsubcategory, updateExsubcategory, changeStatus
}