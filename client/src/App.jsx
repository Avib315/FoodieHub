import './App.scss'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthPageLayout from './page/AuthPageLayout/AuthPageLayout.jsx'

// Main Pages
import RecipesPage from './page/RecipesPage/index.jsx'
import PersonalAreaPage from './page/PersonalAreaPage/index.jsx'
import NotificationPage from './page/NotificationPage/index.jsx'
import SettingPage from './page/SettingPage/index.jsx'
import NewRecipePage from './page/NewRecipePage/index.jsx'

// Auth Pages
import LoginPage from './page/LoginPage/index.jsx'
import SignupPage from './page/SignupPage/index.jsx'

import RecipeDetailPage from './page/RecipeDetailPage/index.jsx'
import AboutPage from './page/AboutPage/index.jsx'
import ForgotPasswordPage from './page/ForgotPasswordPage/index.jsx'
import NotFoundPage from './page/NotFoundPage/index.jsx'
import LoadingPage from './page/LoadingPage/index.jsx'
import DevPage from './page/DevPage/index.jsx'
import ProtectedPage from './common/ProtectedPage.jsx'
import SavedRecipesPage from './page/SavedRecipesPage/index.jsx'
import CoralSwaggerAPITester from './playgound/coral/coral.jsx'
import PninaSwaggerAPITester from './playgound/pnina/pnina.jsx'
import AdminLogin from './adminPages/AdmnLogin/index.jsx'
import AdminPage from './adminPages/AdminPage/index.jsx'
import RecipesPanel from './adminPages/RecipesPanel/index.jsx'
import UserPanel from './adminPages/UsersPanel/index.jsx'

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/dev" element={

          <DevPage />
        } />
        {/* Auth Pages - No NavBar */}
        <Route path="/login" element={
          <AuthPageLayout>
            <LoginPage />
          </AuthPageLayout>
        } />

        <Route path="/signup" element={
          <AuthPageLayout>
            <SignupPage />
          </AuthPageLayout>
        } />

        <Route path="/register" element={
          <AuthPageLayout>
            <SignupPage />
          </AuthPageLayout>
        } />

        <Route path="/forgot-password" element={
          <AuthPageLayout>
            <ForgotPasswordPage />
          </AuthPageLayout>
        } />

        <Route path="/" element={
          <ProtectedPage element={<RecipesPage />} />
        } />


        <Route path="/recipe/:id" element={
          <ProtectedPage element={<RecipeDetailPage />} />

        } />
        <Route path="/favorites" element={

          <ProtectedPage element={<SavedRecipesPage />} />
        } />
        <Route path="/personal-area" element={
          <ProtectedPage element={<PersonalAreaPage />} />
        } />

        <Route path="/notifications" element={
          <ProtectedPage element={<NotificationPage />} />

        } />

        <Route path="/settings" element={
          <ProtectedPage element={<SettingPage />} />

        } />

        {/* Content Creation */}
        <Route path="/new-recipe" element={
          <ProtectedPage element={<NewRecipePage />} />
        } />

        <Route path="/edit-recipe/:id" element={
          <ProtectedPage element={<NewRecipePage />} />

        } />


        {/* Static/Info Pages */}
        <Route path="/about" element={
          <AuthPageLayout>
            <AboutPage />
          </AuthPageLayout>
        } />

        <Route path="/coral" element={
          <CoralSwaggerAPITester />
        } />


        <Route path="/pnina" element={
          <PninaSwaggerAPITester />
        } />

          <Route path="/admin-login" element={
          <AdminLogin />
        } />
          <Route path="/admin-panel" element={
          <AdminPage />
        } />
          <Route path="/admin-recipe-panel" element={
          <RecipesPanel />
        } />
          <Route path="/admin-users-panel" element={
          <UserPanel />
        } />
        {/* Utility Routes */}
        <Route path="/loading" element={<LoadingPage />} />

        {/* Redirects */}
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Navigate to="/signup" replace />} />

        {/* 404 - Must be last */}
        <Route path="*" element={
          <AuthPageLayout>
            <NotFoundPage />
          </AuthPageLayout>
        } />
      </Routes>
    </Router>
  )
}

export default App