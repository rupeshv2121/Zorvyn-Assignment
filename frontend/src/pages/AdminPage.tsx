import React from 'react';
import { Select, Spinner, Table } from '../components/common';
import { Layout } from '../components/layout';
import { useUpdateUserRole, useUpdateUserStatus, useUsers } from '../hooks/useUsers';
import { User } from '../services/api';
import { formatDateTime } from '../utils';
import { USER_ROLES, USER_STATUSES } from '../utils/constants';

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

  const users = data?.data || [];
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const analystCount = users.filter(u => u.role === 'analyst').length;
  const viewerCount = users.filter(u => u.role === 'viewer').length;
  const activeCount = users.filter(u => u.status === 'active').length;

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

        {/* Admin Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-primary-500">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Admins</p>
            <p className="text-3xl font-bold text-gray-900">{adminCount}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Analysts</p>
            <p className="text-3xl font-bold text-gray-900">{analystCount}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-gray-500">
            <p className="text-sm text-gray-600">Viewers</p>
            <p className="text-3xl font-bold text-gray-900">{viewerCount}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
          </div>
        </div>

        {/* Users Table */}
        {users.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            <Table data={users} columns={columns} />
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-600">
              No users found. Start by inviting team members to your organization.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
