
const mongoose = require('mongoose');
const Customers = require('../models/CustomersModel');
const CustomerBill = require('../models/CustomersBillModel');
const Invoice = require('../models/InvoiceModel');
const CustomerBillItem = require('../models/CustomerBillItemModel');



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
        const { customers, email, contact, location } = req.body;
        const registerId = req.user.id;


        const existing = await Customers.findOne({
            customers: customers,
            deleted_at: null,
        });

        if (existing) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        const newCustomer = Customers({
            registerId,
            customers,
            email,
            contact,
            location,

        });

        const savedCustomer = await newCustomer.save();

        return res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            customer: savedCustomer,
        });
    } catch (error) {
        console.error('Error inserting customer:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getInvoices = async (req, res) => {
    try {
        const registerId = req.user.id;

        const invoices = await Invoice.find({
            registerId,
            
        }).populate('customerId')
            .populate('customerBillId')
            .populate('registerId')
        return res.status(200).json(invoices);
    }
    catch (error) {
        console.error('Error fetching invoices:', error);
    }
}
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
                            { "bill.customerbills": { $regex: search, $options: "i" } },
                            { "product.products": { $regex: search, $options: "i" } }
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
                    qty: { $multiply: ["$qty", "$stock.qty"] },
                    rate: { $multiply: ["$qty", "$stock.rate"] },
                    status: 1,
                    customer: "$customer.customers",
                    billNo: "$bill.billNo",
                    productName: "$product.product",
                    amount: { $multiply: ["$qty", "$stock.amount"] },

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

//         const newItem = new CustomerBillItem({
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

// const getcustBillitems = async (req, res) => {
//     try {
//         const items = await CustomerBillItem.find()
//             .populate("customerId")
//             .populate("productId");
//         res.json({ success: true, data: items });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// const insertCustomerBillItem = async (req, res) => {
//     try {
//         const registerId = req.user.id;
//         let { customerBillId, customerId, productList, stockId, productId, qty, rate, amount, status } = req.body;


//         productList = [{
//             stockId,
//             productId,
//             qty,
//             rate,
//             amount
//         }];

//         const itemsPayload = productList
//             .filter(p => p.stockId && p.productId)
//             .map(p => ({
//                 registerId,
//                 customerBillId,
//                 customerId,
//                 stockId: p.stockId,
//                 productId: p.productId,
//                 qty: Number(p.qty) || 0,
//                 rate: Number(p.rate) || 0,
//                 amount: Number(p.amount || ((p.qty) * (p.rate || 0))),
//                 status: status || "active",
//             }));


//         const result = await CustomerBillItem.insertMany(itemsPayload);

//         return res.status(200).json({
//             success: true,
//             message: "Customer bill items inserted successfully",
//             data: result
//         });

//     } catch (err) {
//         console.error("Insert error:", err);
//         return res.status(500).json({ message: "Server error", error: err.message });
//     }
// };


const insertCustomerBillItem = async (req, res) => {
    try {
        const { customerBillId, customerId, productList, } = req.body;
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

        }));


        const result = await CustomerBillItem.insertMany(itemsPayload);

        return res.status(200).json({ success: true, message: "Customer bill items inserted successfully", data: result });

    } catch (error) {
        console.error("Insert error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


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

const insertCustomerBill = async (req, res) => {
    try {
        const registerId = req.user.id;

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
            discountType,
            finalTotal
        } = req.body;


        const customerbill = CustomerBill({
            registerId,
            customerId,
            billNo,
            billDate,
            billTotal,
            cgst,
            sgst,
            grandTotal,
            discount,
            discountAmount,
            discountType,
            finalTotal,
        });

        const savedCustomerBill = await customerbill.save();

        return res.status(201).json({
            message: "Customer bill created successfully",
            customerbill: savedCustomerBill,
        });

    } catch (error) {
        console.error("Error inserting customer bill and invoice:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




module.exports = {
    insertCustomers, getCustomers, insertCustomerBill, getCustomerBills, insertCustomerBillItem, getInvoices,
    getcustBillitems,
}