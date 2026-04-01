import React, { useState } from 'react';
import { Button } from '../components/common';
import { Layout } from '../components/layout';
import { RecordFilters, RecordForm, RecordTable } from '../components/records';
import { useDeleteRecord, useRecords } from '../hooks/useRecords';
import { useUIStore } from '../store/uiStore';

export const RecordsPage: React.FC = () => {
  const [rawFilters, setRawFilters] = useState({});

  const filters = Object.fromEntries(
    Object.entries(rawFilters).filter(([, value]) => value !== '')
  );

  const { data, isLoading } = useRecords(filters);
  const deleteMutation = useDeleteRecord();
  const { isRecordModalOpen, editingRecordId, openRecordModal, closeRecordModal } = useUIStore();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Financial Records</h1>
          <Button onClick={() => openRecordModal()}>Add Record</Button>
        </div>

        <RecordFilters onFilter={setRawFilters} />

        <RecordTable
          records={data?.data || []}
          isLoading={isLoading}
          onEdit={openRecordModal}
          onDelete={handleDelete}
        />

        <RecordForm
          isOpen={isRecordModalOpen}
          onClose={closeRecordModal}
          recordId={editingRecordId}
        />
      </div>
    </Layout>
  );
};
