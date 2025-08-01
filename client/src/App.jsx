import './App.scss'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthPageLayout from './page/AuthPageLayout/AuthPageLayout.jsx'

// Main Pages
import RecipesPage from './page/RecipesPage/index.jsx'
import PersonalAreaPage from './page/PersonalAreaPage/index.jsx'
import NotificationPage from './page/NotificationPage/index.jsx'
import SettingPage from './page/SettingPage/index.jsx'
import NewRecipePage from './page/NewRecipePage/index.jsx'
import ListViewPage from './page/ListViewPage/index.jsx'
import ListCreationPage from './page/ListCreationPage/index.jsx'

// Auth Pages
import LoginPage from './page/LoginPage/index.jsx'
import SignupPage from './page/SignupPage/index.jsx'

// Additional Common Pages
// import HomePage from './page/HomePage/index.jsx'
import RecipeDetailPage from './page/RecipeDetailPage/index.jsx'
// import SearchPage from './page/SearchPage/index.jsx'
// import CategoryPage from './page/CategoryPage/index.jsx'
// import ProfilePage from './page/ProfilePage/index.jsx'
import FavoritesPage from './page/FavoritesPage/index.jsx'
import AboutPage from './page/AboutPage/index.jsx'
// import ContactPage from './page/ContactPage/index.jsx'
// import TermsPage from './page/TermsPage/index.jsx'
// import PrivacyPage from './page/PrivacyPage/index.jsx'
import ForgotPasswordPage from './page/ForgotPasswordPage/index.jsx'
// import ResetPasswordPage from './page/ResetPasswordPage/index.jsx'
import NotFoundPage from './page/NotFoundPage/index.jsx'
import LoadingPage from './page/LoadingPage/index.jsx'
import DevPage from './page/DevPage/index.jsx'

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

        {/* <Route path="/reset-password" element={
          <AuthPageLayout>
            <ResetPasswordPage />
          </AuthPageLayout>
        } /> */}

        {/* Main App Pages - With NavBar */}
        {/* <Route path="/" element={
          <AuthPageLayout>
            <HomePage />
          </AuthPageLayout>
        } />
         */}
        {/* <Route path="/home" element={
          <AuthPageLayout>
            <HomePage />
          </AuthPageLayout>
        } /> */}

        <Route path="/recipes" element={
          <AuthPageLayout>
            <RecipesPage />
          </AuthPageLayout>
        } />

        <Route path="/recipe/:id" element={
          <AuthPageLayout>
            <RecipeDetailPage />
          </AuthPageLayout>
        } />



        <Route path="/favorites" element={
          <AuthPageLayout>
            <FavoritesPage />
          </AuthPageLayout>
        } />



        <Route path="/personal-area" element={
          <AuthPageLayout>
            <PersonalAreaPage />
          </AuthPageLayout>
        } />

        <Route path="/notifications" element={
          <AuthPageLayout>
            <NotificationPage />
          </AuthPageLayout>
        } />

        <Route path="/settings" element={
          <AuthPageLayout>
            <SettingPage />
          </AuthPageLayout>
        } />

        {/* Content Creation */}
        <Route path="/new-recipe" element={
          <AuthPageLayout>
            <NewRecipePage />
          </AuthPageLayout>
        } />

        <Route path="/edit-recipe/:id" element={
          <AuthPageLayout>
            <NewRecipePage />
          </AuthPageLayout>
        } />

        {/* Shopping Lists */}
        <Route path="/shopping-list" element={
          <AuthPageLayout>
            <ListViewPage />
          </AuthPageLayout>
        } />

        <Route path="/shopping-lists" element={
          <AuthPageLayout>
            <ListViewPage />
          </AuthPageLayout>
        } />

        <Route path="/create-list" element={
          <AuthPageLayout>
            <ListCreationPage />
          </AuthPageLayout>
        } />

        <Route path="/edit-list/:id" element={
          <AuthPageLayout>
            <ListCreationPage />
          </AuthPageLayout>
        } />

        {/* Static/Info Pages */}
        <Route path="/about" element={
          <AuthPageLayout>
            <AboutPage />
          </AuthPageLayout>
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