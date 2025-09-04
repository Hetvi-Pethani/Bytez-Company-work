import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/header';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { authFetch } from '../../../middleware/authfetch';

const Subcategory = () => {

  const [subCategory, setSubCategory] = useState([]);
  const [SubcategoryData, setSubcategoryData] = useState([])
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(false);
  const [filteredsubCategories, setFilteredSubCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [editCategory, setEditCategory] = useState("");
  const [editSubCategory, setEditSubCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  const handleCloseAdd = () => setShowAddModal(false);
  const handleShowAdd = () => setShowAddModal(true);
  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = () => setShowEditModal(true);


  useEffect(() => {
    let filtered = [...SubcategoryData];

    if (search !== "") {
      filtered = filtered.filter(value => value.category.includes(search) || value.subcategory.includes(search));
    }

    setFilteredSubCategories(filtered);
  }, [search, SubcategoryData]);


  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await authFetch('http://localhost:8000/category/getcategories', {
        method: 'GET',
        
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await authFetch('http://localhost:8000/subcategory/getsubcategories', {
        method: 'GET',
      })
      const data = await response.json();
      if (response.ok) {
        setSubcategoryData(data);
      }
    }
    catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const findCategoryName = (categoryId) => {

    const category = categories.find(category => category.id === categoryId);
    return category ? category.category : categoryId;
  };

  const insertsubCategory = async (e) => {
    e.preventDefault();

    if (selectedCategoryId === "") {
      alert("Please select a category");
      return;
    }
    if (subCategory === "") {
      alert("Please enter subcategory name");
      return;
    }
    const isDuplicate = SubcategoryData.some((item) => item.categoryId === selectedCategoryId && item.subcategory === subCategory);

    if (isDuplicate) {
      alert("subcategory already exists.");
      return;
    }

    try {
      const subcatdata = {
        categoryId: selectedCategoryId,
        subcategory: subCategory,
      }
      const response = await authFetch('http://localhost:8000/subcategory/insertsubcategory', {
        method: 'POST',
        body: JSON.stringify({ subcatdata })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Subcategory inserted successfully");
        setSelectedCategoryId("");
        setSubCategory("");
        fetchSubCategories("");
        setShowAddModal(false);
      }
    }
    catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const handleEdit = (id) => {
    const categoryToEdit = SubcategoryData.find(item => item._id === id);
    setEditCategory(categoryToEdit.category);
    setEditSubCategory(categoryToEdit.subcategory);
    setSelectedCategoryId(categoryToEdit.categoryId);
    setStatus(categoryToEdit.status);
    if (categoryToEdit) {
      setEditId(id);
      handleShowEdit();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token');
    try {
      const subcatdata = {
        editid: editId,
        category: selectedCategoryId,
        subcategory: editSubCategory,
        status: status
      }
      const response = await authFetch(`http://localhost:8000/subcategory/updatesubcategory`, {
        method: 'POST',
        body: JSON.stringify(subcatdata)
      });
      const data = await response.json();

      if (response.ok) {
        alert("Subcategory updated successfully");
        setEditCategory("");
        setEditSubCategory("");
        fetchSubCategories();
        handleCloseEdit();
      } else {
        alert("Failed to update subcategory");
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      alert("Error updating category");
    }
  }


  const handleDelete = async (id) => {

    if (window.confirm("Are you sure you want to delete this category?")) {

      try {
        const response = await authFetch(`http://localhost:8000/subcategory/deletesubcategory`, {
          method: 'POST',
          body: JSON.stringify({ id })
        });
        const data = await response.json();
        console.log(data)

        if (response.ok) {
          alert("Category Deleted Successfully");
          fetchSubCategories();
        } else {
          alert("Failed to delete subcategory");

        }
      }
      catch (error) {
        console.error('Error deleting category:', error);
        alert("Error deleting category");
      }
    }
  }




  return (
    <div>
      <Header />
      <div className="pc-container">
        <div className="pc-content">
          {/* [ breadcrumb ] start */}
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"><a href="../dashboard/index.html">Home</a></li>
                    <li className="breadcrumb-item"><a href="javascript: void(0)">Forms</a></li>
                    <li className="breadcrumb-item" aria-current="page">TypeAhead</li>
                  </ul>
                </div>
                <div className="col-md-4 d-flex ">
                  <div className="page-header-title">
                    <h2 className="mb-0">Sub Category</h2>
                  </div>
                </div>
                <div className="col-md-4">
                  <form className="header-search">
                    <input type="search" className="form-control" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
                  </form>
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                  <Button variant="primary" onClick={handleShowAdd}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* View Category */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover text-center"  style={{ fontFamily:"cursive"}} id="pc-dt-simple">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Sub Category</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          filteredsubCategories.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{findCategoryName(item.category)}</td>
                              <td>{item.subcategory}</td>
                              <td>
                                <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                                  {item.status}
                                </button>
                              </td>
                              <td>
                                <button className="btn btn-sm" style={{ color: "#6c757d", border: 0 }} onClick={() => handleEdit(item._id)}><FaRegEdit /></button>
                                &nbsp; &nbsp;
                                <button className="btn btn-sm" onClick={() => handleDelete(item.id)} style={{ color: "#6c757d", border: 0 }}><RiDeleteBin6Line /></button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Category */}
          <Modal show={showAddModal} onHide={handleCloseAdd}>
            <Modal.Header closeButton>
              <Modal.Title>Add category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={insertsubCategory}>
                    <div className="form-group row mb-3">
                      <label className="col-form-label text-lg-start">Select Category</label>
                      <div>

                        <select className="form-control" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                          <option value="">Select a category</option>
                          {
                            categories.map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.category}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group row mb-0">
                      <label className="col-form-label text-lg-start">Add Sub Category</label>
                      <div>
                        <div className="typeahead">
                          <input className="form-control" name="subcategory" type="text" placeholder="Add Sub Category" onChange={(e) => setSubCategory(e.target.value)} value={subCategory} />
                        </div>
                      </div>
                    </div>
                    <div className="text-end p-3 pb-md-3">
                      <Button variant="secondary" onClick={handleCloseAdd}>
                        Close
                      </Button>
                      &nbsp;
                      <Button type='submit' variant="primary">
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* Edit Category */}
          <Modal show={showEditModal} onHide={handleCloseEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleUpdate}>
                    <div className="form-group row mb-3">
                      <label className="col-form-label text-lg-start">Edit Category</label>
                      <div>

                        <select className="form-control" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                          <option value="">Select a category</option>
                          {
                            categories.map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.category}</option>
                            ))}
                        </select>

                      </div>
                    </div>
                    <div className="form-group row mb-0">
                      <label className="col-form-label text-lg-start">Edit Sub Category</label>
                      <div>
                        <input className="form-control" type="text" placeholder="Edit Sub Category" onChange={(e) => setEditSubCategory(e.target.value)} value={editSubCategory} />
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="statusSwitch"
                        checked={status === "active"}
                        onChange={(e) => setStatus(e.target.checked ? "active" : "inactive")}
                      />
                      <label className="form-check-label" htmlFor="statusSwitch">
                        {status === "active" ? "Active" : "Inactive"}
                      </label>
                    </div>
                    <div className="text-end p-3 pb-md-3">
                      <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                      </Button>
                      &nbsp;&nbsp;
                      <Button variant="primary" type='submit'>
                        Update
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div >
  );
}

export default Subcategory;
