import React from 'react';
import { Layout } from '../components/layout';
import { Table, Select, Spinner } from '../components/common';
import { useUsers, useUpdateUserRole, useUpdateUserStatus } from '../hooks/useUsers';
import { User } from '../services/api';
import { USER_ROLES, USER_STATUSES } from '../utils/constants';
import { formatDateTime } from '../utils';

export const AdminPage: React.FC = () => {
  const { data, isLoading } = useUsers();
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();

  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ id: userId, role });
  };

  const handleStatusChange = (userId: string, status: string) => {
    updateStatusMutation.mutate({ id: userId, status });
  };

  const columns = [
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row: User) => (
        <Select
          value={row.role}
          options={USER_ROLES}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="w-32"
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: User) => (
        <Select
          value={row.status}
          options={USER_STATUSES}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="w-32"
        />
      ),
    },
    {
      key: 'created_at',
      header: 'Created At',
      render: (row: User) => formatDateTime(row.created_at),
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>

        <div className="bg-white rounded-lg shadow-md">
          <Table data={data?.data || []} columns={columns} />
        </div>
      </div>
    </Layout>
  );
};
