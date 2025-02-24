import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

const ApplicationForm = ({ initialData, onSubmit, isLoading }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-4xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        First Name
                    </label>
                    <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    />
                    {errors.firstName && (
                        <p className="text-sm text-red-500 dark:text-red-400">{errors.firstName.message}</p>
                    )}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Last Name
                    </label>
                    <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    />
                    {errors.lastName && (
                        <p className="text-sm text-red-500 dark:text-red-400">{errors.lastName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-200"
                        disabled={true}
                    />
                </div>

                {/* CIN */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        CIN
                    </label>
                    <input
                        type="text"
                        {...register('cin', {
                            required: 'CIN is required',
                            pattern: {
                                value:/^[a-zA-Z]{1,2}([0-9]{1,6})$/  ,
                                message: 'Invalid CIN',
                            }
                        })}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    />
                    {errors.cin && (
                        <p className="text-sm text-red-500 dark:text-red-400">{errors.cin.message}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        {...register('phoneNumber', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Invalid phone number format',
                            },
                        })}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    />
                    {errors.phoneNumber && (
                        <p className="text-sm text-red-500 dark:text-red-400">{errors.phoneNumber.message}</p>
                    )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Address
                    </label>
                    <textarea
                        {...register('address', { required: 'Address is required' })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-colors duration-200"
                    />
                    {errors.address && (
                        <p className="text-sm text-red-500 dark:text-red-400">{errors.address.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                </button>
            </div>
        </form>
    );
};

export default ApplicationForm;