const mongoose = require('mongoose');
const Category = require('../models/CategoryModel');
const fs = require('fs');
const path = require('path');
const Subcategory = require('../models/SubcategoryModel');
const { format } = require('@fast-csv/format');
const csv = require('fast-csv');


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

const insertSubcategory = async (req, res) => {
    try {
        const { categoryId, subcategory, searchKeywords } = req.body;
        const registerId = req.user.id;

        const existing = await Subcategory.findOne({
            subcategory: subcategory.trim().toLowerCase(),
            categoryId,
            registerId,
            deleted_at: { $exists: false }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: "Subcategory already exists for this category" });
        }

        const newSubcategory = new Subcategory({
            categoryId,
            subcategory: subcategory.trim().toLowerCase(),
            image: req.file?.filename || '',
            searchKeywords,
            registerId
        });

        await newSubcategory.save();
        return res.status(200).json({ success: true, message: "Subcategory added", data: newSubcategory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


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


// const getSubcategories = async (req, res) => {
//     try {
//         const registerId = req.user.id;

//         const subcategories = await Subcategory.aggregate([
//             {
//                 $lookup: {
//                     from: 'categories',
//                     localField: 'categoryId',
//                     foreignField: '_id',
//                     as: 'categoryData'
//                 }
//             },
//             {
//                 $unwind: '$categoryData'
//             },
//             {
//                 $match: {
//                     'categoryData.registerId': new mongoose.Types.ObjectId(registerId),
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
//                     image: 1,
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
                        category: { $regex: search, $options: 'i' },

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
        const search = req.query.search || '';

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

const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.body;


        const subcategoryData = await Subcategory.findByIdAndUpdate(
            id,
            {
                $set: {
                    deleted: true,
                    deleted_at: new Date()
                }
            },
            { new: true }
        );

        if (!subcategoryData) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        return res.status(200).json({
            message: 'Subcategory soft-deleted successfully',
            data: subcategoryData
        });
    } catch (err) {
        console.error('Soft delete error:', err);
        return res.status(400).json({ message: 'Invalid request' });
    }
};

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


        const existingSubCategory = await Subcategory.findOne({ _id: editid, registerId });

        if (!existingSubCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        if (req.file && existingSubCategory.image) {
            const oldImagePath = path.join(__dirname, '../uploads/', existingSubCategory.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedImage = req.file ? req.file.filename : existingSubCategory.image;

        await Subcategory.findOneAndUpdate(
            { _id: editid, registerId },
            {
                $set: {
                    categoryId: category,
                    subcategory: subcategory,
                    status: status,
                    image: updatedImage
                }
            }
        );

        return res.status(200).json({ message: 'Subcategory updated successfully' });
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

const importsubcategories = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'CSV file is required.' });

        const filePath = path.resolve(req.file.path);
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => res.status(500).json({ message: 'CSV parsing error', error: error.message }))
            .on('data', (row) => rows.push(row))
            .on('end', async () => {
                let inserted = 0, updated = 0;

                for (const row of rows) {
                    if (!row.category || !row.subcategory || !row.status) continue;

                    const category = await Category.findOne({
                        category: row.category.trim(),
                        registerId: req.user.id,
                        deleted_at: null
                    });
                    if (!category) continue;

                    const existing = await Subcategory.findOne({
                        categoryId: category._id,
                        subcategory: { $regex: new RegExp(`^${row.subcategory.trim()}$`, 'i') },
                        registerId: req.user.id,
                        deleted_at: null
                    });

                    const data = {
                        categoryId: category._id,
                        subcategory: row.subcategory.trim(),
                        image: row.image?.trim() || '',
                        status: row.status.trim(),
                        registerId: req.user.id
                    };

                    if (existing) {
                        await Subcategory.updateOne({ _id: existing._id }, { $set: data });
                        updated++;
                    } else {
                        await Subcategory.create(data);
                        inserted++;
                    }
                }

                fs.unlinkSync(filePath);
                res.status(200).json({ message: 'Subcategories processed', inserted, updated });
            });
    } catch (err) {
        console.error('Import error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const exportsubCategories = async (req, res) => {
    try {
        const registerId = req.user.id;

        const subcategories = await Subcategory.find({
            registerId,
            deleted_at: null
        }).populate('categoryId', 'category');

        res.setHeader('Content-Disposition', 'attachment; filename=subcategories.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.flushHeaders();

        const csvStream = format({ headers: true });
        csvStream.pipe(res).on('end', () => res.end());


        subcategories.forEach(sub => {
            csvStream.write({
                id: sub._id.toString(),
                category: sub.categoryId?.category || '',
                subcategory: sub.subcategory || '',
                image: sub.image || '',
                status: sub.status || '',
            });
        });
        csvStream.end();

    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export subcategories', error: err.message });
    }
};


module.exports = {
    categories,
    getSubcategories,
    insertSubcategory,
    deleteSubcategory,
    editSubcategory,
    updateSubcategory,
    changeStatus,
    ajaxcategorywiseRecord,
    importsubcategories,
    exportsubCategories
};