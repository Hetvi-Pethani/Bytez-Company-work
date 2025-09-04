const Category = require('../models/CategoryModel')
const Subcategory = require('../models/SubcategoryModel')
const Exsubcategory = require('../models/ExsubcategoryModel')


const viewSubcategory = async (req, res) => {
    try {
        return res.render('subcategory/view_subcategory', {

            
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}

const addSubcategory = async (req, res) => {
    try {
        let subcategorydata = await Subcategory.find({}).populate('categoryId')
        const category = await Category.find({ status: 'active' })
        return res.render('subcategory/add_subcategory', {
            category: category,
            subcategory: subcategorydata
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}

const insertSubcategory = async (req, res) => {
    try {
        const { category, subcategory } = req.body;
        let subcat = await Subcategory.create({
            categoryId: category,
            subcategory: subcategory,

        })
        req.flash('success', "subcategory sucess fulle add");
        return res.redirect('/subcategory/addsubcategory')
    } catch (err) {
        console.log(err)
        return false
    }
}

const deleteSubcategory = async (req, res) => {
    try {
        const id = req.query.id;
        let subcat = await Subcategory.findByIdAndDelete(id)
        await Subcategory.findByIdAndDelete(id)
        await Exsubcategory.deleteMany({ subcategoryId: id })
        req.flash('delete', "subcategory sucess fulle delete");
        return res.redirect('/subcategory/addsubcategory')
    } catch (err) {
        console.log(err)
        return false;
    }
}

const editSubcategory = async (req, res) => {
    try {
        let id = req.query.id;
        let singlesubcategory = await Subcategory.findById(id).populate('categoryId')
        let category = await Category.find({ status: 'active' })
        return res.render('subcategory/edit_subcategory', {
            category: category,
            single: singlesubcategory
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}

const updateSubcategory = async (req, res) => {
    try {
        const { editid, category, subcategory, status } = req.body;
        let subcat = await Subcategory.findByIdAndUpdate(editid, {
            categoryId: category,
            subcategory: subcategory,
            status: status
        });
        req.flash('success', "subcategory sucess fulle ubdate");
        return res.redirect('/subcategory/addsubcategory')
    } catch (err) {
        console.log(err);
        return false;
    }
}


const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.query;
        if (status === 'active') {
            await Subcategory.findByIdAndUpdate(id, {
                status: 'active'
            })
        } else {
            await Subcategory.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        }
        req.flash('success', "subcategory sucess fulle ubdate");
        return res.redirect('/subcategory/addsubcategory')
    } catch (err) {
        console.log(err);
        return false;
    }
}


module.exports = {
    viewSubcategory, addSubcategory, insertSubcategory, deleteSubcategory, editSubcategory, updateSubcategory, changeStatus
}