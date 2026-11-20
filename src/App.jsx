import { useContext } from 'react';
import { ThemeContext } from "./context/ThemeContext";
import { UserContext } from "./context/userContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Footer from './components/Footer.jsx';
import Auth from './components/Auth';
import Hooks from './pages/Hooks.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import EditPage from './pages/EditPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import Tutorial from './pages/Tutorial.jsx';
import About from './pages/About.jsx';
import Chatbot from './chatbot.jsx'; // ✅ Floating chatbot
import QuizBot  from './quizbot.jsx';
import { sampleArticles } from './data/sampleData'; // Import your articles

// Wrapper for Theme + User Context
// PrivateRoute (protects routes if no user logged in)
function PrivateRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div role="status" style={{ padding: "2rem", textAlign: "center" }}>Checking your session...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Router>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Auth />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/article/:slug"
            element={
              <PrivateRoute>
                <ArticlePage articles={sampleArticles} />
              </PrivateRoute>
            }
          />

          <Route
            path="/articles/:id"
            element={
              <PrivateRoute>
                <ArticlePage articles={sampleArticles} />
              </PrivateRoute>
            }
          />

          <Route
            path="/articles/:id/edit"
            element={
              <PrivateRoute>
                <EditPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/category/hooks"
            element={
              <PrivateRoute>
                <Hooks />
              </PrivateRoute>
            }
          />

          <Route
            path="/category/:category"
            element={
              <PrivateRoute>
                <CategoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/tutorials"
            element={
              <PrivateRoute>
                <Tutorial />
              </PrivateRoute>
            }
          />

          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* ✅ Floating Chatbot Button (visible on all pages) */}
        <Chatbot />

        <QuizBot />


        <Footer />
      </Router>
    </div>
  );
}

export default App;
