
import { AuthProvider } from "./context/AuthContext"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { useTheme } from 'next-themes'
import AppRoute from "./Routes/AppRoute"
import './index.css'

function App() {
  useTheme()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
          <AppRoute/>
     </GoogleOAuthProvider>
    </AuthProvider>
  )
}

export default App
