import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Card } from '../components/common';
import { useLogin, useRegister } from '../hooks/useAuth';
import { LoginRequest, RegisterRequest } from '../services/api';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest | RegisterRequest>();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const onSubmit = (data: LoginRequest | RegisterRequest) => {
    if (isRegister) {
      registerMutation.mutate(data as RegisterRequest);
    } else {
      loginMutation.mutate(data as LoginRequest);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={loginMutation.isPending || registerMutation.isPending}
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            {isRegister
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
          <p className="font-semibold mb-2">Test Credentials:</p>
          <p>Admin: admin@example.com / password123</p>
          <p>Analyst: analyst@example.com / password123</p>
          <p>Viewer: viewer@example.com / password123</p>
        </div>
      </Card>
    </div>
  );
};
