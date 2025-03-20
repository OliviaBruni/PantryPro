import { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import PantryPage from "./pages/PantryPage";
import RecipesPage from "./pages/RecipesPage";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log("👤 Firebase Auth State Changed:", currentUser);
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        setError("Firebase Authentication Error: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }

    if (loading) {
      return <div>Loading...</div>;
    }
  };

  return (
    <Router>
      <Navbar user={user} onLogin={login} onLogout={logout} />
      <Routes>
        <Route path="/" element={<LandingPage onLogin={login} />} />
        <Route path="/pantry" element={<PantryPage user={user} />} />
        <Route path="/recipes" element={<RecipesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
