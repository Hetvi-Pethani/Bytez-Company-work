const mongoose = require('mongoose');
const Category = require('../models/CategoryModel');
const Stock = require('../models/StockModel');
const Size = require('../models/sizeModel');
const Color = require('../models/ColorModel');
const fs = require('fs');
const path = require('path');
const Product = require('../models/ProductModel');
const { format } = require('fast-csv');
const csv = require('fast-csv');
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
            { $unwind: '$categoryData' },
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
                    searchKeywords: 1,
                    stock: 1,
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
        const search = req.query.search || '';

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
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid  request' });
    }
}

const getsizes = async (req, res) => {
    try {
        const registerId = req.user.id;
        const sizes = await Size.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null
                }
            }
        ]);
        return res.status(200).json(sizes);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid  request' });
    }
}

const getcolors = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search?.trim() || '';

        const colors = await Color.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null,
                    ...(search && {
                        color: { $regex: search, $options: 'i' } // case-insensitive
                    })
                }
            },
            {
                $sort: { created_at: -1 } // optional: sort latest first
            }
        ]);
        return res.status(200).json(colors);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid  request' });
    }
}

const getproducts = async (req, res) => {
    try {
        const registerId = req.user.id;

        const product = await Product.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    delete_all: null
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
                $project: {
                    id: '$_id',
                    product: 1,
                    image: 1,
                    status: 1,
                    category: '$categoryData.category',
                    subcategory: '$subcategoryData.subcategory',
                }
            }
        ]);

        return res.status(200).json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching products' });
    }
};

const getstocks = async (req, res) => {
    try {
        const registerId = req.user.id;

        const stock = await Stock.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null
                }
            },

           
            {
                $lookup: {
                    from: 'products',
                    let: { productId: '$productId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$productId'] },
                                deleted_at: null
                            }
                        }
                    ],
                    as: 'productData'
                }
            },
            { $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } },

            // Subcategory lookup
            {
                $lookup: {
                    from: 'subcategories',
                    let: { subcategoryId: '$subcategoryId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$subcategoryId'] },
                                deleted_at: null
                            }
                        }
                    ],
                    as: 'subcategoryData'
                }
            },
            { $unwind: { path: '$subcategoryData', preserveNullAndEmptyArrays: true } },

            // Category lookup
            {
                $lookup: {
                    from: 'categories',
                    let: { categoryId: '$categoryId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$categoryId'] },
                                deleted_at: null
                            }
                        }
                    ],
                    as: 'categoryData'
                }
            },
            { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },

            // Size lookup
            {
                $lookup: {
                    from: 'sizes',
                    let: { sizeId: '$sizeId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$sizeId'] },
                                deleted_at: null
                            }
                        }
                    ],
                    as: 'sizeData'
                }
            },
            { $unwind: { path: '$sizeData', preserveNullAndEmptyArrays: true } },

            // Color lookup
            {
                $lookup: {
                    from: 'colors',
                    let: { colorId: '$colorId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$colorId'] },
                                deleted_at: null
                            }
                        }
                    ],
                    as: 'colorData'
                }
            },
            { $unwind: { path: '$colorData', preserveNullAndEmptyArrays: true } },

            // Final project
            {
                $project: {
                    _id: 1,
                    categoryId: 1,
                    subcategoryId: 1,
                    productId: 1,
                    sizeId: 1,
                    colorId: 1,
                    qty: 1,
                    rate: 1,
                    amount: 1,
                    status: 1,
                    image: 1,
                    stock: 1,
                    searchKeywords: 1,
                    productName: "$productData.product",
                    subcategoryName: "$subcategoryData.subcategory",
                    categoryName: "$categoryData.category",
                    sizeName: "$sizeData.size",
                    colorName: "$colorData.color"
                }
            }
        ]);

        return res.status(200).json(stock);

    } catch (err) {
        console.error('Error in getstocks:', err);
        return res.status(500).json({ message: 'Error fetching stocks' });
    }
};

const ajaxcategorywiseRecord = async (req, res) => {
    try {
        const productId = req.query.productId;

        if (!productId) {
            return res.status(400).json({
                status: false,
                message: "ProductId is required"
            });
        }

        const subcategoryData = await Subcategory.find({
            productId: productId,
            status: 'active'
        })
            .populate('productId')
            .populate('sizeId')
            .populate('colorId');

        return res.status(200).json({
            status: true,
            message: "Record Found",
            data: subcategoryData
        });

    } catch (err) {
        console.error("Error in ajaxcategorywiseRecord:", err);
        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
};


const insertStock = async (req, res) => {
    try {

        const {
            category,
            subcategory,
            product,
            size,
            stock,
            color,
            qty,
            rate,
            amount,
            status
        } = req.body;

        const registerId = req.user.id;

        const keywordString = `${product} ${category} ${color} ${size}`
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .join(' ');

        const stockData = new Stock({
            registerId: registerId,
            categoryId: category,
            subcategoryId: subcategory,
            productId: product,
            sizeId: size,
            stock: stock,
            colorId: color,
            qty: qty,
            rate: rate,
            amount: amount,
            status: status,
            image: req.file?.filename,
            searchKeywords: keywordString,
        });
        await stockData.save();

        return res.status(200).json({ message: 'Stock added successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error in inserting stock' });
    }
};


const deleteStock = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Stock.findByIdAndUpdate(
            id,
            {
                $set: {
                    deleted: true,
                    deleted_at: new Date()
                }
            },


        )
        if (!result) {
            return res.status(404).json({ message: 'stock not found' });
        }

        return res.status(200).json({ message: 'stock deleted successfully' });
    } catch (err) {
        console.log(err)
        return false
    }
}

const editeStock = async (req, res) => {
    try {
        const { id } = req.body;
        const singleStock = await Stock.findById(id).populate('categoryId').populate('subcategoryId').populate('productId').populate('sizeId');
        const category = await Category.find({ status: 'active' });
        const subcategory = await subcategory.find({ status: 'active' });
        const product = await product.find({ status: 'active' });
        const size = await size.find({ status: 'active' });
        const color = await color.find({ status: 'active' });

        return res.status(200).json({
            singleStock, category, subcategory, product, size, color,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

const updateStock = async (req, res) => {
    try {
        const {
            editid,
            category,
            subcategory,
            product,
            size,
            color,
            stock,
            status,
            rate,
            amount,
            qty
        } = req.body;

        const registerId = req.user.id;

        const existingStock = await Stock.findOne({ _id: editid, registerId });

        if (!existingStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        let updatedImage = existingStock.image;

        if (req.file) {
            const oldImagePath = path.join(__dirname, '../uploads/', existingStock.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            updatedImage = req.file.filename;
        }

        await Stock.updateOne(
            { _id: editid, registerId: registerId },
            {
                $set: {
                    categoryId: category,
                    subcategoryId: subcategory,
                    productId: product,
                    sizeId: size,
                    colorId: color,
                    stock,
                    qty,
                    rate,
                    amount,
                    status,
                    image: updatedImage
                }
            }
        );

        return res.status(200).json({ message: 'Stock updated successfully' });

    } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (status === 'inactive') {
            await Stock.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Stock.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }
        return res.status(200).json({ message: "Status updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'invalid request' });
    }
}


const importStocks = async (req, res) => {
    try {
        const registerId = req.user.id;

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
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', async () => {
                try {
                    let insertedCount = 0;
                    let updatedCount = 0;

                    for (const row of rows) {
                        const stockValue = row.stock?.trim();
                        const categoryName = row.category?.trim();
                        const subcategoryName = row.subcategory?.trim();
                        const productName = row.product?.trim();
                        const sizeName = row.size?.trim();
                        const colorName = row.color?.trim();
                        const status = row.status?.trim() || 'inactive';
                        const image = row.image?.trim() || '';

                        const [
                            categoryDoc,
                            subcategoryDoc,
                            productDoc,
                            sizeDoc,
                            colorDoc
                        ] = await Promise.all([
                            Category.findOne({ category: categoryName, registerId, deleted_at: null }),
                            Subcategory.findOne({ subcategory: subcategoryName, registerId, deleted_at: null }),
                            Product.findOne({ product: productName, registerId, deleted_at: null }),
                            Size.findOne({ size: sizeName, registerId, deleted_at: null }),
                            Color.findOne({ color: colorName, registerId, deleted_at: null }),
                        ]);

                        if (!categoryDoc || !subcategoryDoc || !productDoc || !sizeDoc || !colorDoc) {
                            console.warn('Missing reference:', row);
                            continue;
                        }

                        const existingStock = await Stock.findOne({
                            registerId,
                            categoryId: categoryDoc._id,
                            subcategoryId: subcategoryDoc._id,
                            productId: productDoc._id,
                            sizeId: sizeDoc._id,
                            colorId: colorDoc._id,
                            deleted_at: null
                        });

                        const stockData = {
                            stock: isNaN(stockValue) ? stockValue : Number(stockValue),
                            image,
                            qty: Number(row.quantity) || 0,
                            rate: Number(row.rate) || 0,
                            amount: Number(row.amount) || 0,
                            status,
                            updated_at: new Date()
                        };

                        if (existingStock) {
                            await Stock.updateOne({ _id: existingStock._id }, { $set: stockData });
                            updatedCount++;
                        } else {
                            await Stock.create({
                                ...stockData,
                                registerId,
                                categoryId: categoryDoc._id,
                                subcategoryId: subcategoryDoc._id,
                                productId: productDoc._id,
                                sizeId: sizeDoc._id,
                                colorId: colorDoc._id,
                                created_at: new Date()
                            });
                            insertedCount++;
                        }
                    }

                    fs.unlinkSync(filePath);
                    res.status(200).json({
                        message: 'Stocks processed successfully',
                        inserted: insertedCount,
                        updated: updatedCount
                    });

                } catch (err) {
                    console.error('Stock import error:', err);
                    res.status(500).json({ message: 'Error processing rows', error: err.message });
                }
            });

    } catch (err) {
        console.error('Import failed:', err);
        res.status(500).json({ message: 'Failed to import stocks.', error: err.message });
    }
};

const exportStocks = async (req, res) => {
    try {
        const registerId = req.user.id;

        const stocks = await Stock.find({
            registerId,
            deleted_at: null
        })
            .populate('categoryId', 'category')
            .populate('subcategoryId', 'subcategory')
            .populate('productId', 'product')
            .populate('sizeId', 'size')
            .populate('colorId', 'color')

        res.setHeader('Content-Disposition', 'attachment; filename=stocks.csv');
        res.setHeader('Content-Type', 'text/csv');

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        stocks.forEach(stock => {
            csvStream.write({
                id: stock._id,
                category: stock.categoryId?.category,
                subcategory: stock.subcategoryId?.subcategory,
                product: stock.productId?.product,
                size: stock.sizeId?.size,
                color: stock.colorId?.color,
                stock: stock.stock,
                image: stock.image,
                quantity: stock.qty,
                rate: stock.rate,
                amount: stock.amount,
                status: stock.status
            });
        });

        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export stock data' });
    }
};


module.exports = {
    getSubcategories, categories, getproducts, ajaxcategorywiseRecord, insertStock, changeStatus, deleteStock, editeStock, updateStock, getstocks, getsizes, getcolors, exportStocks, importStocks
}