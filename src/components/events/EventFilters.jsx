import { useState } from 'react';
import { EVENT_CATEGORIES, EVENT_TYPES } from '../utils/constants';

const EventFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All'
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="event-filters">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-group">
        <label>Category:</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="All">All Categories</option>
          {EVENT_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label>Type:</label>
        <select
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="All">All Types</option>
          {EVENT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventFilters;
