import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Layout from '../Layout/Layout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { googleOAuthConfig } from '../config/oauthConfig';

// Add DecodedGoogleToken interface
interface DecodedGoogleToken {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
  exp: number;
  sub: string;
}

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const Authentication = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('No credentials received from Google');
      return;
    }
  
    setIsSubmitting(true);
    setError('');
    
    try {
      const decoded = jwtDecode<DecodedGoogleToken>(credentialResponse.credential);
      
      // Call login with Google user data
      await login({
        accessToken: credentialResponse.credential,
        email: decoded.email,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        picture: decoded.picture
      });
  
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google login failed:', error);
      setError(error.response?.data?.message || 'Failed to authenticate with Google');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEmailSignIn = async (e: React.FormEvent<SignInFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    const form = e.currentTarget;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
  
    try {
      // Call login with email/password data
      await login({
        email,
        password
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    //showFullMenu={false}
    <Layout >
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-gray-500">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            {/* Google Sign In Button */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError(googleOAuthConfig.handleOAuthError("Google authentication failed"));
                }}
                theme="outline"
                size="large"
                width="300" // Specify explicit width
                // height="50" // Specify explicit height
                type="standard"
                shape="rectangular"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default Authentication;