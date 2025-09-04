const size = require('../models/CategoryModel');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const Size = require('../models/sizeModel');
const path = require('path');
const { format } = require('fast-csv');
const fs = require('fs');


const viewSize = async (req, res) => {
    try {
        const size = await size.find();
        res.json(size);
    }
    catch (err) {
        res.status(500).json({ message: ' Error fetching categories' });
    }
}

const getsizes = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search?.trim() || '';


        const sizes = await Size.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null,
                    ...(search && {
                        size: { $regex: search, $options: 'i' }
                    })
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


const insertSize = async (req, res) => {

    try {
        const { size } = req.body;
        const registerId = req.user.id;


        const existingSize = await Size.findOne({
            registerId: req.user.id,
            size: req.body.size.trim().toLowerCase(),
        });

        if (existingSize) {
            return res.status(400).json({
                message: 'size already exists (even if soft-deleted)',
            });
        }

        const keywordString = size
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(k => k)
            .join('');


        const sizeData = new Size({
            registerId,
            size: size,
            searchKeywords: keywordString,
        });
        await sizeData.save();
        return res.status(200).json({ message: 'sizes added successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const deleteSize = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Size.findByIdAndUpdate(
            id,
            {
                $set: {
                    deleted: true,
                    deleted_at: new Date()
                }
            },
            { new: true }

        )
        if (!result) {
            return res.status(404).json({ message: 'Size not found' });
        }

        return res.status(200).json({ message: 'sizes deleted successfully' })
    }

    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const editSize = async (req, res) => {
    try {
        let { id } = req.body;
        let singleSize = await size.findById(id);
        return res.json(singleSize)
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const updateSize = async (req, res) => {
    try {
        const { editid, size, status } = req.body;

        const registerId = req.user.id;

        const upsize = await Size.findOneAndUpdate(
            { _id: editid, registerId: registerId },
            {
                $set: {
                    size: size,
                    status: status
                }
            }
        );
        if (!upsize) {
            return res.status(404).json({ message: 'size not found' });
        }
        return res.status(200).json({ message: 'sizes updated successfully' });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'invalid request' });

    }
};

const changeStatus = async (req, res) => {

    try {
        const { id, status } = req.body;
        if (status == 'inactive') {
            await size.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await size.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }

        return res.status(200).json({ message: "status changed successfully" })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invalid request' });
    }
}

const importSizes = async (req, res) => {
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
                if (row.size && row.status) {
                    rows.push({
                        size: row.size.trim(),
                        status: row.status.trim()
                    });
                } else {
                    console.warn('Missing required size data in row:', row);
                }
            })
            .on('end', async () => {
                try {
                    let inserted = 0, updated = 0;

                    for (const row of rows) {
                        const existing = await Size.findOne({
                            size: { $regex: new RegExp(`^${row.size}$`, 'i') },
                            registerId: req.user.id,
                            deleted_at: null
                        });

                        const data = {
                            size: row.size,
                            status: row.status,
                            registerId: req.user.id
                        };

                        if (existing) {
                            await Size.updateOne({ _id: existing._id }, { $set: data });
                            updated++;
                        } else {
                            await Size.create(data);
                            inserted++;
                        }
                    }

                    fs.unlinkSync(filePath);
                    res.status(200).json({
                        message: 'Sizes processed successfully!',
                        inserted,
                        updated
                    });

                } catch (err) {
                    console.error('Insert/update error:', err);
                    res.status(500).json({ message: 'Failed to import sizes', error: err.message });
                }
            });

    } catch (err) {
        console.error('Unexpected error during import:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err.message });
    }
};


const exportSizes = async (req, res) => {
    try {
        const registerId = req.user.id;

        const sizes = await Size.find({
            registerId,
            deleted_at: null
        });

        res.setHeader('Content-Disposition', 'attachment; filename=sizes.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.flushHeaders();

        const csvStream = format({ headers: true });
        csvStream.pipe(res).on('end', () => res.end());

        sizes.forEach(size => {
            csvStream.write({
                id: size._id.toString(),
                size: size.size || '',
                status: size.status || ''
            });
        });

        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export sizes', error: err.message });
    }
};




module.exports = {
    viewSize, getsizes, insertSize, deleteSize, editSize, updateSize, changeStatus, exportSizes, importSizes
}


