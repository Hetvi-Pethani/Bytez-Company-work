const mongoose = require('mongoose');
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const { format } = require('@fast-csv/format');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const Subcategory = require('../models/SubcategoryModel');
const Stock = require('../models/StockModel');


// const getSubcategories = async (req, res) => {
//     try {
//         const registerId = req.user.id;

//         const subcategories = await subcategory.aggregate([
//             {
//                 $lookup: {
//                     from: 'categories',
//                     localField: 'categoryId',
//                     foreignField: '_id',
//                     as: 'categoryData'
//                 }
//             },
//             { $unwind: '$categoryData' },
//             {
//                 $match: {
//                     'categoryData.registerId': new mongoose.Types.ObjectId(registerId),
//                     'categoryData.status': 'active',
//                     deleted_at: null
//                 }
//             },
//             {
//                 $project: {
//                     id: '$_id',
//                     subcategory: 1,
//                     status: 1,
//                     categoryId: '$categoryData._id',
//                     category: '$categoryData.category',
//                     searchKeywords: 1,
//                 }
//             }

//         ]);

//         res.json(subcategories);
//     } catch (error) {
//         console.error('Error fetching subcategories:', error);
//         res.status(500).json({ message: 'Error fetching subcategories' });
//     }
// };

// const categories = async (req, res) => {
//     try {
//         const registerId = req.user.id;
//         const categories = await Category.aggregate([
//             {
//                 $match: {
//                     registerId: new mongoose.Types.ObjectId(registerId),
//                     deleted_at: null
//                 }
//             }
//         ]);
//         return res.status(200).json(categories);
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).json({ message: 'invelid  request' });
//     }
// }

const categories = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search || ''; // Get search query from request

        const categories = await Category.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null,
                    
                    ...(search && {
                        category: { $regex: search, $options: 'i' }
                    })
                }
            }
        ]);

        return res.status(200).json(categories);
    } catch (err) {
        console.error('Error in getcategories:', err);
        return res.status(400).json({ message: 'Invalid request' });
    }
};

const getSubcategories = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search || ''; // Get search string

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
                    'categoryData.registerId': new mongoose.Types.ObjectId(registerId),
                    deleted_at: null,
                    ...(search && {
                        $or: [
                            { subcategory: { $regex: search, $options: 'i' } },
                            { 'categoryData.category': { $regex: search, $options: 'i' } }
                        ]
                    })
                }
            },
            {
                $project: {
                    id: '$_id',
                    subcategory: 1,
                    status: 1,
                    categoryId: '$categoryData._id',
                    category: '$categoryData.category',
                    image: 1,
                    searchKeywords: 1
                }
            }
        ]);

        res.json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Error fetching subcategories' });
    }
};


const getproducts = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search?.trim() || '';

        const matchStage = {
            registerId: new mongoose.Types.ObjectId(registerId),
            deleted_at: null
        };

        if (search) {
            matchStage.$or = [
                { product: { $regex: search, $options: 'i' } },
                { 'categoryData.category': { $regex: search, $options: 'i' } },
                { 'subcategoryData.subcategory': { $regex: search, $options: 'i' } }
            ];
        }

        const product = await Product.aggregate([
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

            { $match: matchStage },

            {
                $project: {
                    id: '$_id',
                    product: 1,
                    image: 1,
                    status: 1,
                    categoryId: 1, 
                    subcategoryId: 1,
                    categoryName: '$categoryData.category',
                    subcategoryName: '$subcategoryData.subcategory'
                }
            }
        ]);

        return res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: 'Error fetching products' });
    }
};


const ajaxcategorywiseRecord = async (req, res) => {
    try {
        const subcategoryid = req.query.subcategoryId;
        const subcategoryData = await Subcategory.find({ subcategoryId: subcategoryid, status: 'active' }).populate('categoryId').populate('productId');
        return res.status(200).send({
            status: true,
            message: "Record Found",
            data: subcategoryData
        })
    } catch (err) {
        console.log(err)
        return false
    }
}

const insertProduct = async (req, res) => {
    try {
        const { category, subcategory, product, status } = req.body;
        const registerId = req.user.id;

        const existing = await Product.findOne({
            product: product.trim().toLowerCase(),
            categoryId: category,
            subcategoryId: subcategory,
            registerId: registerId,
            deleted_at: { $exists: false }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Product already exists for this category and subcategory"
            });
        }

        const keywordString = product
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
            .join(',');

        const productData = new Product({
            registerId,
            categoryId: category,
            subcategoryId: subcategory,
            product: product.trim(),
            status,
            image: req.file?.filename || '',
            searchKeywords: keywordString,
        });

        await productData.save();

        return res.status(200).json({ success: true, message: 'Product inserted successfully' });
    } catch (err) {
        console.error('Insert Product Error:', err);
        return res.status(500).json({ success: false, message: 'Error inserting product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

       
        await Product.findByIdAndUpdate(id, {
            $set: {
                deleted_at: new Date(),
                deleted: true,
                status: false
            }
        });

        await Stock.updateMany(
            { productId: id },
            { $set: { productId: null } }
        );

        res.status(200).json({
            status: true,
            message: 'Product deleted and stock updated successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            status: false,
            message: 'Something went wrong',
            error
        });
    }
};


const editeProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const singleProduct = await Product.findById(id).populate('categoryId').populate('subcategoryId');
        const categories = await Category.find({ status: 'active' });
        const subcategory = await Subcategory.find({ status: 'active' });


        return res.status(200).json({
            singleProduct, categories, subcategory
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { editid, category, subcategory, product, status } = req.body;
        const registerId = req.user.id;

        const existingProduct = await Product.findOne({ _id: editid, registerId });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const updatedImage = req.file ? req.file.filename : existingProduct.image;

        await Product.updateOne(
            { _id: editid, registerId },
            {
                $set: {
                    categoryId: category,
                    subcategoryId: subcategory,
                    product: product,
                    status: status,
                    image: updatedImage,
                },
            },
            { new: true }
        );

        return res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Update Error:', err);
        return res.status(500).json({ message: 'Server Error' });
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

const importProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'CSV file is required.' });
        }

        const filePath = path.resolve(req.file.path);
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => {
                console.error('CSV parsing error:', error);
                return res.status(500).json({ message: 'CSV parsing error', error: error.message });
            })
            .on('data', (row) => rows.push(row))
            .on('end', async () => {
                try {
                    let inserted = 0, updated = 0;

                    for (const row of rows) {
                        const categoryName = row.category?.trim();
                        const subcategoryName = row.subcategory?.trim();
                        const productName = row.product?.trim();
                        const status = row.status?.trim();
                        const image = row.image?.trim() || '';

                        if (!categoryName || !subcategoryName || !productName || !status) continue;

                        const categoryDoc = await Category.findOne({
                            category: categoryName,
                            registerId: req.user.id,
                            deleted_at: null
                        });

                        const subcategoryDoc = await Subcategory.findOne({
                            subcategory: subcategoryName,
                            registerId: req.user.id,
                            deleted_at: null
                        });

                        if (!categoryDoc || !subcategoryDoc) continue;

                        const existingProduct = await Product.findOne({
                            product: { $regex: new RegExp(`^${productName}$`, 'i') },
                            categoryId: categoryDoc._id,
                            subcategoryId: subcategoryDoc._id,
                            registerId: req.user.id,
                            deleted_at: null
                        });

                        const productData = {
                            categoryId: categoryDoc._id,
                            subcategoryId: subcategoryDoc._id,
                            product: productName,
                            image,
                            status,
                            registerId: req.user.id
                        };

                        if (existingProduct) {
                            await Product.updateOne({ _id: existingProduct._id }, { $set: productData });
                            updated++;
                        } else {
                            await Product.create(productData);
                            inserted++;
                        }
                    }

                    fs.unlinkSync(filePath);
                    res.status(200).json({ message: 'Products processed successfully', inserted, updated });

                } catch (err) {
                    console.error('Insert/update error:', err);
                    res.status(500).json({ message: 'Failed to import products', error: err.message });
                }
            });

    } catch (err) {
        console.error('Unexpected error during import:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err.message });
    }
};

const exportProducts = async (req, res) => {
    try {
        const registerId = req.user.id;

        const products = await Product.find({
            registerId,
            deleted_at: null
        })
            .populate('categoryId', 'category')
            .populate('subcategoryId', 'subcategory')

        if (!products.length) {
            return res.status(404).json({ message: 'No products found to export.' });
        }

        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.flushHeaders();

        const csvStream = format({ headers: true });
        csvStream.pipe(res).on('end', () => res.end());

        products.forEach((prod) => {
            csvStream.write({
                 id: prod._id.toString(),
                category: prod.categoryId?.category || '',
                subcategory: prod.subcategoryId?.subcategory || '',
                product: prod.product || '',
                image: prod.image || '',
                status: prod.status || ''
            });
        });

        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export products', error: err.message });
    }
};




module.exports = {
    getSubcategories, categories, getproducts, ajaxcategorywiseRecord, insertProduct, changeStatus, deleteProduct, editeProduct, updateProduct, exportProducts, importProducts
}