"use client";

import { useState } from "react";
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';

export default function Home() {
  return (
    <main>
      <LoginForm />
      <SignupForm />
    </main>
  );
}

// Tailwind CSS animations can be added in a global CSS file
