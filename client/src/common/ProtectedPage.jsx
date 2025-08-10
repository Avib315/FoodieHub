// Updated ProtectedPage component with login redirect
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import { useHydration } from "./useHydration";
import useAuth from '../store/useAuth';

export default function ProtectedPage({ element }) {
    const { auth } = useAuth();
    const isHydrated = useHydration();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is on root route and not authenticated
        if (isHydrated && !auth && location.pathname === '/') {
            navigate('/login', { replace: true });
        }
    }, [auth, isHydrated, location.pathname, navigate]);

    if (!isHydrated) {
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