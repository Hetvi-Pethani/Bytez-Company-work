const CustomerBillItem = require('../models/CustomerBillItemModel');
const CustomerBill = require('../models/CustomersBillModel');
const Customers = require('../models/CustomersModel');
const Stock = require('../models/StockModel');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { format } = require('fast-csv');




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
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            { $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategoryId',
                    foreignField: '_id',
                    as: 'subcategoryData'
                }
            },
            { $unwind: { path: '$subcategoryData', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'sizes',
                    localField: 'sizeId',
                    foreignField: '_id',
                    as: 'sizeData'
                }
            },
            { $unwind: { path: '$sizeData', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'colors',
                    localField: 'colorId',
                    foreignField: '_id',
                    as: 'colorData'
                }
            },
            { $unwind: { path: '$colorData', preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1,
                    qty: 1,
                    purchasePrice: 1,
                    sellingPrice: 1,
                    status: 1,
                    image: 1,
                    searchKeywords: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "productName": "$productData.product",
                    "subcategoryName": "$subcategoryData.subcategory",
                    "categoryName": "$categoryData.category",
                    "sizeName": "$sizeData.size",
                    "colorName": "$colorData.color"
                }
            }
        ]);

        return res.status(200).json(stock);

    } catch (err) {
        console.error('Error in getstocks:', err);
        return res.status(500).json({ message: 'Error fetching stocks' });
    }
};

const getcustomers = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search?.trim() || '';

        const customers = await Customers.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null,
                    ...(search && {
                        $or: [
                            { customers: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { location: { $regex: search, $options: 'i' } },
                            { contact: { $regex: search, $options: 'i' } }
                        ]
                    })
                }
            },
            {
                $project: {
                    id: '$_id',
                    customers: 1,
                    status: 1,
                    location: 1,
                    email: 1,
                    contact: 1,
                    image: 1,
                }
            }
        ]);
        return res.status(200).json(customers);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'invelid  request' });
    }
}
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
                    finalTotal: 1,
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


const getcustBillitems = async (req, res) => {
    try {
        const registerId = req.user.id;
        const search = req.query.search?.trim() || '';

        const items = await CustomerBillItem.aggregate([
            {
                $match: {
                    registerId: new mongoose.Types.ObjectId(registerId),
                    deleted_at: null
                }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: "$customer" },
            {
                $lookup: {
                    from: "customerbills",
                    localField: "customerBillId",
                    foreignField: "_id",
                    as: "bill"
                }
            },
            { $unwind: "$bill" },
            {
                $lookup: {
                    from: "stocks",
                    localField: "stockId",
                    foreignField: "_id",
                    as: "stock"
                }
            },
            { $unwind: "$stock" },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },

            ...(search
                ? [{
                    $match: {
                        $or: [
                            { "customer.customers": { $regex: search, $options: "i" } },
                            { "bill.billNo": { $regex: search, $options: "i" } },
                            { "product.product": { $regex: search, $options: "i" } }
                        ]
                    }
                }]
                : []),

            {
                $project: {
                    id: "$_id",
                    registerId: 1,
                    customerBillId: 1,
                    customerId: 1,
                    stockId: "$stock._id",
                    productId: "$product._id",
                    qty: 1,
                    rate: 1,
                    status: 1,
                    customer: "$customer.customers",
                    billNo: "$bill.billNo",
                    productName: "$product.product",
                    amount: 1,

                }

            }
        ]);


        res.status(200).json({
            success: true,
            message: "Customer bill items fetched successfully",
            data: items
        });

    } catch (error) {
        console.error("Error fetching customer bill items:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bill items",
            error: error.message
        });
    }
};





// const insertCustomerBillItem = async (req, res) => {
//     try {
//         const { customerBillId, customerId, stockId, productId, status } = req.body;

//         const registerId = req.user.id;

//         const newItem = CustomerBillItem({
//             registerId,
//             customerBillId,
//             customerId,
//             productId,
//             stockId,
//             status
//         });

//         const result = await newItem.save();

//         return res.status(200).json({
//             message: 'Customer bill item inserted successfully',
//             data: result
//         });

//     } catch (err) {
//         console.error("Insert error:", err.message);
//         return res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };



const insertCustomerBillItem = async (req, res) => {
    try {
        const { customerBillId, customerId, productList, status } = req.body;
        const registerId = req.user.id;


        const itemsPayload = productList.map(item => ({
            registerId,
            customerBillId,
            customerId,
            stockId: item.stockId,
            productId: item.productId,
            qty: (item.qty) || 0,
            rate: (item.rate) || 0,
            amount: (item.amount) || ((item.qty) * (item.rate)),
            status
        }));


        const result = await CustomerBillItem.insertMany(itemsPayload);

        console.log("Inserted Customer Bill Items:", result);

        return res.status(200).json({ success: true, message: "Customer bill items inserted successfully", data: result });

    } catch (error) {
        console.error("Insert error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};




const deleteCustomerBillItem = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await CustomerBillItem.findByIdAndUpdate(id,

            { deleted_at: new Date() },
            { new: true }
        );

        if (!result) {
            return res.status(404).json("Item not found");
        }
        return res.status(200).json({ message: 'customers deleted successfully' })
    } catch (err) {
        res.status(500).json(" Error deleting Customer Bill Item");
    }
};

const updateCustomerBillItem = async (req, res) => {
    try {
        const { editId, customerBillId, customerId, stockId, productId, qty, rate, amount, status } = req.body;
        const registerId = req.user.id;

        const updateData = {
            registerId,
            customerBillId,
            customerId,
            stockId,
            productId,
            qty: Number(qty) || 0,
            rate: Number(rate) || 0,
            amount: Number(amount) || (Number(qty) * Number(rate)),
            status
        };

        const updated = await CustomerBillItem.findOneAndUpdate(
            { _id: editId, registerId },
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Customer Bill Item not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Customer Bill Item updated successfully",
            data: updated
        });

    } catch (err) {
        console.error("Update Error:", err.message);
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
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

const importCustItems = async (req, res) => {
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
                console.error('CSV parse error:', error);
                return res.status(500).json({ message: 'CSV parsing failed' });
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
                        const customer = await Customers.findOne({
                            registerId,
                            customers: row.customer,
                            deleted_at: null
                        });

                        const customerBill = await CustomerBill.findOne({
                            registerId,
                            billNo: row.billNo,
                            deleted_at: null
                        });

                        const stock = await Stock.findOne({
                            registerId,
                            stock: row.stock,
                            deleted_at: null
                        });

                        if (!customer || !customerBill || !stock) {
                            console.warn(`Skipping row due to missing reference:`, row);
                            skipped++;
                            continue;
                        }

                        const filter = {
                            registerId,
                            customerId: customer._id,
                            customerBillId: customerBill._id,
                            stockId: stock._id,
                            deleted_at: null
                        };

                        const existingItem = await CustomerBillItem.findOne(filter);

                        const itemData = {
                            qty: Number(row.qty) || 0,
                            status: row.status?.toLowerCase() || 'inactive',
                        };

                        if (existingItem) {
                            await CustomerBillItem.updateOne({ _id: existingItem._id }, { $set: itemData });
                            updated++;
                        } else {
                            await CustomerBillItem.create({
                                ...itemData,
                                registerId,
                                customerId: customer._id,
                                customerBillId: customerBill._id,
                                stockId: stock._id,
                            });
                            inserted++;
                        }
                    }

                    fs.unlinkSync(filePath); // Clean up uploaded file
                    res.status(200).json({
                        message: 'Customer bill items imported successfully.',
                        inserted,
                        updated,
                        skipped
                    });
                } catch (err) {
                    console.error('Insert/update failed:', err);
                    res.status(500).json({ message: 'Failed to import customer bill items' });
                }
            });
    } catch (err) {
        console.error('Import failed:', err);
        res.status(500).json({ message: 'Failed to import customer bill items' });
    }
};


const exportCustItems = async (req, res) => {
    try {
        const registerId = req.user.id;

        const items = await CustomerBillItem.find({
            registerId,
            deleted_at: null
        })
            .populate('customerId', 'customers')
            .populate('customerBillId', 'billNo')
            .populate('stockId', ' stock');

        res.setHeader('Content-Disposition', 'attachment; filename=customer_bill_items.csv');
        res.setHeader('Content-Type', 'text/csv');

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        items.forEach(item => {
            csvStream.write({
                _id: item._id.toString(),
                customer: item.customerId?.customers || '',
                billNo: item.customerBillId?.billNo || '',
                stock: item.stockId?.stock || '',
                qty: item.qty || 0,
                status: item.status || 'inactive'
            });
        });

        csvStream.end();
    } catch (err) {
        console.error('Export failed:', err);
        res.status(500).json({ message: 'Failed to export customer bill items' });
    }
};

module.exports = {
    insertCustomerBillItem,
    getcustBillitems,
    deleteCustomerBillItem,
    updateCustomerBillItem,
    changeStatus,
    getcustomers,
    getCustomerBills,
    getstocks,
    exportCustItems,
    importCustItems
};