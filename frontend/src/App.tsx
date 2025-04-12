import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import AppRoute from './Routes/AppRoute'; 
import { googleOAuthConfig } from './config/oauthConfig';
import { DetectionProvider } from './context/DetectionContext';
function App() {
  return (
    <AuthProvider>
      <DetectionProvider>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={googleOAuthConfig.googleClientId}>
            <AppRoute />
          </GoogleOAuthProvider>
        </BrowserRouter>
      </DetectionProvider>
    </AuthProvider>
  );
}

export default App;
