import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setSales] = useState([]); // Renamed for clarity
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [loading, setLoading] = useState(true); // Added loading state
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSalesData();
        await fetchProductsData();
        await fetchStoresData();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    
    fetchData();

    // Cleanup function to avoid setting state on unmounted component
    return () => {
      setSales([]); // Clean up the state if needed
      setProducts([]);
      setStores([]);
    };
  }, [updatePage]);

  // Fetching Data of All Sales
  const fetchSalesData = async () => {
    const response = await fetch(`http://localhost:4000/api/sales/get/${authContext.user}`);
    if (!response.ok) throw new Error('Failed to fetch sales data');
    const data = await response.json();
    setSales(data);
  };

  // Fetching Data of All Products
  const fetchProductsData = async () => {
    const response = await fetch(`http://localhost:4000/api/products/get/${authContext.user}`);
    if (!response.ok) throw new Error('Failed to fetch products data');
    const data = await response.json();
    setProducts(data);
  };

  // Fetching Data of All Stores
  const fetchStoresData = async () => {
    const response = await fetch(`http://localhost:4000/api/stores/get/${authContext.user}`);
    if (!response.ok) throw new Error('Failed to fetch stores data');
    const data = await response.json();
    setStores(data);
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  if (loading) {
    return <div className="flex justify-center">Loading...</div>; // Loading state
  }

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addSaleModalSetting}
              >
                Add Sales
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Store Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Sale Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sales.map((element) => {
                return (
                  <tr key={element.id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {element.product_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.store_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock_sold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.sales_date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ${element.total_sale_amount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
