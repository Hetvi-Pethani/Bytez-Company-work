import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/header';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { authFetch } from '../../../middleware/authfetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Subcategory = () => {


  const [subCategory, setSubCategory] = useState([]);
  const [SubcategoryData, setSubcategoryData] = useState([])
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [filteredsubCategories, setFilteredSubCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchKeywords, setSearchKeywords] = useState('');
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const [editCategory, setEditCategory] = useState("");
  const [editSubCategory, setEditSubCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);



  const handleCloseAdd = () => setShowAddModal(false);
  const handleShowAdd = () => setShowAddModal(true);
  const handleCloseEdit = () => setShowEditModal(false);
  const handleShowEdit = () => setShowEditModal(true);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredsubCategories.length / itemsPerPage);
  const currentItems = filteredsubCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/')
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      let filtered = [...SubcategoryData];

      if (search !== "") {
        filtered = filtered.filter(value =>
          value.category.toLowerCase().includes(search.toLowerCase()) ||
          value.subcategory.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (status !== "") {
        filtered = filtered.filter(item => item.status === status);
      }
      setFilteredSubCategories(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, SubcategoryData, status]);

  useEffect(() => {
    fetchCategories(search);
    fetchSubCategories(search);
  }, [search]);


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
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // const fetchSubCategories = async () => {
  //   try {
  //     const token = localStorage.getItem('token');

  //     const response = await authFetch('http://localhost:8000/subcategory/getsubcategories', {
  //       method: 'GET',
  //     })
  //     const data = await response.json();
  //     if (response.ok) {
  //       setSubcategoryData(data);
  //     }
  //   }
  //   catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // }

  const fetchSubCategories = async (search = '') => {
    try {
      const response = await authFetch(
        `http://localhost:8000/subcategory/getsubcategories?search=${encodeURIComponent(search)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSubcategoryData(data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };


  // const findCategoryName = (categoryId) => {

  //   const category = categories.find(category => category.id === categoryId);
  //   return category ? category.category : categoryId;
  // };

  const insertsubCategory = async (e) => {
    e.preventDefault();

    const trimmedSubCategory = subCategory.trim().toLowerCase();

    const subcategoryExists = SubcategoryData.some(item =>
      item.subcategory?.trim().toLowerCase() === trimmedSubCategory &&
      item.categoryId === selectedCategoryId &&
      !item.deleted_at
    );

    if (subcategoryExists) {
      handleShowAdd();
      toast.error("Subcategory already exists for this category");
      return;
    }

    try {
      const searchKeywords = trimmedSubCategory.split(/\s+/).join(',');

      const formData = new FormData();
      formData.append('categoryId', selectedCategoryId);
      formData.append('subcategory', trimmedSubCategory);
      formData.append('image', image);
      formData.append('searchKeywords', searchKeywords);

      const response = await fetch('http://localhost:8000/subcategory/insertsubcategory', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Subcategory inserted successfully");
        setSelectedCategoryId("");
        setSubCategory("");
        setImage("");
        setSearchKeywords('');
        handleCloseAdd();
        fetchSubCategories();
      } else {
        toast.error(data.message || "Subcategory not added");
      }
    } catch (error) {
      console.error('Error inserting subcategory:', error);
      toast.error("Error inserting subcategory");
    }
  };

  const handleEdit = (id) => {
    const categoryToEdit = SubcategoryData.find(item => item._id === id);
    setEditCategory(categoryToEdit.editCategory);
    setImage(categoryToEdit.image);
    setEditSubCategory(categoryToEdit.subcategory);
    setSelectedCategoryId(categoryToEdit.categoryId);
    setStatus(categoryToEdit.status);
    if (categoryToEdit) {
      setEditId(id);
      handleShowEdit();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const trimmedSubCategory = editSubCategory.trim().toLowerCase();
    const subcategoryExists = SubcategoryData.some(item =>
      item._id !== editId &&
      item.subcategory?.trim().toLowerCase() === trimmedSubCategory &&
      item.categoryId === selectedCategoryId &&
      !item.deleted_at
    );

    if (subcategoryExists) {
      handleShowEdit();
      toast.error("Subcategory already exists for this category");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('category', selectedCategoryId);
      formData.append('subcategory', editSubCategory);
      formData.append('editid', editId);
      formData.append('status', status);
      formData.append('image', image);

      const response = await fetch(`http://localhost:8000/subcategory/updatesubcategory`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Subcategory updated successfully");
        setEditCategory("");
        setEditSubCategory("");
        setStatus("");
        setImage();
        fetchSubCategories();
        handleCloseEdit();
      } else {
        toast.error(data.message || "Failed to update subcategory");
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error("Error updating subcategory");
    }
  };

  const handleDelete = async (id) => {

    if (window.confirm("Are you sure you want to delete this Subcategory?")) {

      try {
        const response = await authFetch(`http://localhost:8000/subcategory/deletesubcategory`, {
          method: 'POST',
          body: JSON.stringify({ id })
        });
        const data = await response.json();
        console.log(data)

        if (response.ok) {
          toast.success("SubCategory Deleted Successfully");
          fetchSubCategories();
        } else {
          toast.error("Failed to delete subcategory");

        }
      }
      catch (error) {
        console.error('Error deleting Subcategory:', error);
        toast.error("Error deleting Subcategory");
      }
    }
  }


  const handleExport = async () => {
    try {
      const response = await authFetch('http://localhost:8000/subcategory/export', {
        method: 'GET',
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'subcategories.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Export complete!");
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
      const response = await fetch('http://localhost:8000/subcategory/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('SubCategories imported successfully!');
        fetchSubCategories();
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
      <div className="pc-container  p-3" style={{ top: "65px" }}>

        <div className="page-block">
          <div className="row align-items-center">
            <div className="col-md-4 d-flex ">
              <div className="page-header-title">
                <h3 className="mb-3">Sub Category</h3>
              </div>
            </div>
          </div>
        </div>

        {/* View SubCategory */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header pb-0 p-3">
                <div className="d-flex justify-content-between">

                  <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                    <i className="ti ti-plus" style={{ fontSize: "13px" }}></i> Add SubCategory
                  </Button>

                  <div className="d-flex gap-2">
                    <Button style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }} onClick={handleExport}>
                      <i className="ti ti-download"></i> Export
                    </Button>

                    {/* <Button style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }} onClick={() => document.getElementById('importFile').click()}>
                      <i className="ti ti-upload"></i> Import
                    </Button>
                    <input
                      type="file"
                      id="importFile"
                      accept=".csv"
                      style={{ display: 'none' }}
                      onChange={handleImport}
                    /> */}

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

                  </div>
                </div>
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                  <div className="col-md-4">
                    <form className="header-search">
                      <input type="search" className="form-control" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
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


              <div className="table-responsive">
                <table className="table table-hover text-center" id="pc-dt-simple">
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      currentItems.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td style={{ padding: "0" }}>
                            <img
                              src={`http://localhost:8000/uploads/${item.image}`}
                              alt=" "
                              width="30"
                              style={{ borderRadius: '10%', }}
                              onError={() => console.log("Image load failed:", item.image)}
                            />
                          </td>
                          <td>{item.category}</td>
                          <td>{item.subcategory}</td>

                          <td>
                            <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                              {item.status}
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-sm" style={{ color: "#94a3b8", border: 0 }} onClick={() => handleEdit(item._id)}><FaRegEdit /></button>
                            &nbsp; &nbsp;
                            <button className="btn btn-sm" onClick={() => handleDelete(item.id)} style={{ color: "#94a3b8", border: 0 }}><RiDeleteBin6Line /></button>
                          </td>
                        </tr>
                      ))

                    }
                  </tbody>
                </table>

                <div className=' d-flex justify-content-between'>
                  <div className="mt-2 ms-3" style={{ display: 'inline-block' }}>
                    {filteredsubCategories.length > 0 ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredsubCategories.length)} of{' '}
                        {filteredsubCategories.length} entries
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

          {/* Add SubCategory */}
          <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Subcategory</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <div className="card-body">
                <form onSubmit={insertsubCategory}>
                  <div className="d-flex gap-3">
                    <div className="form-group mb-0 w-50">
                      <label className="form-label m-0 fw-semibold">Select Category</label>
                      <select
                        className="form-control"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        required
                      >
                        <option value="">--- Select Category ---</option>
                        {categories
                          .filter(cat => cat.status === "active")
                          .map(cat => (
                            <option key={cat._id} value={cat._id}>
                              {cat.category}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="form-group mb-0 w-50">
                      <label className="form-label m-0 fw-semibold">Sub Category</label>
                      <input
                        className="form-control"
                        name="subcategory"
                        type="text"
                        placeholder="Add Sub Category"
                        onChange={(e) => setSubCategory(e.target.value)}
                        value={subCategory}
                        required
                      />
                    </div>
                  </div>


                  <div className="form-group row mb-3">
                    <label className="form-label m-0 fw-semibold">Image</label>
                    <div>
                      <div className="typeahead">
                        <input className="form-control" name="image" type="file" placeholder="Image" onChange={(e) => setImage(e.target.files[0])} />
                      </div>
                    </div>
                  </div>
                  <div className="text-end ">
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

            </Modal.Body>
          </Modal>

          {/* Edit SubCategory */}
          <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered scrollable>
            <Modal.Header closeButton>
              <Modal.Title>Edit Subcategory</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <div className="card-body">
                <form onSubmit={handleUpdate}>

                  <div className="d-flex gap-3">
                    <div className="form-group mb-0 w-50">
                      <label className="form-label m-0 fw-semibold">Edit Category</label>
                      <div>
                        <select className="form-control" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} required>
                          <option value="">Select a category</option>
                          {
                            categories
                              .filter(cat => cat.status === "active")
                              .map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.category}</option>
                              ))
                          }
                        </select>

                      </div>
                    </div>
                    <div className="form-group mb-0 w-50">
                      <label className="form-label m-0 fw-semibold">Edit Sub Category</label>
                      <div>
                        <input className="form-control" type="text" placeholder="Edit Sub Category" onChange={(e) => setEditSubCategory(e.target.value)} value={editSubCategory} required />
                      </div>
                    </div>
                  </div>

                  <div className="form-group row mb-3">
                    <label className="form-label m-0 fw-semibold">Image</label>
                    <div>
                      <div className="d-flex align-items-center">
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
                  <div className="text-end">
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

            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>

  );
}

export default Subcategory;
