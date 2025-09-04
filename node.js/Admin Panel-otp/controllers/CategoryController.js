const Category = require('../models/CategoryModel')
const Subcategory = require('../models/SubcategoryModel')
const Exsubcategory = require('../models/ExsubcategoryModel')


const viewCategory = async (req, res) => {
    try {

        return res.render('category/view_category', {

        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const addCategory = async (req, res) => {
    try {

        const categories = await Category.find()
        return res.render('category/add_category', {
            categories: categories
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

const insertCategory = async (req, res) => {
    try {
        const { category } = req.body;
        let cat = await Category.create({
            category
        })
        console.log('category add')
        req.flash('success', "category sucessfully added")
        return res.redirect('/category/addcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteCategory = async (req, res) => {
    try {
        let id = req.query.id;
     
        await Category.findByIdAndDelete(id);
        await Subcategory.deleteMany({ categoryId: id })
        await Exsubcategory.deleteMany({ categoryId: id })
        req.flash('delete', "category sucessfully deleted")
        return res.redirect('/category/addcategory');

    } catch (err) {
        console.log(err);
        return false;
    }
}

const editCategory = async (req, res) => {
    try {
        let id = req.query.id;

        let singlecategory = await Category.findById(id);
        return res.render('category/edit_category', {
            single: singlecategory
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}

const updateCategory = async (req, res) => {
    try {
        const { editid, category,status } = req.body
        let upcategory = await Category.findByIdAndUpdate(editid, {
            category: category,
            status: status
        })
        req.flash('success', "category sucessfully updated")
        return res.redirect('/category/addcategory');
    } catch (err) {
        console.log(err);
        return false;
    }

}

const changeStatus = async (req, res) => {
    try {
        let id = req.query.id;
        let status = req.query.status;
        if (status == 'inactive') {
            await Category.findByIdAndUpdate(id, {
                status: 'inactive'
            })
        } else {
            await Category.findByIdAndUpdate(id, {
                status: 'active'
            })
        }
        req.flash('success', "category sucessfully changed")
        return res.redirect('/category/addcategory');

    } catch (err) {
        console.log(err);
        return false;
    }

}



module.exports = {
    viewCategory, addCategory, insertCategory, deleteCategory, editCategory, updateCategory, changeStatus
}


