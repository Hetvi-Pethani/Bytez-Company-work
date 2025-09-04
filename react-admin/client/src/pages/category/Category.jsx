import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/header';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { authFetch } from '../../../middleware/authfetch';


const Category = () => {

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [editCategory, setEditCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);


  const handleCloseAdd = () => setShowAddModal(false);
  const handleShowAdd = () => setShowAddModal(true);
  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = () => setShowEditModal(true);


  useEffect(() => {
    let filtered = [...categoryData];

    if (search !== "") {
      filtered = filtered.filter(value =>
        value.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [search, categoryData]);

  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await authFetch('http://localhost:8000/category/getcategories', {
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        setCategoryData(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const insertCategory = async (e) => {
    e.preventDefault();

    const categoryExists = categoryData.some(item => item.category === category);

    if (categoryExists) {
      handleShowAdd()
      alert("Category already exists");
      return;
    }
    try {
      const catdata = {
        category: category,
      };
      const response = await authFetch('http://localhost:8000/category/insertcategory', {
        method: 'POST',
        body: JSON.stringify(catdata)
      });
      const data = await response.json();

      if (response.ok) {
        alert("Category Added Successfully");
        setCategory("");
        handleCloseAdd();
        fetchCategories();
      } else {
        alert("Category Not Added");
      }

    } catch (error) {
      console.error('Error adding category:', error);
      alert("Error adding category");
    }
  }

  const handleEdit = (id) => {
    const categoryToEdit = categoryData.find(item => item._id === id);
    setCategory(categoryToEdit.category);
    setStatus(categoryToEdit.status);
    if (categoryToEdit) {
      setEditId(id);
      setEditCategory(categoryToEdit.category);
      handleShowEdit();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const catdata = {
        category: editCategory,
        editid: editId,
        status: status
      }
      const response = await authFetch('http://localhost:8000/category/updatecategory', {
        method: 'POST',
        body: JSON.stringify(catdata)
      });
      const data = await response.json();

      if (response.ok) {
        alert("Category Updated Successfully");
        handleCloseEdit();
        fetchCategories();
      } else {
        alert("Category Not Updated");
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert("Error updating category");
    }
  }

  const handleDelete = async (id) => {

    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await authFetch('http://localhost:8000/category/deletecategory', {
          method: 'POST',
          body: JSON.stringify({ id })
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          alert("Category Deleted Successfully");
          fetchCategories();

        } else {
          alert("Category Not Deleted");
        }
      } catch (error) {
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
                    <h2 className="mb-0">Category</h2>
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
                    <table className="table table-hover text-center" style={{ fontFamily: "cursive" }} id="pc-dt-simple">
                      <thead >
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          filteredCategories.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.category}</td>
                              <td>
                                <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                                  {item.status}
                                </button>
                              </td>
                              <td>
                                <button className="btn  btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" style={{ color: "#6c757d", border: 0 }} onClick={() => handleEdit(item._id)} ><FaRegEdit onClick={handleShowEdit} />
                                </button>
                                &nbsp; &nbsp;
                                <button className="btn  btn-sm" onClick={() => handleDelete(item._id)} style={{ color: "#6c757d", border: 0 }}><RiDeleteBin6Line />
                                </button>
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
                  <form onSubmit={insertCategory}>
                    <div className="form-group row mb-0">
                      <label className="col-form-label text-lg-start">Add Category</label>
                      <div>
                        <div className="typeahead">
                          <input className="form-control" name="category" type="text" placeholder="Add Category" onChange={(e) => setCategory(e.target.value)} value={category} />
                        </div>
                      </div>
                    </div>
                    <div className="text-end p-3 pb-md-3">
                      <Button variant="secondary" onClick={handleCloseAdd}>
                        Close
                      </Button>
                      &nbsp;
                      <Button type='submit' variant="primary" onClick={handleCloseAdd}>
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
            <Modal.Header closeButton>``
              <Modal.Title>Edit category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleUpdate}>
                    <div className="form-group row mb-0">
                      <label className="col-form-label text-lg-start">Edit Category</label>
                      <div>
                        <div className="typeahead">
                          <input className="form-control" name="category" type="text" placeholder="Edit Category" onChange={(e) => setEditCategory(e.target.value)} value={editCategory} />
                        </div>
                        <div className="form-group row mb-3" style={{ fontSize: '18px' }}>
                          <label className="col-form-label text-lg-start">Status</label>
                          <div>
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
                          </div>
                        </div>
                        {/* <div class="form-group row mb-3">
                          <label class="col-form-label text-lg-start">Status</label>
                          <div>
                            <select class="form-select" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <div className="text-end p-3 pb-md-3">
                      <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                      </Button>
                      &nbsp;&nbsp;
                      <Button variant="primary" type='submit' onClick={handleCloseEdit}>
                        Upadate
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div >
    </div >
  );
}

export default Category;
