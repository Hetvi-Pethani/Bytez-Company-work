const CustomerBill = require("../models/CustomersBillModel");
const CustomerBillItem = require('../models/CustomerBillItemModel');

// const getInvoicePrintData = async (req, res) => {

//   const { customerBillItemId } = req.body;


//   if (!customerBillItemId) {
//     return res.status(400).json({ message: "Missing customerBillItemId in request" });
//   }

//   try {

//     const billitemsData = await CustomerBillItem.findById(customerBillItemId)
//       .populate({
//         path: "customerId",
//         select: "customers contact email location",
//       })
//       .populate({
//         path: "customerBillId",
//         select: "billNo date totalAmount discount cgst sgst grandTotal",
//       })
//       .populate({
//         path: "productId",
//         select: "product",
//       })
//       .populate({
//         path: "stockId",
//         select: "qty rate amount",
//       });

//     if (!billitemsData) {
//       return res.status(404).json({ message: "Bill Item not found" });
//     }

//     const billData = await CustomerBill.findById(billitemsData.customerBillId._id)
//       .populate({
//         path: "customerId",
//         select: "customers contact email location",
//       });

//     if (!billData) {
//       return res.status(404).json({ message: "Bill not found" });
//     }

//     const customer = {
//       customers: billitemsData.customerId?.customers,
//       email: billitemsData.customerId?.email || "",
//       contact: billitemsData.customerId?.contact || "",
//       location: billitemsData.customerId?.location || "",
//     };

//     // const productList =   {
//     //   stockId: billitemsData?.stockId?._id || "",
//     //   productId: billitemsData?.productId?.product || "",
//     //   qty: billitemsData?.qty || 0,
//     //   rate: billitemsData?.rate || 0,
//     //   amount: billitemsData?.amount || 0,
//     // };

//     const productList = billitemsData?.items?.map(p => ({
//       stockId: p.stockId || "",
//       productId: p.productId || "",
//       productName: p.productName || "",
//       qty: p.qty || 0,
//       rate: p.rate || 0,
//       amount: p.amount || 0,
//     })) || [];

//     const billDetails = {
//       billNo: billData?.billNo || "",
//       date: billData?.date || new Date(),
//       billTotal: billData?.billTotal || 0,
//       discount: billData?.discount || 0,
//       cgst: billData?.cgst || 0,
//       sgst: billData?.sgst || 0,
//       grandTotal: billData?.grandTotal || 0,
//     };

//     return res.status(200).json({
//       customer,
//       productList,
//       billDetails,
//     });
//   } catch (error) {
//     console.error("Error fetching invoice print data:", error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

const getInvoicePrintData = async (req, res) => {
  const { customerBillItemId } = req.body;

  if (!customerBillItemId) {
    return res.status(400).json({ message: "Missing customerBillId in request" });
  }

  try {

    const billData = await CustomerBill.findById(customerBillItemId)
      .populate({
        path: "customerId",
        select: "customers contact email location",
      });

    if (!billData) {
      return res.status(404).json({ message: "Bill not found" });
    }


    const billitemsData = await CustomerBillItem.find({  customerBillId: customerBillItemId })
      .populate({
        path: "productId",
        select: "product",
      })
      .populate({
        path: "stockId",
        select: "qty rate amount",
      });


    const customer = {
      customers: billData.customerId?.customers || "",
      email: billData.customerId?.email || "",
      contact: billData.customerId?.contact || "",
      location: billData.customerId?.location || "",
    };


    const productList = billitemsData.map(p => ({
      stockId: p.stockId?._id || "",
      productId: p.productId?._id || "",
      productName: p.productId?.product || "",
      qty: p.qty || 0,
      rate: p.rate || 0,
      amount: p.amount || 0,
    }));

    const billDetails = {
      billNo: billData?.billNo || "",
      date: billData?.date || new Date(),
      billTotal: billData?.billTotal || 0,
      discount: billData?.discount || 0,
      cgst: billData?.cgst || 0,
      sgst: billData?.sgst || 0,
      grandTotal: billData?.grandTotal || 0,
    };

    return res.status(200).json({
      customer,
      productList,
      billDetails,
    });

  } catch (error) {
    console.error("Error fetching invoice print data");
    return res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  getInvoicePrintData
};
