import { useEffect, useState } from "react"
import Header from "../../component/Header/header";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { authFetch } from "../../../middleware/authfetch";

const Product = () => {

    const [product, setProduct] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedExsubcatId, setSelectedExsubcatId] = useState("");
    const [exsubcategories, setExsubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState(false);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);

    useEffect(() => {
        let filtered = [...products];

        if (search !== "") {
            filtered = filtered.filter(value => value.category.includes(search) || value.subcategory.includes(search) || value.exsubcategory.includes(search));
        }

        setFilteredProducts(filtered);
    }, [search, products]);

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
        fetchExSubCategories();
        fetchProduct();
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
                setSubcategories(data);
            }
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    const fetchExSubCategories = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await authFetch('http://localhost:8000/exsubcategory/getexsubcategories', {
                method: 'GET',
               
            })
            const data = await response.json();
            if (response.ok) {
                setExsubcategories(data);
            }
        }
        catch (err) {
            console.error('Error fetching exsubcategories:', err);
        }
    }

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await authFetch('http://localhost:8000/product/getproducts', {
                method: 'GET',
              
            })
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            }
        }
        catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    const findCategoryName = (categoryId) => {

        const category = categories.find(category => category.id === categoryId);
        return category ? category.category : categoryId;
    };

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedCategoryId(categoryId);

        try {
            const res = await fetch(`http://localhost:8000/exsubcategory/ajaxcategorywiserecord?categoryId=${categoryId}`);
            const data = await res.json();
            if (data.status) {

                setSubcategories(data.subcategory);
            }
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    };

    const handleSubcategoryChange = async (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategoryId(subcategoryId);
        setSelectedExsubcatId('');
        
        try {
            const res = await fetch(`http://localhost:8000/product/ajaxcategorywiseRecord?subcategoryId=${subcategoryId}`);
            const data = await res.json();
            if (data.status) {
                setExsubcategories(data.exsubcategory);
            }
        } catch (err) {
            console.error('Error fetching exsubcategories:', err);
        }
    };

    const handleExsubcatChange = (e) => {
        const exsubcatId = e.target.value;
        setSelectedExsubcatId(exsubcatId);
    };

    const insertproduct = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('category', selectedCategoryId);
            formData.append('subcategory', selectedSubcategoryId);
            formData.append('exsubcategory', selectedExsubcatId);
            formData.append('product', product);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('image', image);

            const response = await authFetch('http://localhost:8000/product/insertproduct', {
                method: 'POST',
               
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert("Product Inserted Successfully");
                setProduct([]);
                setDescription("");
                setPrice("");
                setImage("");
                setSelectedCategoryId("");
                setSelectedSubcategoryId("");
                setSelectedExsubcatId("");
                setStatus("");
                setEditId("");
                fetchProduct();
                handleCloseAdd("")
            }
        }
        catch (err) {
            console.error('Error inserting product:', err);
        }
    }

    const handleEdit = async (id) => {
        try {
            const itemToEdit = products.find(item => item.id === id);
            if (itemToEdit) {
                setProduct(itemToEdit.product);
                setDescription(itemToEdit.description);
                setPrice(itemToEdit.price);
                setImage(itemToEdit.image);
                setSelectedCategoryId(itemToEdit.categoryId);
                setSelectedSubcategoryId(itemToEdit.subcategoryId);
                setSelectedExsubcatId(itemToEdit.exsubcategoryId);
                setStatus(itemToEdit.status);
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
        try {
            const formData = new FormData();

            formData.append('editid', editId);
            formData.append('category', selectedCategoryId);
            formData.append('subcategory', selectedSubcategoryId);
            formData.append('exsubcategory', selectedExsubcatId);
            formData.append('product', product);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('image', image);
            formData.append('status', status);

            const response = await authFetch('http://localhost:8000/product/updateproduct', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert("Product updated successfully");
                fetchProduct([]);
                setProduct("");
                setDescription("");
                setPrice("");
                setImage("");
                setSelectedCategoryId("");
                setSelectedSubcategoryId("");
                setSelectedExsubcatId("");
                setStatus("");
                setEditId("");
                handleCloseEdit();
            }
            else {
                alert("Failed to update subcategory");
            }

        } catch (err) {
            console.error('Error updating exsubcategory:', err);
            alert('Error updating exsubcategory');
        }
    };

    const handleDelete = async (id) => {

        if (window.confirm('Are you sure you want to delete this exsubcategory?')) {
            try {
                const response = await authFetch('http://localhost:8000/product/deleteproduct', {
                    method: 'POST',
                  
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    alert("Product deleted successfully");
                    fetchProduct();
                }
            }
            catch (err) {
                console.error('Error deleting product:', err);
            }
        }
    }

    return (
        <div>
            <Header />
            <section className="pc-container">
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
                                <div className="col-md-4 d-flex">
                                    <div className="page-header-title">
                                        <h2 className="mb-0">Product</h2>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <form className="header-search">
                                        <input type="search" className="form-control" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
                                    </form>
                                </div>
                                <div className="col-md-4 d-flex justify-content-end">
                                    {/* Button trigger modal */}
                                    <Button variant="primary" onClick={handleShowAdd}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* View Product*/}

                    <div className="card table-card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover text-center"  style={{ fontFamily:"cursive"}} id="pc-dt-simple">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Category</th>
                                            <th>Sub Category </th>
                                            <th>Exsub Category  </th>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Description</th>
                                            <th>Image</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredProducts.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{findCategoryName(item.category)}</td>
                                                    <td>{item.subcategory}</td>
                                                    <td>{(item.exsubcategory)}</td>
                                                    <td> {item.product}</td>
                                                    <td> {item.price}</td>
                                                    <td> {item.description}</td>
                                                    <td> <img src={`http://localhost:8000/uploads/${item.image}`} alt="Product" width="150" /> </td>
                                                    <td>
                                                        <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                                                            {item.status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm" style={{ color: "#6c757d", border: 0 }} onClick={() => handleEdit(item.id)}><FaRegEdit />
                                                        </button>
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

                    {/*Add Product */}
                    <Modal show={showAddModal} onHide={handleCloseAdd}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={insertproduct}>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label  text-lg-start">Category</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select className="form-control" value={selectedCategoryId} onChange={handleCategoryChange}>
                                                        <option value="">Select a category</option>
                                                        {
                                                            categories.map(cat => (
                                                                <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">Sub
                                                Category</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select
                                                        name="subcategory"
                                                        className="form-control"
                                                        value={selectedSubcategoryId}
                                                        onChange={handleSubcategoryChange}
                                                    >
                                                        <option value="">-- Select SubCategory --</option>
                                                        {subcategories.map((sub) => (
                                                            <option key={sub._id} value={sub._id}>
                                                                {sub.subcategory}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">ExSubCategory</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select className="form-control"
                                                        value={selectedExsubcatId}
                                                        name="exsubcategory" onChange={handleExsubcatChange} >
                                                        <option value="">-- Select Exsubcategory --</option>
                                                        {
                                                            exsubcategories.map((ex) => (<option key={ex._id} value={ex._id}>{ex.exsubcategory}
                                                            </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label  text-lg-start">Product</label>
                                            <div>
                                                <div className="typeahead">
                                                    <input className="form-control" name="product" type="text" placeholder="product" value={product} onChange={(e) => setProduct(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label  text-lg-start">Price</label>
                                            <div>
                                                <div className="typeahead">
                                                    <input className="form-control" name="price" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label  text-lg-start">Description</label>
                                            <div>
                                                <div className="typeahead">
                                                    <input className="form-control" name="description" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label  text-lg-start">Image</label>
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
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/*Edit Product */}

                    <Modal show={showEditModal} onHide={handleCloseEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={handleUpdate} encType="multipart/form-data">

                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">Category</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select className="form-control" value={selectedCategoryId} onChange={handleCategoryChange}>
                                                        <option value="">Select a category</option>
                                                        {
                                                            categories.map(cat => (
                                                                <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">Sub
                                                Category</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select name="subcategory" className="form-control" value={selectedSubcategoryId} onChange={handleSubcategoryChange} >
                                                        <option value="">-- Select SubCategory --</option>
                                                        {subcategories.map((sub) => (
                                                            <option key={sub._id} value={sub._id}>
                                                                {sub.subcategory}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">ExSubCategory</label>
                                            <div>
                                                <div className="typeahead">
                                                    <select name="exsubcategory" className="form-control" value={selectedExsubcatId} onChange={handleExsubcatChange}>
                                                        <option value="">-- Select ExSubCategory --</option>
                                                        {exsubcategories.map((exsub) => (
                                                            <option key={exsub._id} value={exsub._id}>{exsub.exsubcategory}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label text-lg-start">Product</label>
                                            <div>
                                                <div className="typeahead">
                                                    <input className="form-control" name="product" type="text" placeholder="product" value={product} onChange={(e) => setProduct(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label text-lg-start">Price</label>
                                            <div>
                                                <div className="typeahead">
                                                    <input className="form-control" name="price" type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} value={price} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label text-lg-start">Description</label>
                                            <div>
                                                <div className="typeahead">
                                                    <input className="form-control" name="description" type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label text-lg-start">Image</label>
                                            <div>
                                                <div className="typeahead">
                                                    <input type="file" className="form-control" name="image" onChange={(e) => setImage(e.target.files[0])} />
                                                </div>
                                                <div className="typeahead">
                                                    <img src={`http://localhost:8000/uploads/${image}`} alt="Current" width={200} />
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
                            </div>
                        </Modal.Body>
                    </Modal>

                </div >
            </section >
        </div >

    )
}

export default Product