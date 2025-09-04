import { useEffect, useState } from "react"
import Header from "../../component/Header/header";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { authFetch } from "../../../middleware/authfetch";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'



const Product = () => {

    const navigate = useNavigate();

    const [product, setProduct] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState("");
    const [products, setProducts] = useState([]);
    const [image, setImage] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [preview, setPreview] = useState(null);
    const [searchKeywords, setSearchKeywords] = useState('');


    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);
    const [showModal, setShowModal] = useState(false);


    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = [...products];

            if (search !== "") {
                filtered = filtered.filter(value =>
                    value.categoryName.toLowerCase().includes(search.toLowerCase()) ||
                    value.subcategoryName.toLowerCase().includes(search.toLowerCase()) ||
                    value.product.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (status !== "") {
                filtered = filtered.filter(item => item.status === status);
            }
            setFilteredProducts(filtered);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, products, status]);


    useEffect(() => {
        fetchCategories(search);
        fetchSubCategories(search);
        fetchProduct(search);
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
                setSubcategories(data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    // const fetchProduct = async () => {
    //     try {
    //         const token = localStorage.getItem('token');

    //         const response = await authFetch('http://localhost:8000/product/getproducts', {
    //             method: 'GET',
    //             // headers: {
    //             //     'Content-Type': 'application/json',
    //             //     'Authorization': 'Bearer ' + localStorage.getItem('token')
    //             // },

    //         })
    //         const data = await response.json();
    //         if (response.ok) {
    //             setProducts(data);
    //         }
    //     }
    //     catch (error) {
    //         console.error('Error fetching product:', error);
    //     }
    // }

    const fetchProduct = async (search = '') => {
        try {

            const response = await authFetch(
                `http://localhost:8000/product/getproducts?search=${encodeURIComponent(search)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await response.json();

            if (response.ok) {
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleCategoryChange = async (e) => {

        const categoryId = e.target.value;
        setSelectedCategoryId(categoryId);

        try {
            const res = await fetch(`http://localhost:8000/subcategory/ajaxcategorywiserecord?categoryId=${categoryId}`);
            const data = await res.json();
            if (data.status) {
                setSubcategories(data.subcategory)
            }
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    }

    const handleSubcategoryChange = async (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategoryId(subcategoryId);
    };


    const insertproduct = async (e) => {
        e.preventDefault();

        const trimmedProduct = product.trim().toLowerCase();

        const productExists = products.some(item =>
            item.product?.trim().toLowerCase() === trimmedProduct &&
            item.categoryId === selectedCategoryId &&
            item.subcategoryId === selectedSubcategoryId &&
            !item.deleted_at
        );

        if (productExists) {
            handleShowAdd();
            toast.error("Product already exists for this category and subcategory");
            return;
        }
        try {

            const searchKeywords = trimmedProduct
                .trim()
                .toLowerCase()
                .split(/\s+/)
                .join(',');

            const formData = new FormData();
            formData.append('category', selectedCategoryId);
            formData.append('subcategory', selectedSubcategoryId);
            formData.append('image', image);
            formData.append('product', product);
            formData.append('searchKeywords', searchKeywords);

            const response = await fetch('http://localhost:8000/product/insertproduct', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Product Inserted Successfully");
                setImage("");
                setProduct("");
                setSelectedCategoryId("");
                setSelectedSubcategoryId("");
                setStatus("");
                setSearchKeywords('');
                setEditId("");
                fetchProduct();
                handleCloseAdd();
            }
        }
        catch (err) {
            console.error('Error inserting product:', err);
        }
    }

    const handleEdit = async (id) => {
        try {
            const productToEdit = products.find(item => item._id === id);

            setSelectedCategoryId(productToEdit.categoryId);
            setSelectedSubcategoryId(productToEdit.subcategoryId);
            setImage(productToEdit.image);
            setProduct(productToEdit.product);
            setStatus(productToEdit.status);
            if (productToEdit) {
                setEditId(id);
                handleShowEdit();
            }
        }

        catch (err) {
            console.error('Error editing product:', err);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const trimmedProduct = product.trim().toLowerCase();

        const productExists = products.some(item =>
            item._id !== editId &&
            item.product?.trim().toLowerCase() === trimmedProduct &&
            item.categoryId === selectedCategoryId &&
            item.subcategoryId === selectedSubcategoryId &&
            !item.deleted_at
        );

        if (productExists) {
            handleShowEdit();
            toast.error("Product already exists for this category and subcategory");
            return;
        }


        try {
            const formData = new FormData();
            formData.append('editid', editId);
            formData.append('category', selectedCategoryId);
            formData.append('subcategory', selectedSubcategoryId);
            formData.append('product', product);
            formData.append('image', image);
            formData.append('status', status);

            const response = await fetch('http://localhost:8000/product/updateproduct', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Product updated successfully");
                fetchProduct();
                setProduct("");
                setImage("");
                setEditId()
                setSelectedCategoryId("");
                setSelectedSubcategoryId("");
                setStatus("");
                handleCloseEdit();
            }
            else {
                toast.error("Failed to update product");
            }

        } catch (err) {
            console.error('Error updating  product:', err);
            toast.error('Error updating  product');
        }
    };

    const handleDelete = async (id) => {

        if (window.confirm('Are you sure you want to delete this  product?')) {
            try {
                const response = await authFetch('http://localhost:8000/product/deleteproduct', {
                    method: 'POST',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    toast.success("Product deleted successfully");
                    fetchProduct();
                }
            }
            catch (err) {
                console.error('Error deleting product:', err);
            }
        }
    }

    const handleExport = async () => {
        try {
            const response = await authFetch('http://localhost:8000/product/export', {
                method: 'GET',
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'products.csv';
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
            const response = await fetch('http://localhost:8000/product/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Product imported successfully!');
                fetchProduct();
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
            <section className="pc-container  p-3" style={{ top: "65px" }}>

                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex">
                            <div className="page-header-title">
                                <h3 className="mb-3">Product</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Product*/}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0 p-3" >
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                                        <i className="ti ti-plus" style={{ fontSize: "13px" }} ></i> Add Product
                                    </Button>

                                    <div className="d-flex gap-2">
                                        <Button style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }} onClick={handleExport}>
                                            <i className="ti ti-download"></i> Export
                                        </Button>

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
                                <div className="col-md-12 d-flex justify-content-between align-items-center">
                                    <div className="col-md-4">
                                        <form className="header-search">
                                            <input type="search" className="form-control" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
                                        </form>
                                    </div>
                                    <div className="col-md-2">
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-control"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)} >
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
                                            <th>Id</th>
                                            <th>Image</th>
                                            <th>Category</th>
                                            <th>Sub Category </th>
                                            <th>Product</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td style={{ padding: "0" }}> <img src={`http://localhost:8000/uploads/${item.image}`} alt="Product"
                                                        width="30"
                                                        style={{ borderRadius: '10%' }} /> </td>
                                                    <td>{item.categoryName}</td>
                                                    <td>{item.subcategoryName}</td>
                                                    <td> {item.product}</td>
                                                    <td>
                                                        <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                                                            {item.status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm" style={{ color: "#94a3b8", border: 0 }} onClick={() => handleEdit(item._id)}><FaRegEdit />
                                                        </button>
                                                        &nbsp; &nbsp;
                                                        <button className="btn btn-sm" onClick={() => handleDelete(item._id)} style={{ color: "#94a3b8", border: 0 }}><RiDeleteBin6Line /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>


                                <div className=' d-flex justify-content-between'>
                                    <div className="mt-2 ms-3" style={{ display: 'inline-block' }}>
                                        {filteredProducts.length > 0 ? (
                                            <>
                                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                                                {filteredProducts.length} entries
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

                    {/*Add Product */}

                    <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered >
                        <Modal.Header closeButton>
                            <Modal.Title>Add Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="card-body">
                                <form onSubmit={insertproduct}>
                                    <div className="d-flex gap-3">
                                        <div className="form-group mb-0 w-50">
                                            <label className="col-form-label  m-0 fw-semibold">Category</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select className="form-control" value={selectedCategoryId} onChange={handleCategoryChange} required>
                                                        <option value="">-- Select a category --</option>
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
                                        </div>
                                        <div className="form-group  mb-0 w-50">
                                            <label className="col-form-label m-0 fw-semibold">SubCategory</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select className="form-control" onChange={handleSubcategoryChange} value={selectedSubcategoryId} required >
                                                        <option value="">-- Select SubCategory --</option>
                                                        {subcategories
                                                            .filter(sub => sub.status === "active")
                                                            .map((sub) => (
                                                                <option key={sub._id} value={sub._id}>
                                                                    {sub.subcategory}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mb-0">
                                        <label className="col-form-label m-0 fw-semibold">Product</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="product" type="text" placeholder="product" value={product} onChange={(e) => setProduct(e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group  mb-0">
                                        <label className="form-label  m-0 fw-semibold">Image</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="image" type="file" placeholder="Image" onChange={(e) => setImage(e.target.files[0])} />
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

                        </Modal.Body>
                    </Modal>

                    {/*Edit Product */}

                    <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="card-body">
                                <form onSubmit={handleUpdate} encType="multipart/form-data">
                                    <div className="d-flex gap-3">
                                        <div className="form-group mb-0 w-50">
                                            <label className="col-form-label text-lg-start">Category</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select className="form-control" value={selectedCategoryId} onChange={handleCategoryChange} required>
                                                        <option value="">-- Select a category --</option>
                                                        {categories
                                                            .filter(cat => cat.status === "active")
                                                            .map(cat => (
                                                                <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group mb-0 w-50">
                                            <label className="col-form-label text-lg-start">Sub Category</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select className="form-control" value={selectedSubcategoryId} onChange={handleSubcategoryChange} required>
                                                        <option value="">-- Select SubCategory --</option>
                                                        {subcategories
                                                            .filter(sub => sub.status === "active")
                                                            .map((sub) => (
                                                                <option key={sub._id} value={sub._id}>
                                                                    {sub.subcategory}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="form-group ">
                                        <label className="col-form-label  text-lg-start">Product</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="product" type="text" placeholder="product" value={product} onChange={(e) => setProduct(e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group ">
                                        <label className="form-label text-lg-start">Image</label>
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

                        </Modal.Body>
                    </Modal>

                </div >
            </section >
        </div >

    )
}

export default Product