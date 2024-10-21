"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface JwtPayload {
  exp: number;
  // Add other expected fields from your JWT payload
}

export function useAuthCheck() {
  const router = useRouter();

  const toastId = "authCheckToast";

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // No token found, redirect to login page
        router.push("/login");
        toast.info("You need to login to first.", { id: toastId });
        return;
      }

      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decodedToken.exp < currentTime) {
          // Token has expired, remove it and redirect to login
          localStorage.removeItem("token");
          router.push("/login");
          toast.info("User session expired. Please login again.", {
            id: toastId,
          });
        }
        // If we reach here, the token is valid
      } catch (error) {
        // Error decoding token, assume it's invalid
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        router.push("/login");
        toast.error("An error occurred. Please try again.", { id: toastId });
      }
    };

    checkAuth();
  }, [router]);
}
