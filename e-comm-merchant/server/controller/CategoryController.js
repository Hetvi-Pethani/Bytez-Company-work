const Category = require('../models/CategoryModel');
const fs = require('fs');
const path = require('path');
const { format } = require('fast-csv');
const Subcategory = require('../models/SubcategoryModel')
const mongoose = require('mongoose');
const csv = require('fast-csv');
const Stock = require('../models/StockModel');
const Product = require('../models/ProductModel');


const viewCategory = async (req, res) => {
    try {
        const category = await Category.find( );
        res.json(category);
    }
    catch (err) {
        res.status(500).json({ message: ' Error fetching categories' });
    }
}

// const getcategories = async (req, res) => {
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

const getcategories = async (req, res) => {
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
    } catch (err) {
        console.error('Error in getcategories:', err);
        return res.status(400).json({ message: 'Invalid request' });
    }
};

const insertCategory = async (req, res) => {

    try {
        const { category } = req.body;
        const registerId = req.user.id;

        const existingCategory = await Category.findOne({
            registerId: req.user.id,
            category: category.trim().toLowerCase(),
        });

        if (existingCategory) {
            return res.status(400).json({
                message: 'Category already exists (even if soft-deleted)',
            });
        }

        const keywordString = category
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(k => k)
            .join('');

        const categoryData = new Category({
            registerId,
            category: category,
            image: req.file?.filename,
            searchKeywords: keywordString,
        })

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

        const softDeleteData = {
            $set: {
                deleted_at: new Date(),
                deleted: true
            }
        };

        const categoryResult = await Category.findByIdAndUpdate(id, softDeleteData);

        if (!categoryResult) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await Subcategory.deleteMany({ categoryId: id }, softDeleteData);

        await Product.deleteMany({ categoryId: id }, softDeleteData);

        await Stock.deleteMany({ categoryId: id }, softDeleteData);

        return res.status(200).json({ success: true, message: 'Category and related data soft-deleted successfully' });

    } catch (err) {
        console.error('Soft delete error:', err);
        return res.status(500).json({ success: false, message: 'Server error while deleting category' });
    }
};


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

        const existingCategory = await Category.findOne({ _id: editid, registerId });


        if (req.file && existingCategory.image) {
            const oldImagePath = path.join(__dirname, '../uploads/', existingCategory.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedImage = req.file ? req.file.filename : existingCategory.image;

        const upcategory = await Category.findOneAndUpdate(
            { _id: editid, registerId: registerId },
            {
                $set: {
                    category: category,
                    status: status,
                    image: updatedImage
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

const importCategories = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'CSV file is required.' });
        }

        const filePath = path.resolve(req.file.path);
        const categories = [];

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => {
                console.error('CSV parsing error:', error);
                res.status(500).json({ message: 'CSV parsing error', error: error.message });
            })
            .on('data', (row) => {
                if (row.category && row.status) {
                    categories.push({
                        category: row.category.trim(),
                        status: row.status.trim(),
                        image: row.image?.trim() || '',
                        registerId: req.user.id,
                    });
                }
            })
            .on('end', async () => {
                try {
                    if (categories.length === 0) {
                        fs.unlinkSync(filePath);
                        return res.status(400).json({ message: 'CSV file is empty or invalid.' });
                    }

                    for (const cat of categories) {
                        const existing = await Category.findOne({
                            category: { $regex: new RegExp(`^${cat.category}$`, 'i') },
                            registerId: cat.registerId,
                            deleted_at: null
                        });

                        if (existing) {

                            await Category.updateOne(
                                { _id: existing._id },
                                {
                                    $set: {
                                        status: cat.status,
                                        image: cat.image,
                                    }
                                }
                            );
                        } else {
                            await Category.create(cat);
                        }
                    }

                    fs.unlinkSync(filePath);
                    res.status(200).json({ message: 'Categories imported/updated successfully!' });
                } catch (err) {
                    console.error('Insert/update error:', err);
                    res.status(500).json({ message: 'Import failed', error: err.message });
                }
            });
    } catch (err) {
        console.error('Unexpected error during import:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err.message });
    }
};


const exportCategories = async (req, res) => {
    try {
        const registerId = req.user.id;

        const categories = await Category.find({
            registerId,
            deleted_at: null
        });

        res.setHeader('Content-Disposition', 'attachment; filename=categories.csv');
        res.setHeader('Content-Type', 'text/csv');

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        categories.forEach(cat => {
            csvStream.write({
                id: cat._id.toString(),
                category: cat.category,
                image: cat.image,
                status: cat.status
            });
        });
        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export categories' });
    }
}


module.exports = {
    viewCategory, getcategories, insertCategory, deleteCategory, editCategory, updateCategory, changeStatus, importCategories, exportCategories
}


