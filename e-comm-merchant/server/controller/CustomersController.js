const mongoose = require('mongoose');
const Customers = require('../models/CustomersModel');
const fs = require('fs');
const path = require('path');
const { format } = require('fast-csv');
const csv = require('fast-csv');

const viewCustomers = async (req, res) => {
    try {
        const customers = await Customers.find();
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ message: ' Error fetching Customers' });
    }
}

// const getCustomers = async (req, res) => {
//     try {
//         const registerId = req.user.id;
//         const customers = await Customers.aggregate([
//             {
//                 $match: {
//                     registerId: new mongoose.Types.ObjectId(registerId),
//                     deleted_at: null
//                 }
//             },

//             {
//                 $project: {
//                     id: '$_id',
//                     customers: 1,
//                     status: 1,
//                     location: 1,
//                     email: 1,
//                     contact: 1,
//                     image: 1,
//                 }
//             }
//         ]);
//         return res.status(200).json(customers);
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).json({ message: 'invelid  request' });
//     }
// }

const getCustomers = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search || '';

        const customers = await Customers.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null,
                    ...(search && {
                        $or: [
                            { customers: { $regex: search, $options: 'i' } },
                            { location: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { contact: { $regex: search, $options: 'i' } }
                        ]
                    })
                }
            },
            {
                $project: {
                    id: '$_id',
                    customers: 1,
                    location: 1,
                    email: 1,
                    contact: 1,
                    status: 1
                }
            }
        ]);

        return res.status(200).json(customers);
    } catch (err) {
        console.error('Error in getCustomers:', err);
        return res.status(400).json({ message: 'Invalid request' });
    }
};

const insertCustomers = async (req, res) => {

    try {

        const { customers, contact, location, email } = req.body;
        const registerId = req.user.id;

        const keywordString = customers
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(k => k)
            .join('');

        const customersData = new Customers({
            registerId,
            customers: customers,
            email: email,
            contact: contact,
            location: location,
            searchKeywords: keywordString,
        })

        await customersData.save();
        return res.status(200).json({ message: 'customers added successfully' });

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const deletecustomers = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Customers.findByIdAndUpdate(
            id,
            {
                $set: {
                    deleted: true,
                    deleted_at: new Date()
                }
            },
        )
        if (!result) {
            return res.status(404).json({ message: 'customers not found' });
        }

        return res.status(200).json({ message: 'customers deleted successfully' })
    }

    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const editcustomers = async (req, res) => {
    try {
        let { id } = req.body;
        let singlecustomers = await Customers.findById(id);
        return res.json(singlecustomers)
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid request' });
    }
}

const updatecustomers = async (req, res) => {
    try {
        const { editid, customers, status, email, contact, location } = req.body;
        const registerId = req.user.id;

        const existingCustomer = await Customers.findOne({ _id: editid, registerId });

        if (!existingCustomer) {
            return res.status(404).json({ message: 'customers not found' });
        }

       

        await Customers.findByIdAndUpdate({
            _id: editid,
            registerId
        },
            {
                $set: {
                    customers,
                    contact,
                    email,
                    location,
                    status,
                  
                }
            }

        )

        return res.status(200).json({ message: 'customers updated successfully' });

    } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const changeStatus = async (req, res) => {

    try {
        const { id, status } = req.body;
        if (status == 'inactive') {
            await Customers.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Customers.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }

        return res.status(200).json({ message: "status changed successfully" })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invalid request' });
    }
}

const importCustomers = async (req, res) => {
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
                if (row.customers && row.email && row.contact && row.location) {
                    rows.push({
                        customers: row.customers.trim(),
                        email: row.email.trim(),
                        contact: row.contact.trim(),
                        location: row.location.trim(),
                        status: row.status.trim()
                    });
                } else {
                    console.warn('Missing required fields in row:', row);
                }
            })
            .on('end', async () => {
                try {
                    if (rows.length === 0) {
                        fs.unlinkSync(filePath);
                        return res.status(400).json({ message: 'CSV file is empty or invalid.' });
                    }

                    let inserted = 0;
                    let updated = 0;

                    for (const row of rows) {
                        const existing = await Customers.findOne({
                            registerId: req.user.id,
                            $or: [
                                { email: row.email },
                                { contact: row.contact }
                            ],
                            deleted_at: null
                        });

                        if (existing) {
                            await Customers.updateOne(
                                { _id: existing._id },
                                {
                                    $set: {
                                        customers: row.customers,
                                        email: row.email,
                                        contact: row.contact,
                                        location: row.location,
                                        status: row.status,
                                        updated_at: new Date()
                                    }
                                }
                            );
                            updated++;
                        } else {
                            await Customers.create({
                                ...row,
                                registerId: req.user.id,
                                created_at: new Date()
                            });
                            inserted++;
                        }
                    }

                    fs.unlinkSync(filePath);

                    res.status(200).json({
                        message: 'Customers import completed.',
                        inserted,
                        updated
                    });
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

const exportsCustomers = async (req, res) => {
    try {
        const registerId = req.user.id;

        const customers = await Customers.find({
            registerId,
            deleted_at: null
        });

        res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.flushHeaders();

        const csvStream = format({ headers: true });
        csvStream.pipe(res).on('end', () => res.end());

        customers.forEach(customer => {
            csvStream.write({
                id: customer._id.toString(),
                customers: customer.customers || '',
                email: customer.email || '',
                contact: customer.contact || '',
                location: customer.location || '',
                status: customer.status || ''
            });
        });
        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export customers', error: err.message });
    }
};



module.exports = {
    viewCustomers, getCustomers, insertCustomers, deletecustomers, editcustomers, updatecustomers, changeStatus, importCustomers, exportsCustomers
}


