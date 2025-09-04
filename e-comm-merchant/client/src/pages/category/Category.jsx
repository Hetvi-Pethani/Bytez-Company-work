import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/header';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { authFetch } from '../../../middleware/authfetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Category = () => {

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [image, setImage] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [editCategory, setEditCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");


  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleCloseAdd = () => setShowAddModal(false);
  const handleShowAdd = () => setShowAddModal(true);
  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = () => setShowEditModal(true);
  const [showModal, setShowModal] = useState(false);


  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentItems = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/')
    }
  }, []);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      let filtered = [...categoryData];

      if (search !== "") {
        filtered = filtered.filter(value =>
          value.category.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status !== "") {
        filtered = filtered.filter(item => item.status === status);
      }

      setFilteredCategories(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, categoryData, status]);

  useEffect(() => {
    fetchCategories(search);
  }, [search]);


  // const fetchCategories = async () => {
  //   try {
  //     const response = await authFetch('http://localhost:8000/category/getcategories', {
  //       method: 'GET',
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     if (response.ok) {
  //       setCategoryData(data);

  //     }
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // };

  const fetchCategories = async (search = '') => {
    try {
      const response = await authFetch(
        `http://localhost:8000/category/getcategories?search=${encodeURIComponent(search)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

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

    const trimmedCategory = category.trim().toLowerCase();

    const categoryExists = categoryData.some(
      item => item.category.trim().toLowerCase() === trimmedCategory
    );
    if (categoryExists) {
      handleShowAdd();
      toast.error("Category already exists");
      return;
    }

    try {

      const searchKeywords = trimmedCategory.split(/\s+/).join(',');

      const formData = new FormData();
      formData.append('category', trimmedCategory);
      formData.append('image', image);
      formData.append('searchKeywords', searchKeywords);

      const response = await fetch('http://localhost:8000/category/insertcategory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Category Added Successfully");
        setCategory("");
        setImage("");
        setSearchKeywords('');
        handleCloseAdd();
        fetchCategories();

      } else {
        toast.error("Category Not Added");
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error("Error adding category");
    }
  };

  const handleEdit = (id) => {
    const categoryToEdit = categoryData.find(item => item._id === id);
    setImage(categoryToEdit.image);
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

    const trimmedCategory = editCategory.trim().toLowerCase();

    const categoryExists = categoryData.some(
      item =>
        item._id !== editId &&
        item.category.trim().toLowerCase() === trimmedCategory
    );

    if (categoryExists) {
      handleShowEdit();
      toast.error("Category already exists");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('category', editCategory);
      formData.append('editid', editId);
      formData.append('status', status);
      formData.append('image', image);

      const response = await fetch('http://localhost:8000/category/updatecategory', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Category Updated Successfully");
        setCategory("");
        setImage("");
        setStatus("");
        setEditId("");
        setEditCategory("");
        handleCloseEdit();
        fetchCategories();
      } else {
        toast.error("Category Not Updated");
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Error updating category");
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
          toast.success("Category Deleted Successfully");
          fetchCategories();

        } else {
          toast.error("Category Not Deleted");
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error("Error deleting category");
      }
    }
  }

  const handleExport = async () => {
    try {
      const response = await authFetch('http://localhost:8000/category/export', {
        method: 'GET',

      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'categories.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (response.ok) {
        toast.success("Exported Successfully");
      }


    } catch (err) {
      console.error("Export failed", err);
      toast.error("Failed to export file.");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    setShowModal(false);
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/category/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Categories imported successfully!');
        fetchCategories();
      } else {
        toast.error(result.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error importing file');
    }
  };



  return (
    <div>
      <Header />
      <div className="pc-container p-3" style={{ top: "65px" }}>
        <div className="row align-items-center">
          <div className="page-header-title">
            <h3 className="mb-3 undefined" >Category</h3>
          </div>
        </div>

        {/* View Category */}
        <div className="row">
          <div className="col-sm-12 ">
            <div className="card">
              <div className="card-header pb-0 p-3">
                <div className="d-flex justify-content-between">
                  <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                    <i className="ti ti-plus" style={{ fontSize: "13px" }}></i> Add Category
                  </Button>
                  <div className="d-flex gap-1 ">
                    <Button style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }} onClick={handleExport}>
                      <i className="ti ti-download"></i> Export
                    </Button>

                    {/* <Button style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }} onClick={() => document.getElementById('importFile').click()}>
                      <i className="ti ti-upload"></i> Import
                    </Button> */}
                    <Button
                      style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }}
                      onClick={() => setShowModal(true)}
                    >
                      <i className="ti ti-upload"></i> Import
                    </Button>

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Select CSV File</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleImport}
                          className="form-control"
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                          Cancel
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* <input
                      type="file"
                      id="importFile"
                      accept=".csv"
                      style={{ display: 'none' }}
                      onChange={handleImport}
                    /> */}
                  </div>
                </div>

                <div className="col-md-12 d-flex justify-content-between align-items-center">

                  <div className="col-md-4">
                    <form className="header-search">
                      <input type="search" className="form-control p-2" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
                    </form>
                  </div>
                  {/* <div>
                      <div
                        className="dataTables_length"
                        id="dom-table_length"
                        style={{ display: 'inline-block', verticalAlign: 'middle' }}
                      >
                        <label className="form-label mb-0 me-2" style={{ display: 'inline-block' }}>
                          Show
                        </label>
                        <select
                          name="dom-table_length"
                          aria-controls="dom-table"
                          className="form-select form-select-sm d-inline-block"
                          style={{ width: 'auto', display: 'inline-block' }}
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <span className="ms-2">entries</span>
                      </div>
                    </div> */}
                  <div className="col-md-2">
                    <select
                      id="status"
                      name="status"
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value=""> -- Status --</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                </div>


              </div>
              <div>
                <table className="table table-hover text-center">
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th >ID</th>
                      <th>Image</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      currentItems.map((item, index) => (
                        <tr key={item._id}>
                          <td >{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td style={{ padding: "0" }}>  <img
                            src={`http://localhost:8000/uploads/${item.image}`}
                            alt="Category"
                            width="30"
                            style={{ borderRadius: '10%' }}
                          />
                          </td>
                          <td >{item.category}</td>
                          <td>
                            <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                              {item.status}
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" style={{ color: "#94a3b8", border: 0 }} onClick={() => handleEdit(item._id)} ><FaRegEdit onClick={handleShowEdit} />
                            </button>
                            &nbsp; &nbsp;
                            <button className="btn  btn-sm" onClick={() => handleDelete(item._id)} style={{ color: "#94a3b8", border: 0 }}><RiDeleteBin6Line />
                            </button>
                          </td>
                        </tr>
                      ))
                    }

                  </tbody>
                </table>

                <div className=' d-flex justify-content-between'>
                  <div className="mt-2 ms-3" style={{ display: 'inline-block' }}>
                    {filteredCategories.length > 0 ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of{' '}
                        {filteredCategories.length} entries
                      </>
                    ) : (
                      <>No entries found</>
                    )}
                  </div>

                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                          Previous
                        </button>
                      </li>

                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>

              </div>

            </div>

          </div>

          {/* Add Category */}


          <Modal show={showAddModal} backdrop="static" keyboard={false} onHide={handleCloseAdd} centered >
            <Modal.Header closeButton>
              <Modal.Title >Add category</Modal.Title>
            </Modal.Header>
            <Modal.Body>


              <form onSubmit={insertCategory} encType="multipart/form-data">
                <div className="form-group mb-0">

                  <div>
                    <label className='form-label m-0 fw-semibold ' >Category</label>
                    <div className="typeahead">
                      <input className="form-control " name="category" type="text" placeholder="Add Category" onChange={(e) => setCategory(e.target.value)} value={category} required />
                    </div>
                  </div>
                </div>

                <div >
                  <div className="typeahead">
                    <label className="form-label m-0  fw-semibold">Image</label>
                    <input className="form-control" name="image" type="file" placeholder="Image" onChange={(e) => setImage(e.target.files[0])} />
                  </div>

                </div>
                <div className="text-end  pb-md-3">
                  <Button variant="secondary" onClick={handleCloseAdd} >
                    Close
                  </Button>
                  &nbsp;
                  <Button type="submit" variant="primary" >
                    Submit
                  </Button>
                </div>
              </form>

            </Modal.Body>
          </Modal>

          {/* Edit Category */}
          <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleUpdate}>
                <div className="form-group  mb-0">
                  <label className="form-label fw-semibold m-0">Edit Category</label>
                  <div>
                    <div className="typeahead">
                      <input className="form-control " name="category" type="text" placeholder="Edit Category" onChange={(e) => setEditCategory(e.target.value)} value={editCategory} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label m-0 fw-semibold">Image</label>
                      <div className="d-flex align-items-center ">
                        <input
                          type="file"
                          className="form-control"
                          name="image"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImage(file);
                              setPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        <img
                          src={preview ? preview : `http://localhost:8000/uploads/${image}`}
                          alt="Preview"
                          width={50}
                          height={50}
                          style={{ borderRadius: '10%', margin: '2%' }}
                        />
                      </div>
                    </div>


                    <div className="form-group row" >
                      <label className="form-label  fw-semibold">Status</label>
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
                <div className="text-end ">
                  <Button variant="secondary" onClick={handleCloseEdit}>
                    Close
                  </Button>
                  &nbsp;&nbsp;
                  <Button variant="primary" type='submit'>
                    Upadate
                  </Button>
                </div>
              </form>

            </Modal.Body>
          </Modal>
        </div>
      </div >
    </div >

  );
}

export default Category;
