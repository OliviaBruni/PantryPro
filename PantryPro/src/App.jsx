import { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
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
    <div className="container">
      <Navbar user={user} onLogin={login} onLogout={logout} />
      {page === "landing" && (
        <LandingPage onNavigate={() => setPage("pantry")} />
      )}
      {page === "pantry" && (
        <PantryPage onNavigate={() => setPage("recipes")} />
      )}
      {page === "recipes" && (
        <RecipesPage onNavigate={() => setPage("pantry")} />
      )}
    </div>
  );
};

export default App;
