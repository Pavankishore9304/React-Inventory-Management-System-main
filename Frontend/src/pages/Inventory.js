import React, { useState, useEffect, useContext, useCallback } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState({});
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProductsData();
    fetchStoresData();
  }, [fetchProductsData, fetchStoresData]);

  // Fetch All Products Data
  const fetchProductsData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/product/get/${authContext.user}`
      );
      const data = await response.json();
      setAllProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  }, [authContext.user]);

  // Fetch Search Products Data
  const fetchSearchData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/product/search?searchTerm=${searchTerm}`
      );
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  }, [searchTerm]);

  // Fetch All Stores Data
  const fetchStoresData = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/store/get/${authContext.user}`
      );
      const data = await response.json();
      setAllStores(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  // Handle Search Input Change with Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchSearchData();
      } else {
        fetchProductsData();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchSearchData, fetchProductsData]);

  // Handle Add Product Modal Toggle
  const toggleAddProductModal = () => {
    setShowProductModal(!showProductModal);
  };

  // Handle Update Product Modal Toggle
  const toggleUpdateProductModal = (product) => {
    setUpdateProduct(product);
    setShowUpdateModal(!showUpdateModal);
  };

  // Handle Delete Product
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/product/delete/${id}`, {
        method: "DELETE",
      });
      setUpdatePage(!updatePage);
      fetchProductsData();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
    fetchProductsData();
  };

  // Handle Search Input
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex flex-col p-10 w-full md:w-3/12">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {products.length}
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Last 7 days
              </span>
            </div>
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-yellow-600 text-base">
                Stores
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {stores.length}
              </span>
              <span className="font-thin text-gray-400 text-xs">Revenue</span>
            </div>
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">
                Low Stocks
              </span>
              <span className="font-semibold text-gray-600 text-base">12</span>
              <span className="font-thin text-gray-400 text-xs">Ordered</span>
            </div>
          </div>
        </div>
        {showProductModal && (
          <AddProduct
            toggleModal={toggleAddProductModal}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            productData={updateProduct}
            toggleModal={toggleUpdateProductModal}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 items-center">
              <span className="font-bold">Products</span>
              <div className="flex items-center px-2 border-2 rounded-md">
                <input
                  className="border-none outline-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={toggleAddProductModal}
            >
              Add Product
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-900">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-900">
                    Manufacturer
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-900">
                    Stock
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-900">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-900">
                    Availability
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.manufacturer}</td>
                    <td className="px-4 py-2">{product.stock}</td>
                    <td className="px-4 py-2">{product.description}</td>
                    <td className="px-4 py-2">
                      {product.stock > 0 ? "In Stock" : "Not in Stock"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => toggleUpdateProductModal(product)}
                      >
                        Edit
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
