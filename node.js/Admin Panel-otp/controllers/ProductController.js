const Category = require('../models/CategoryModel');
const Subcategory = require('../models/SubcategoryModel')
const Exsubcategory = require('../models/ExsubcategoryModel')
const Product = require('../models/ProductModel');
const fs = require('fs')

const path = require('path');

const viewProduct = async (req, res) => {
    try {
        return res.render('product/view_product', {
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
};
const addProduct = async (req, res) => {

    try {
        let category = await Category.find({ status: 'active' })
        let subcategory = await Subcategory.find({ status: 'active' })
        let exsubcategory = await Exsubcategory.find({ status: 'active' })
        const product = await Product.find()
        .populate('categoryId', 'category')
        .populate('subcategoryId', 'subcategory')
        .populate('exsubcategoryId', 'exsubcategory');
        
        return res.render('product/add_product', {
            category: category,
            subcategory: subcategory,
            exsubcategory: exsubcategory,
            product
        })
    } catch (err) {
        console.log(err)
        return false
    }
}

const insertProduct = async (req, res) => {
    try {
        const { category, subcategory, exsubcategory, product, price, description,status } = req.body;    
        await Product.create({
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategoryId: exsubcategory,
            product: product,
            price: price,
            description: description,
            status: status,
            image: req.file?.filename
        })
        req.flash('success', "Exsubcategory successfully add");
        return res.redirect('/product/addproduct')
    } catch (err) {
        console.log(err);
        return false;
    }
}

const ajaxcategorywiseRecord = async (req, res) => {
    try {
        let subcategoryid = req.query.subcategoryId;
        let exsubcategorydeta = await Exsubcategory.find({ subcategoryId: subcategoryid, status: 'active' }).populate('categoryId').populate('subcategoryId')
        return res.status(200).send({
            status: true,
            message: "Record Found",
            exsubcategory: exsubcategorydeta
        })
    } catch (err) {
        console.log(err)
        return false
    }
}


const deleteProduct = async (req, res) => {
    try {
        const id = req.query.id;
        await Product.findByIdAndDelete(id)

        req.flash('delete', "product successfully delete");
        return res.redirect('/product/addproduct')
    } catch (err) {
        console.log(err)
        return false
    }
}


const editeProduct = async (req, res) => {
    try {
        let id = req.query.id;
        let singleproduct = await Product.findById(id).populate('categoryId').populate('subcategoryId').populate('exsubcategoryId')
        let category = await Category.find({ status: 'active' })
        let subcategory = await Subcategory.find({ status: 'active' })
        let exsubcategory = await Exsubcategory.find({ status: 'active' })
        return res.render('product/edit_product', {
            category: category,
            subcategory: subcategory,
            exsubcategory: exsubcategory,
            single: singleproduct
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}



const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.query;

        if (status === 'active') {
            await Product.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Product.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }
        req.flash('success', "product sucess fulle ubdate");
        return res.redirect('/product/addproduct')
    } catch (err) {
        console.log(err);
        return false;
    }
}



const updateProduct = async (req, res) => {
    try {
        const { editid, category, subcategory, exsubcategory, product, price, description, status } = req.body;

        const existingProduct = await Product.findById(editid);

        const updatedImage = req.file ? req.file?.filename : existingProduct.image;

        await Product.findByIdAndUpdate(editid, {
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategoryId: exsubcategory,
            product: product,
            price: price,
            description: description,
            status: status,
            image:updatedImage
        });

        req.flash('success', "Product successfully updated!");
        return res.redirect('/product/addproduct');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};






module.exports = {
    viewProduct, addProduct, insertProduct, ajaxcategorywiseRecord, changeStatus, deleteProduct, editeProduct, updateProduct
}