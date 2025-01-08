import Authentication from "./pages/Authentication"
import HomePage from "./pages/HomePage"
import { Routes,Route } from "react-router-dom"
import SignupPage from "./pages/SingupPage"
import { AuthProvider } from "./context/AuthContext"
import { GoogleOAuthProvider } from "@react-oauth/google"
function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Authentication />}/>
        <Route path="/signup" element={<SignupPage />}/>
     </Routes>
     </GoogleOAuthProvider>
    </AuthProvider>
  )
}

export default App
