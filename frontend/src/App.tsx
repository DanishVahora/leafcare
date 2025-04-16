import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import AppRoute from './Routes/AppRoute'; 
import { googleOAuthConfig } from './config/oauthConfig';
import { DetectionProvider } from './context/DetectionContext';
import { ScrollProvider } from './components/ScrollProvider'

function App() {
  return (
    <ScrollProvider>
      <AuthProvider>
        <DetectionProvider>
          <BrowserRouter>
            <GoogleOAuthProvider clientId={googleOAuthConfig.googleClientId}>
              <AppRoute />
            </GoogleOAuthProvider>
          </BrowserRouter>
        </DetectionProvider>
      </AuthProvider>
    </ScrollProvider>
  );
}

export default App;
