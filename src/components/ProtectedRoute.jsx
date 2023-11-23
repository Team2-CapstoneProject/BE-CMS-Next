import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  let token;
  useEffect(() => {
    // Perform localStorage action
    token = localStorage.getItem("token");
    console.log("Token:", token);
    
    if (!token) {
      return router.push("login");
    }

  }, [])

  
  return children;
};
export default ProtectedRoute;
