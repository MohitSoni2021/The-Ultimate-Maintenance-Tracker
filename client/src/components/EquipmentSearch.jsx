import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEquipment } from '../store/equipmentSlice';

const EquipmentSearch = () => {
  const dispatch = useDispatch();
  const { list: equipment, loading } = useSelector((state) => state.equipment);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    category: '',
  });

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (filters.department) params.department = filters.department;
    if (filters.category) params.category = filters.category;
    dispatch(getAllEquipment(params));
  }, [searchTerm, filters, dispatch]);

  const departments = [...new Set(equipment.map((e) => e.department))];
  const categories = [...new Set(equipment.map((e) => e.category))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Equipment</h3>

        <div className="space-y-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading equipment...</div>
        ) : equipment.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No equipment found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Serial No</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Location</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Team</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.serialNo}</td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-gray-600">{item.department}</td>
                    <td className="px-4 py-3 text-gray-600">{item.location}</td>
                    <td className="px-4 py-3 text-gray-600">{item.team?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentSearch;
