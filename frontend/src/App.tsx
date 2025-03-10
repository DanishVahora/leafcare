import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import AppRoute from './Routes/AppRoute'; 
import { googleOAuthConfig } from './config/oauthConfig';

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleOAuthConfig.googleClientId}>
        <AuthProvider>
          <AppRoute />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
