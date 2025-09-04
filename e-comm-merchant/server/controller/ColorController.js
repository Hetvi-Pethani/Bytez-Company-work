
const mongoose = require('mongoose');
const Color = require('../models/ColorModel');
const path = require('path');
const { format } = require('fast-csv');
const fs = require('fs');
const csv = require('fast-csv');

const viewColor = async (req, res) => {
    try {
        const color = await color.find();
        res.json(color);
    }
    catch (err) {
        res.status(500).json({ message: ' Error fetching categories' });
    }
}

// const getcolors = async (req, res) => {
//     try {
//         const registerId = req.user.id;
//         const colors = await Color.aggregate([
//             {
//                 $match: {
//                     registerId: new mongoose.Types.ObjectId(registerId),
//                     deleted_at: null
//                 }
//             }
//         ]);
//         return res.status(200).json(colors);
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).json({ message: 'invelid  request' });
//     }
// }

const getcolors = async (req, res) => {
    try {
        const registerId = req.user.id; // from auth middleware
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

        res.status(200).json(colors);
    } catch (error) {
        console.error('Error in getColors:', error);
        res.status(500).json({ message: 'Server error while fetching colors.' });
    }
};

const insertColor = async (req, res) => {

    try {
        const { color } = req.body;
        const registerId = req.user.id;

        const existingColor = await Color.findOne({
            registerId: req.user.id,
            color: req.body.color.trim().toLowerCase(),
        });

        if (existingColor) {
            return res.status(400).json({
                message: 'color already exists (even if soft-deleted)',
            });
        }

        const keywordString = color
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(k => k)
            .join('');

        const colorData = new Color({
            registerId,
            color: color,
            searchKeywords: keywordString,

        });
        await colorData.save();
        return res.status(200).json({ message: 'color added successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const deleteColor = async (req, res) => {
    try {
        const { id } = req.body;

        const result = await Color.findByIdAndUpdate(
            id,
            {
                $set: {
                    deleted: true,
                    deleted_at: new Date()
                }
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Color not found' });
        }

        return res.status(200).json({ message: 'Color soft-deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Invalid request' });
    }
};

const editColor = async (req, res) => {
    try {
        let { id } = req.body;
        let singleColor = await Color.findById(id);
        return res.json(singleColor)
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const updateColor = async (req, res) => {
    try {
        const { editid, color, status } = req.body;

        const registerId = req.user.id;

        const upcolor = await Color.findOneAndUpdate(
            { _id: editid, registerId: registerId },
            {
                $set: {
                    color: color,
                    status: status
                }
            }
        );
        if (!upcolor) {
            return res.status(404).json({ message: 'color not found' });
        }
        return res.status(200).json({ message: 'colors updated successfully' });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'invalid request' });

    }
};

const changeStatus = async (req, res) => {

    try {
        const { id, status } = req.body;
        if (status == 'inactive') {
            await Color.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Color.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }

        return res.status(200).json({ message: "status changed successfully" })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invalid request' });
    }
}

const importColors = async (req, res) => {
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
            .on('data', (row) => {
                const colorName = row.color?.trim();
                const status = row.status?.trim();

                if (colorName && status) {
                    rows.push({ color: colorName, status });
                } else {
                    console.warn('Missing required fields in row:', row);
                }
            })
            .on('end', async () => {
                try {
                    let inserted = 0, updated = 0;

                    for (const row of rows) {
                        const existing = await Color.findOne({
                            color: { $regex: new RegExp(`^${row.color}$`, 'i') },
                            registerId: req.user.id,
                            deleted_at: null
                        });

                        const data = {
                            color: row.color,
                            status: row.status,
                            registerId: req.user.id
                        };

                        if (existing) {
                            await Color.updateOne({ _id: existing._id }, { $set: data });
                            updated++;
                        } else {
                            await Color.create(data);
                            inserted++;
                        }
                    }

                    fs.unlinkSync(filePath);
                    res.status(200).json({
                        message: 'Colors processed successfully!',
                        inserted,
                        updated
                    });

                } catch (err) {
                    console.error('Insert/update error:', err);
                    res.status(500).json({ message: 'Failed to import colors', error: err.message });
                }
            });

    } catch (err) {
        console.error('Unexpected error during import:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err.message });
    }
};


const exportColors = async (req, res) => {
    try {
        const registerId = req.user.id;

        const colors = await Color.find({
            registerId,
            deleted_at: null
        });

        res.setHeader('Content-Disposition', 'attachment; filename=colors.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.flushHeaders();

        const csvStream = format({ headers: true });
        csvStream.pipe(res).on('end', () => res.end());

        colors.forEach(color => {
            csvStream.write({
                id: color._id.toString(), 
                color: color.color || '',
                status: color.status || ''
            });
        });

        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export colors', error: err.message });
    }
};


module.exports = {
    viewColor, getcolors, insertColor, deleteColor, editColor, updateColor, changeStatus, exportColors, importColors
}