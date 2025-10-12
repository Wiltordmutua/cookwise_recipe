import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { RecipeDetail } from "./pages/RecipeDetail";
import { CreateRecipe } from "./pages/CreateRecipe";
import { Profile } from "./pages/Profile";
import { AIRecipes } from "./pages/AIRecipes";
import { Search } from "./pages/Search";
import { Notifications } from "./components/Notifications";
import { useEffect } from "react";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/ai-recipes" element={<AIRecipes />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

function Navbar() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const createUserProfile = useMutation(api.users.createUserProfile);

  // Create user profile if it doesn't exist
  useEffect(() => {
    if (loggedInUser && !loggedInUser.profile) {
      createUserProfile();
    }
  }, [loggedInUser, createUserProfile]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-accent shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary">
              Cookwise
            </Link>
            <Authenticated>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-text hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/create" className="text-text hover:text-primary transition-colors">
                  Create Recipe
                </Link>
                <Link to="/ai-recipes" className="text-text hover:text-primary transition-colors">
                  AI Suggestions
                </Link>
                <Link to="/search" className="text-text hover:text-primary transition-colors">
                  Search
                </Link>
              </nav>
            </Authenticated>
          </div>

          <div className="flex items-center space-x-4">
            <Authenticated>
              <Notifications />
              {loggedInUser && (
                <Link 
                  to={`/profile/${loggedInUser._id}`}
                  className="flex items-center space-x-2 text-text hover:text-primary transition-colors"
                >
                  <span className="hidden sm:inline">{loggedInUser.profile?.username || "User"}</span>
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    {(loggedInUser.profile?.username || loggedInUser.name || "U")[0]?.toUpperCase()}
                  </div>
                </Link>
              )}
              <SignOutButton />
            </Authenticated>
            <Unauthenticated>
              <div className="text-primary font-medium">Sign in to get started</div>
            </Unauthenticated>
          </div>
        </div>
      </div>
    </header>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-primary mb-4">Welcome to Cookwise</h1>
        <Authenticated>
          <p className="text-xl text-text">
            Ready to cook, {loggedInUser?.profile?.username || loggedInUser?.name || "Chef"}?
          </p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-text">Sign in to start sharing recipes</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </div>
  );
}
