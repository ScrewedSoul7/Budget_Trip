"use client";
import { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../backend/firebase";
import Link from "next/link"; 

const LoginButton = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return user ? (
    <div className="relative">
      {/* User Button Styled to Match Navbar */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="font-bold hover:bg-[#008B9E] px-4 h-20 flex items-center justify-center transition"
      >
        Hello, {user.displayName.split(" ")[0]}
      </button>

      {/* Dropdown Menu (Now Perfectly Aligned Below Navbar) */}
      {dropdownOpen && (
        <div className="absolute left-0 w-48 bg-cyan-400 border border-cyan-500 text-[#1E3A5F] rounded-md shadow-lg ">
          <Link href="/itinerary" className="block px-4 py-2 hover:bg-cyan-300 transition">
            My Itinerary
          </Link>
          <button
            className="block px-4 py-2 text-left w-full text-red-600 hover:bg-red-300 transition"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={signInWithGoogle}
      className="font-bold hover:bg-[#008B9E] px-4 h-20 flex items-center justify-center transition"
    >
      Sign In
    </button>
  );
};

export default LoginButton;