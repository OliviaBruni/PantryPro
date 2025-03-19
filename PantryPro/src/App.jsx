import { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import PantryPage from "./pages/PantryPage";
import RecipesPage from "./pages/RecipesPage";
import "./App.css";

const App = () => {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error(new Error("Login failed:", error));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setPage("landing");
    } catch (error) {
      console.error(new Error("Logout failed:", error));
    }
  };

  return (
    <Router>
      <Navbar user={user} onLogin={login} onLogout={logout} />
      <Routes>
        <Route path="/" element={<LandingPage onLogin={login} />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
