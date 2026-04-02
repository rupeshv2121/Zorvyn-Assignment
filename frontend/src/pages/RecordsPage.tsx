import React, { useState } from 'react';
import { Button } from '../components/common';
import { Layout } from '../components/layout';
import { RecordFilters, RecordForm, RecordTable } from '../components/records';
import { useDeleteRecord, useRecords } from '../hooks/useRecords';
import { useUIStore } from '../store/uiStore';
import { formatCurrency } from '../utils/formatters';

export const RecordsPage: React.FC = () => {
  const [rawFilters, setRawFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const filters = Object.fromEntries(
    Object.entries(rawFilters).filter(([, value]) => value !== '')
  );

  const { data, isLoading } = useRecords({ ...filters, page: currentPage, limit: pageSize });
  const deleteMutation = useDeleteRecord();
  const { isRecordModalOpen, editingRecordId, openRecordModal, closeRecordModal } = useUIStore();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  const records = data?.data || [];
  const meta = data?.meta;
  const totalRecords = meta?.total || 0;
  const totalPages = meta?.totalPages || 0;
  const totalAmount = records.reduce((sum, record) => sum + (record.amount || 0), 0);
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Financial Records</h1>
          <Button onClick={() => openRecordModal()}>Add Record</Button>
        </div>

        <RecordFilters onFilter={setRawFilters} />

        {/* Summary Stats Bar */}
        {records.length > 0 && (
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <div className="px-3 py-1 bg-primary-500 text-white text-sm rounded-full">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                </div>
              )}
            </div>
          </div>
        )}

        {records.length > 0 ? (
          <>
            <RecordTable
              records={records}
              isLoading={isLoading}
              onEdit={openRecordModal}
              onDelete={handleDelete}
            />

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-white p-4 border border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex}</span> to{' '}
                <span className="font-semibold">{endIndex}</span> of{' '}
                <span className="font-semibold">{totalRecords}</span> records
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || totalRecords === 0}
                  className="px-4 py-2 text-sm"
                >
                  ← Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = totalPages > 5 ? currentPage - 2 + i : i + 1;
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm rounded ${
                          currentPage === pageNum
                            ? 'bg-primary-500 text-white font-semibold'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2 text-gray-400">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalRecords === 0}
                  className="px-4 py-2 text-sm"
                >
                  Next →
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <p className="mb-4 text-lg text-gray-600">
              {activeFiltersCount > 0
                ? 'No records match your filters. Try adjusting your search criteria.'
                : 'No financial records yet. Start by adding your first record.'}
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="secondary" onClick={() => setRawFilters({})}>
                Clear Filters
              </Button>
            )}
          </div>
        )}

        <RecordForm
          isOpen={isRecordModalOpen}
          onClose={closeRecordModal}
          recordId={editingRecordId}
        />
      </div>
    </Layout>
  );
};
