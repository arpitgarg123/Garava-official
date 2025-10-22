import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose, AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { MdInventory } from 'react-icons/md';
import { addVariantAdmin, updateVariantAdmin, updateStockAdmin } from '../../features/product/adminSlice';
import { formatCurrency } from '../../utils/pricing';

const VariantManageModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const { operationLoading, operationError } = useSelector(state => state.productAdmin);

  const [editingVariant, setEditingVariant] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStockUpdate, setShowStockUpdate] = useState(null);
  
  const [newVariant, setNewVariant] = useState({
    sku: '',
    sizeLabel: '',
    price: '',
    mrp: '',
    stock: 0,
    weight: '',
    isDefault: false,
    isActive: true
  });

  const [stockUpdate, setStockUpdate] = useState({
    variantSku: '',
    stock: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setEditingVariant(null);
      setShowAddForm(false);
      setShowStockUpdate(null);
      setNewVariant({
        sku: '',
        sizeLabel: '',
        price: '',
        mrp: '',
        stock: 0,
        weight: '',
        isDefault: false,
        isActive: true
      });
    }
  }, [isOpen]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: "out_of_stock", color: "bg-red-100 text-red-800" };
    if (stock < 10) return { status: "low_stock", color: "bg-yellow-100 text-yellow-800" };
    return { status: "in_stock", color: "bg-green-100 text-green-800" };
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    
    try {
      const variantData = {
        ...newVariant,
        price: parseFloat(newVariant.price) || 0,
        mrp: newVariant.mrp ? parseFloat(newVariant.mrp) : undefined,
        stock: parseInt(newVariant.stock) || 0,
        weight: newVariant.weight ? parseFloat(newVariant.weight) : undefined
      };

      await dispatch(addVariantAdmin({
        productId: product._id,
        variantData
      })).unwrap();

      setShowAddForm(false);
      setNewVariant({
        sku: '',
        sizeLabel: '',
        price: '',
        mrp: '',
        stock: 0,
        weight: '',
        isDefault: false,
        isActive: true
      });
    } catch (error) {
      console.error('Failed to add variant:', error);
    }
  };

  const handleEditVariant = async (e) => {
    e.preventDefault();
    
    if (!editingVariant) return;

    try {
      const variantData = {
        ...editingVariant,
        price: parseFloat(editingVariant.price) || 0,
        mrp: editingVariant.mrp ? parseFloat(editingVariant.mrp) : undefined,
        stock: parseInt(editingVariant.stock) || 0,
        weight: editingVariant.weight ? parseFloat(editingVariant.weight) : undefined
      };

      await dispatch(updateVariantAdmin({
        productId: product._id,
        variantId: editingVariant._id,
        variantData
      })).unwrap();

      setEditingVariant(null);
    } catch (error) {
      console.error('Failed to update variant:', error);
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateStockAdmin({
        productId: product._id,
        stockData: {
          variantSku: stockUpdate.variantSku,
          stock: parseInt(stockUpdate.stock) || 0
        }
      })).unwrap();

      setShowStockUpdate(null);
      setStockUpdate({ variantSku: '', stock: '' });
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const startEditVariant = (variant) => {
    setEditingVariant({ ...variant });
    setShowAddForm(false);
    setShowStockUpdate(null);
  };

  const startStockUpdate = (variant) => {
    setStockUpdate({
      variantSku: variant.sku,
      stock: variant.stock.toString()
    });
    setShowStockUpdate(variant._id);
    setEditingVariant(null);
    setShowAddForm(false);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Manage Variants</h2>
            <p className="text-[1.0625rem] text-gray-500">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Display */}
          {operationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {operationError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingVariant(null);
                setShowStockUpdate(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <AiOutlinePlus className="h-4 w-4" />
              Add New Variant
            </button>
          </div>

          {/* Add Variant Form */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Add New Variant</h3>
              
              <form onSubmit={handleAddVariant} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">SKU *</label>
                    <input
                      type="text"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Size Label *</label>
                    <input
                      type="text"
                      value={newVariant.sizeLabel}
                      onChange={(e) => setNewVariant({ ...newVariant, sizeLabel: e.target.value })}
                      required
                      placeholder="e.g., 50ml, Large"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newVariant.mrp}
                      onChange={(e) => setNewVariant({ ...newVariant, mrp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Weight (grams)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newVariant.weight}
                      onChange={(e) => setNewVariant({ ...newVariant, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newVariant.isDefault}
                      onChange={(e) => setNewVariant({ ...newVariant, isDefault: e.target.checked })}
                      className="mr-2"
                    />
                    Default Variant
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newVariant.isActive}
                      onChange={(e) => setNewVariant({ ...newVariant, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {operationLoading ? 'Adding...' : 'Add Variant'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Variant Form */}
          {editingVariant && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Edit Variant</h3>
              
              <form onSubmit={handleEditVariant} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">SKU *</label>
                    <input
                      type="text"
                      value={editingVariant.sku}
                      onChange={(e) => setEditingVariant({ ...editingVariant, sku: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Size Label *</label>
                    <input
                      type="text"
                      value={editingVariant.sizeLabel}
                      onChange={(e) => setEditingVariant({ ...editingVariant, sizeLabel: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingVariant.price}
                      onChange={(e) => setEditingVariant({ ...editingVariant, price: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingVariant.mrp || ''}
                      onChange={(e) => setEditingVariant({ ...editingVariant, mrp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={editingVariant.stock}
                      onChange={(e) => setEditingVariant({ ...editingVariant, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">Weight (grams)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingVariant.weight || ''}
                      onChange={(e) => setEditingVariant({ ...editingVariant, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingVariant.isDefault}
                      onChange={(e) => setEditingVariant({ ...editingVariant, isDefault: e.target.checked })}
                      className="mr-2"
                    />
                    Default Variant
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingVariant.isActive}
                      onChange={(e) => setEditingVariant({ ...editingVariant, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {operationLoading ? 'Updating...' : 'Update Variant'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingVariant(null)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stock Update Form */}
          {showStockUpdate && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Quick Stock Update</h3>
              
              <form onSubmit={handleStockUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={stockUpdate.variantSku}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">New Stock *</label>
                    <input
                      type="number"
                      value={stockUpdate.stock}
                      onChange={(e) => setStockUpdate({ ...stockUpdate, stock: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {operationLoading ? 'Updating...' : 'Update Stock'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStockUpdate(null)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Variants List */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Current Variants ({product.variants?.length || 0})
            </h3>
            
            {product.variants && product.variants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[1.0625rem] font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-[1.0625rem] font-medium text-gray-500 uppercase">Size</th>
                      <th className="px-4 py-3 text-left text-[1.0625rem] font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-[1.0625rem] font-medium text-gray-500 uppercase">MRP</th>
                      <th className="px-4 py-3 text-left text-[1.0625rem] font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-[1.0625rem] font-medium text-gray-500 uppercase">Weight</th>
                      <th className="px-4 py-3 text-left text-[1.0625rem] font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-[1.0625rem] font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.variants.map((variant, index) => {
                      const stockStatus = getStockStatus(variant.stock);
                      
                      return (
                        <tr key={variant._id || index} className={variant.isDefault ? 'bg-blue-50' : 'bg-white'}>
                          <td className="px-4 py-3 text-[1.0625rem] text-gray-900">
                            <div className="flex items-center">
                              {variant.sku}
                              {variant.isDefault && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-[1.0625rem] rounded font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[1.0625rem] text-gray-900">{variant.sizeLabel}</td>
                          <td className="px-4 py-3 text-[1.0625rem] text-gray-900 font-medium">{formatCurrency(variant.price)}</td>
                          <td className="px-4 py-3 text-[1.0625rem] text-gray-500">
                            {variant.mrp ? formatCurrency(variant.mrp) : '-'}
                          </td>
                          <td className="px-4 py-3 text-[1.0625rem]">
                            <span className={`px-2 py-1 rounded-full text-[1.0625rem] font-medium ${stockStatus.color}`}>
                              {variant.stock || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[1.0625rem] text-gray-900">
                            {variant.weight ? `${variant.weight}g` : '-'}
                          </td>
                          <td className="px-4 py-3 text-[1.0625rem]">
                            <span className={`px-2 py-1 rounded-full text-[1.0625rem] font-medium ${variant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {variant.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-[1.0625rem] font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEditVariant(variant)}
                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Variant"
                              >
                                <AiOutlineEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => startStockUpdate(variant)}
                                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                title="Update Stock"
                              >
                                <MdInventory className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MdInventory className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No variants found for this product.</p>
                <p className="text-[1.0625rem]">Add variants to manage inventory and pricing.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantManageModal;