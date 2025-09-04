const mongoose = require('mongoose');
const Category = require('../models/CategoryModel');
const Subcategory = require('../models/SubcategoryModel')
const Exsubcategory = require('../models/ExsubcategoryModel')
const Product = require('../models/ProductModel');



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


const getproducts = async (req, res) => {
    try {
        const registerId = req.user.id;

        const product = await Product.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId)
                }
            },
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
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategoryId',
                    foreignField: '_id',
                    as: 'subcategoryData'
                }
            },
            { $unwind: '$subcategoryData' },
            {
                $lookup: {
                    from: 'exsubcategories',
                    localField: 'exsubcategoryId',
                    foreignField: '_id',
                    as: 'exsubcategoryData'
                }
            },
            { $unwind: '$exsubcategoryData' },
            {
                $project: {
                    id: '$_id',
                    product: 1,
                    price: 1,
                    description: 1,
                    image: 1,
                    status: 1,
                    category: '$categoryData.category',
                    subcategory: '$subcategoryData.subcategory',
                    exsubcategory: '$exsubcategoryData.exsubcategory',
                }
            }
        ]);

        return res.status(200).json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching products' });
    }
};

const ajaxcategorywiseRecord = async (req, res) => {
    try {
        let subcategoryid = req.query.subcategoryId;
        let exsubcategorydeta = await Exsubcategory.find({ subcategoryId: subcategoryid, status: 'active' }).populate('categoryId').populate('subcategoryId')
        return res.status(200).send({
            status: true,
            message: "Record Found",
            exsubcategory: exsubcategorydeta
        })
    } catch (err) {
        console.log(err)
        return false
    }
}

const insertProduct = async (req, res) => {
    try {
        const { category, subcategory, exsubcategory, product, price, description, status } = req.body;
        const registerId = req.user.id;

        const productData = new Product({
            registerId,
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategoryId: exsubcategory,
            product: product,
            price: price,
            description: description,
            status: status,
            image: req.file?.filename
        })
        await productData.save()
        return res.status(200).json({ message: 'Product inserted successfully' });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error in inserting Exsubcategory' });
    }
}


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        await Product.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log(err)
        return false
    }
}


const editeProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const singleProduct = await Product.findById(id).populate('categoryId').populate('subcategoryId').populate('exsubcategoryId');
        const category = await Category.find({ status: 'active' });
        const subcategory = await Subcategory.find({ status: 'active' });
        const exsubcategory = await Exsubcategory.find({ status: 'active' });

        return res.status(200).json({
            singleProduct, category, subcategory, exsubcategory,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { editid, category, subcategory, exsubcategory, product, price, description, status } = req.body;

        const existingProduct = await Product.findById(editid);

        const updatedImage = req.file ? req.file?.filename : existingProduct.image;

        await Product.findByIdAndUpdate(editid, {
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategoryId: exsubcategory,
            product: product,
            price: price,
            description: description,
            status: status,
            image: updatedImage

        });
        return res.status(200).json({ message: 'Product updated successfully' });


    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (status === 'inactive') {
            await Product.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Product.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }
        return res.status(200).json({ message: "Status updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'invalid request' });
    }
}

module.exports = {
    getSubcategories, categories, getexsubcategories, getproducts, ajaxcategorywiseRecord, insertProduct, changeStatus, deleteProduct, editeProduct, updateProduct
}