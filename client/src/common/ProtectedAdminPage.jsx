// Updated ProtectedAdminPage component
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import useAdminAuth from '../store/useAdminAuth';
import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from "../store/useAuth";

export default function ProtectedAdminPage({ element }) {
    const allowedPaths = [
        "/admin-panel",
        "/admin-recipe-panel",
        "/admin-users-panel",
        "/loading"
    ];
    const notProtected = [
        "/admin-login",
    ];

    const { auth } = useAuth()
    const { adminAuth, _hasHydrated } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only redirect after Zustand has fully hydrated
        if (_hasHydrated && !adminAuth && location.pathname === '/admin') {
            navigate('/admin-login', { replace: true });
        }
    }, [adminAuth, _hasHydrated, location.pathname, navigate]);

    if (!_hasHydrated) {
        return <LoadingPage />;
    }

    if (adminAuth && notProtected.includes(location.pathname)) {  // מחובר . מנסה להגיע להתחברות
        return <NotFoundPage type={2} isAdmin={true} />;
    }
    if (!auth && !adminAuth && notProtected.includes(location.pathname)) { // לא מחובר: מנסה להגיע להתחברות
        return <>{element} </>
    }
    if (auth && !adminAuth && notProtected.includes(location.pathname)) {
        return <NotFoundPage type={2} />;
    }
    if (auth && notProtected.includes(location.pathname)) { //יוזר שמחובר ומנסה להגיע ללוגין אדמין
        return <NotFoundPage type={2} />;
    }
    if (auth && allowedPaths.includes(location.pathname)) {
        return <NotFoundPage type={2} />;
    }
    if (adminAuth && !allowedPaths.includes(location.pathname)) { // אדמין שמנסה לגשת למסלול של יוזר
        return <NotFoundPage type={2} />;
    }

    return (
        <>
            {adminAuth ? (
                <>
                    {element}
                </>
            ) : (
                <NotFoundPage type={1} />
            )}
        </>
    );
}