const Category = require('../models/CategoryModel');
const Subcategory = require('../models/SubcategoryModel')
const Exsubcategory = require('../models/ExsubcategoryModel')

const viewExsubcategory = async (req, res) => {
    try {
        return res.render('exsubcategory/view_exsubcategory', {
        })

    } catch (err) {
        console.log(err)
        return false
    }
}

const addExsubcategory = async (req, res) => {
    try {
        const exsubcategory = await Exsubcategory.find().populate('categoryId').populate('subcategoryId')
        let category = await Category.find({ status: 'active' })
        let subcategory = await Subcategory.find({ status: 'active' })

        return res.render('exsubcategory/add_exsubcategory', {
            category: category,
            subcategory: subcategory,
            exsubcategory:exsubcategory,
            single :exsubcategory
        })

    } catch (err) {
        console.log(err)
        return false
    }
}

const ajaxcategorywiseRecord = async (req, res) => {
    try {
        let categoryid = req.query.categoryId
        let subcategorydate = await Subcategory.find({ categoryId: categoryid, status: 'active' }).populate('categoryId')

        return res.status(200).send({
            status: true,
            message: "Record Found",
            subcategory : subcategorydate
        })

    } catch (err) {
        console.log(err)
        return false
    }
}

const insertExsubcategory = async (req, res) => {
    try {
        const { category, subcategory, exsubcategory } = req.body;
        await Exsubcategory.create({
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategory: exsubcategory,
            
        })
        req.flash('success', "Exsubcategory successfully add");
        return res.redirect('/exsubcategory/addexsubcategory')
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteExsubcategory = async (req, res) => {
    try {
        const id = req.query.id;
        await Exsubcategory.findByIdAndDelete(id)
        req.flash('delete', "Exsubcategory successfully delete");
        return res.redirect('/exsubcategory/addexsubcategory')
    } catch (err) {
        console.log(err)
        return false
    }
}


const editExsubcategory = async (req, res) => {
    try {
        let id = req.query.id;
        let singleexsubcategory = await Exsubcategory.findById(id).populate('categoryId').populate('subcategoryId')
        let category = await Category.find({ status: 'active' })
        let subcategory = await Subcategory.find({ status: 'active' })
        return res.render('exsubcategory/edit_exsubcategory', {
            category: category,
            subcategory: subcategory,
            single: singleexsubcategory
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}


const updateExsubcategory = async (req, res) => {
    try {
        const { editid, category, subcategory , exsubcategory,status } = req.body;
        await Exsubcategory.findByIdAndUpdate(editid, {
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategory: exsubcategory,
            status: status

        })
        req.flash('success', "subcategory sucess fulle ubdate");
        return res.redirect('/exsubcategory/addexsubcategory')
    } catch (err) {
        console.log(err);
        return false;
    }
}




const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.query;

        if (status === 'active') {
            await Exsubcategory.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Exsubcategory.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }
        req.flash('success', "exsubcategory sucess fulle ubdate");
        return res.redirect('/exsubcategory/addexsubcategory')
    } catch (err) {
        console.log(err);
        return false;
    }
}






module.exports = {
    viewExsubcategory, addExsubcategory, ajaxcategorywiseRecord, insertExsubcategory, deleteExsubcategory,editExsubcategory,updateExsubcategory, changeStatus
}