// src/components/AuthCallback.js
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/home');
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return <div>Loading...</div>;
};

export default AuthCallback;