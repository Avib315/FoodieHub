// Updated ProtectedPage component with proper hydration check
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import useAuth from '../store/useAuth';
import useAdminAuth from '../store/useAdminAuth';
export default function ProtectedPage({ element }) {
    const allowedPaths = [
        "/home",
        "/recipe/:id", // Note: This might need to be handled differently for dynamic routes
        "/favorites",
        "/personal-area",
        "/notifications",
        "/settings",
        "/new-recipe",
        "/my-recipes",
        "/notFoundPage",
        "/loading"
    ];
    const notProtected = [
        "/login",
        "/register",
        "/signup"
    ]
    const { auth, _hasHydrated } = useAuth();
    const { adminAuth } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Function to check if current path is allowed
    const isAllowedPath = (pathname) => {
        // Handle exact matches
        if (allowedPaths.includes(pathname)) {
            return true;
        }

        // Handle dynamic routes like /recipe/:id
        if (pathname.startsWith('/recipe/') && pathname.split('/').length === 3) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        // Only redirect after Zustand has fully hydrated
        if (_hasHydrated && !auth && location.pathname === '/') {
            console.log('Redirecting to login from home');
            navigate('/login', { replace: true });
        }
    }, [auth, _hasHydrated, location.pathname, navigate]);

    // Show loading until Zustand has hydrated
    if (!_hasHydrated) {
        return <LoadingPage />;
    }

    if (!auth && location.pathname === '/') { // לא מוצא את האוטנקציה צריך לחכות עד שמסך הבית יחזיר תשובה
        return <LoadingPage />;
    }
    if (adminAuth && notProtected.includes(location.pathname)) {
        return <NotFoundPage type={2} isAdmin={true} />;
    }
    if (auth && notProtected.includes(location.pathname)) {  // מחובר . מנסה להגיע להתחברות
        return <NotFoundPage type={2} />;
    }
    if (!auth && notProtected.includes(location.pathname)) { // לא מחובר: מנסה להגיע להתחברות
        return <>{element} </>
    }
    if (adminAuth && allowedPaths.includes(location.pathname)) { // אם אדמין מחובר ורוצה להגיע לנתיב של יוזר
        return <NotFoundPage type={2} isAdmin={true} />;
    }
    if (auth && location.pathname !== '/' && !isAllowedPath(location.pathname)) { // משתמש רגיל לא יוכל להגיע למה שהוא לא בנתיבים שלו
        return <NotFoundPage type={2} />;
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