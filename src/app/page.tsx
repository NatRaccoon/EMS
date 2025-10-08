"use client"

import { useAuth } from "@/features/auth/context/AuthContext";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  


  if (!isAuthenticated) {
    redirect('/auth/login'); // Server-side redirect
  }
  
  redirect('/dashboard');
}

