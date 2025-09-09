const CustomerBill = require("../models/CustomersBillModel");
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { format } = require('fast-csv');
const Customers = require("../models/CustomersModel");
const mongoose = require('mongoose');


const getCustomerBills = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search?.trim() || '';

        const matchConditions = {
            registerId: new mongoose.Types.ObjectId(registerId),
            deleted_at: null
        };

        if (search) {
            matchConditions.$or = [
                { billNo: { $regex: search, $options: 'i' } },
            ];
        }

        const customerBills = await CustomerBill.aggregate([
            {
                $match: matchConditions
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerData'
                }
            },
            {
                $unwind: {
                    path: '$customerData',

                }
            },
            {
                $project: {
                    billNo: 1,
                    billTotal: 1,
                    billDate: 1,
                    cgst: 1,
                    sgst: 1,
                    status: 1,
                    customerId: 1,
                    grandTotal: 1,
                    discount: 1,
                    discountAmount: 1,
                    discountType: 1,
                    created_at: 1,
                    customer: {
                        id: '$customerData._id',
                        customers: '$customerData.customers',
                        email: '$customerData.email',
                        contact: '$customerData.contact',
                        location: '$customerData.location',
                        image: '$customerData.image',
                        status: '$customerData.status'
                    }
                }
            },

            {
                $sort: { created_at: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Bills fetched successfully",
            data: customerBills
        });

    } catch (error) {
        console.error("Error fetching customer bills:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching customer bills",
            error: error.message
        });
    }
};

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
                    image: 1,
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


const insertCustomerBill = async (req, res) => {
    try {
        const {
            customerId,
            billNo,
            billDate,
            billTotal,
            cgst,
            sgst,
            grandTotal,
            discount,
            discountAmount,
        } = req.body;

        const registerId = req.user.id;

        const bill = new CustomerBill({
            registerId,
            customerId,
            billNo,
            billDate: billDate ? new Date(billDate) : new Date(),
            billTotal,
            cgst,
            sgst,
            grandTotal,
            discount,
            discountAmount,
            searchKeywords: `${billNo} ${customerId} ${registerId}`.toLowerCase().replace(/\s+/g, " ")
        });

        const savedBill = await bill.save();

        res.status(200).json({
            success: true,
            message: "Customer bill added successfully",
            data: savedBill
        });

    } catch (err) {
        console.error("Error inserting customer bill:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
};

const updateCustomerBill = async (req, res) => {
    try {

        const {
            editId,
            customerId,
            billNo,
            billTotal,
            billDate,
            cgst,
            sgst,
            status,
            grandTotal,
            discount,
            discountAmount,
            discountType,
        } = req.body;

        const registerId = req.user.id;


        await CustomerBill.updateOne({
            _id: editId, registerId
        }, {
            $set: {
                billNo,
                billTotal,
                billDate,
                cgst,
                sgst,
                customerId,
                status,
                grandTotal,
                discount,
                discountAmount,
                discountType,
                
            }
        })

        return res.status(200).json({ success: true, message: "Bill updated" });
    } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
};


const deleteCustomerBill = async (req, res) => {
    try {
        const { id } = req.body;
        const deletebill = await CustomerBill.findByIdAndUpdate(
            id,
            {
                $set: {
                    deleted: true,
                    deleted_at: new Date()
                }
            },

        )
        if (!deletebill) {
            return res.status(404).json({ message: 'customerbill not found' });
        }

        res.status(200).json({ success: true, message: "Bill deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


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

const importCustbills = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'CSV file is required.' });
        }

        const registerId = req.user.id;
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
                    let inserted = 0;
                    let updated = 0;
                    let skipped = 0;

                    for (const row of rows) {
                        const customerName = row.customer?.trim();

                        const customerDoc = await Customers.findOne({
                            customers: customerName,
                            registerId,
                            deleted_at: null
                        });

                        if (!customerDoc) {
                            console.warn(`Skipping row: customer not found -> ${customerName}`);
                            skipped++;
                            continue;
                        }

                        const billNo = row.billNo?.trim();
                        if (!billNo) {
                            console.warn(`Skipping row: billNo missing`);
                            skipped++;
                            continue;
                        }

                        const billData = {
                            customerId: customerDoc._id,
                            registerId,
                            billNo,
                            billDate: row.billDate ? new Date(row.billDate) : new Date(),
                            billTotal: parseFloat(row.billTotal) || 0,
                            cgst: parseFloat(row.cgst) || 0,
                            sgst: parseFloat(row.sgst) || 0,
                            grandTotal: parseFloat(row.grandTotal) || 0,
                            discountType: row.discountType?.toLowerCase().includes('percent') ? "1" : "2",
                            discount: parseFloat(row.discount) || 0,
                            discountAmount: parseFloat(row.discountAmount) || 0,
                            finalTotal: parseFloat(row.finalTotal) || 0,
                            status: row.status?.trim() || 'inactive',
                        };

                        const existingBill = await CustomerBill.findOne({
                            customerId: customerDoc._id,
                            billNo,
                            registerId,
                            deleted_at: null
                        });

                        if (existingBill) {
                            // Update existing bill
                            await CustomerBill.updateOne({ _id: existingBill._id }, { $set: billData });
                            updated++;
                        } else {
                            // Insert new bill
                            await CustomerBill.create(billData);
                            inserted++;
                        }
                    }

                    fs.unlinkSync(filePath); // delete temp file
                    res.status(200).json({
                        message: 'Import finished',
                        inserted,
                        updated,
                        skipped
                    });
                } catch (err) {
                    console.error('Processing error:', err);
                    res.status(500).json({ message: 'Import failed', error: err.message });
                }
            });
    } catch (err) {
        console.error('Unexpected error during import:', err);
        res.status(500).json({ message: 'Unexpected server error', error: err.message });
    }
};


const exportCustbills = async (req, res) => {
    try {
        const registerId = req.user.id;

        const bills = await CustomerBill.find({
            registerId,
            deleted_at: null
        }).populate('customerId', 'customers');

        res.setHeader('Content-Disposition', 'attachment; filename=customer_bills.csv');
        res.setHeader('Content-Type', 'text/csv');

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        bills.forEach(bill => {
            csvStream.write({
                _id: bill._id.toString(),
                customer: bill.customerId?.customers || '',
                billNo: bill.billNo || '',
                billDate: bill.billDate ? bill.billDate.toISOString().split('T')[0] : '',
                billTotal: bill.billTotal || 0,
                cgst: bill.cgst || 0,
                sgst: bill.sgst || 0,
                grandTotal: bill.grandTotal || 0,
                discountType: bill.discountType === "1" ? "Percentage" : "fixed",
                discount: bill.discount || 0,
                discountAmount: bill.discountAmount || 0,
                finalTotal: bill.finalTotal || 0,
                status: bill.status || 'inactive'
            });
        });

        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export customer bills' });
    }
};



module.exports = {
    getCustomerBills, insertCustomerBill, updateCustomerBill, deleteCustomerBill, changeStatus, exportCustbills, importCustbills, getCustomers
}

