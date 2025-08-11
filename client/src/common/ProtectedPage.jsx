// Updated ProtectedPage component with proper hydration check
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import useAuth from '../store/useAuth';

export default function ProtectedPage({ element }) {
    const { auth, _hasHydrated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only redirect after Zustand has fully hydrated
        if (_hasHydrated && !auth && location.pathname === '/') {
            navigate('/login', { replace: true });
        }
    }, [auth, _hasHydrated, location.pathname, navigate]);

    // Show loading until Zustand has hydrated
    if (!_hasHydrated) {
        return <LoadingPage />;
    }

    // If on root route and not authenticated, show loading while redirecting
    if (!auth && location.pathname === '/') {
        return <LoadingPage />;
    }

    return (
        <>
            {auth ? (
                <>
                    {element}
                    <NavBar />
                </>
            ) : (
                <NotFoundPage type={1} />
            )}
        </>
    );
}