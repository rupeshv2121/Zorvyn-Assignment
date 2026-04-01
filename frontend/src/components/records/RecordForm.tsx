import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateRecord, useRecord, useUpdateRecord } from '../../hooks/useRecords';
import { CreateRecordRequest } from '../../services/api';
import { CATEGORIES, RECORD_TYPES } from '../../utils/constants';
import { Button, Input, Modal, Select } from '../common';

interface RecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  recordId?: string | null;
}

export const RecordForm: React.FC<RecordFormProps> = ({ isOpen, onClose, recordId }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateRecordRequest>();
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const { data: record } = useRecord(recordId || '');

  useEffect(() => {
    if (record) {
      setValue('amount', record.amount);
      setValue('type', record.type);
      setValue('category', record.category);
      setValue('date', record.date.split('T')[0]);
      setValue('notes', record.notes || '');
    } else {
      reset();
    }
  }, [record, setValue, reset]);

  const onSubmit = (data: CreateRecordRequest) => {
    if (recordId) {
      updateMutation.mutate({ id: recordId, data }, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recordId ? 'Edit Record' : 'Add Record'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Amount"
          type="number"
          step="0.01"
          {...register('amount', { required: 'Amount is required', min: 0.01, valueAsNumber: true })}
          error={errors.amount?.message}
        />
        <Select
          label="Type"
          options={RECORD_TYPES}
          {...register('type', { required: 'Type is required' })}
          error={errors.type?.message}
        />
        <Select
          label="Category"
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          {...register('category', { required: 'Category is required' })}
          error={errors.category?.message}
        />
        <Input
          label="Date"
          type="date"
          {...register('date', { required: 'Date is required' })}
          error={errors.date?.message}
        />
        <Input label="Notes" {...register('notes')} />
        <div className="flex gap-2 mt-6">
          <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
            {recordId ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
