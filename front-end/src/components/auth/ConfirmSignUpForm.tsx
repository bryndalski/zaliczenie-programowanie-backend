'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hash, AlertCircle, Mail, CheckCircle } from 'lucide-react';
import { confirmSignUpSchema, ConfirmSignUpFormData } from '@/lib/validation';
import { useAuthActions } from '@/hooks/useAuthActions';

interface ConfirmSignUpFormProps {
  email?: string;
  onSuccess?: () => void;
}

export default function ConfirmSignUpForm({ email, onSuccess }: ConfirmSignUpFormProps) {
  const { handleConfirmSignUp, loading, error, clearError } = useAuthActions();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmSignUpFormData>({
    resolver: zodResolver(confirmSignUpSchema),
    defaultValues: {
      email: email || '',
    },
  });

  const onSubmit = async (data: ConfirmSignUpFormData) => {
    clearError();
    const success = await handleConfirmSignUp(data.email, data.code);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-600 mt-2">
            We've sent a verification code to {email || 'your email'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Verification failed</p>
              <p>{error.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!email && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('code')}
                type="text"
                maxLength={6}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                placeholder="000000"
              />
            </div>
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading || isSubmitting ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Resend Code
            </button>
          </p>

          <Link
            href="/auth/register"
            className="block text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Use different email
          </Link>
        </div>
      </div>
    </div>
  );
}
