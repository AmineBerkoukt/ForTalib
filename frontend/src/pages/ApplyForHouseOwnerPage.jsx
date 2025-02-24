import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from '../store/useAuthStore';
import ApplicationForm from '../components/houseowner/ApplicationForm';
import {useRequestStore} from '../store/useRequestStore';
import Layout from '../components/Layout.jsx'
import {useTheme} from "../contexts/ThemeContext.jsx";
import {Toaster} from "react-hot-toast";
import {useUserStore} from "../store/useUserStore.js";

const ApplyForHouseOwnerPage = () => {
    const navigate = useNavigate();
    const {authUser} = useAuthStore();
    const {createRequest, isLoading} = useRequestStore();
    const {updateProfile } = useUserStore();

    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        cin: '',
        phoneNumber: '',
        address: '',
    });

    useEffect(() => {
        if (authUser) {
            setFormData(prev => ({
                ...prev,
                firstName: authUser.firstName || '',
                lastName: authUser.lastName || '',
                email: authUser.email || '',
                cin: authUser.cin || '',
                phoneNumber: authUser.phoneNumber || '',
                address: authUser.address || '',
            }));
        }
    }, [authUser]);

    const handleSubmit = async (data) => {
        try {
            await updateProfile();
            await createRequest();
            //navigate('/');
        } catch (error) {
            console.error('Failed to submit application:', error);
        }
    };

    return (
        <Layout isDarkMode={isDarkMode}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
                <div className="w-11/12 mx-auto px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Apply for House Owner
                        </h1>
                        <ApplicationForm
                            initialData={formData}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ApplyForHouseOwnerPage;