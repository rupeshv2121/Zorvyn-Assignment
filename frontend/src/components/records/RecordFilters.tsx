import React, { useState } from 'react';
import { Input, Select, Button } from '../common';
import { CATEGORIES, RECORD_TYPES } from '../../utils/constants';

interface FilterState {
  type: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}

interface RecordFiltersProps {
  onFilter: (filters: FilterState) => void;
}

export const RecordFilters: React.FC<RecordFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = { type: '', category: '', dateFrom: '', dateTo: '' };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={RECORD_TYPES}
          label="Type"
        />
        <Select
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          label="Category"
        />
        <Input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleChange}
          label="From Date"
        />
        <Input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleChange}
          label="To Date"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="submit">Apply Filters</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
};
