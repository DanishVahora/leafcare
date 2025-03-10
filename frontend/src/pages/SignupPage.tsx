import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Layout from '../Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/config/config';

interface FormElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  confirmPassword: HTMLInputElement;
}

interface SignUpFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

// Define proper types for the decoded JWT token
interface DecodedGoogleToken {
  sub: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  // Add other fields as needed
}

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<DecodedGoogleToken>(credentialResponse.credential);

      try {
        // Send Google OAuth data to backend using the API_BASE_URL
        const response = await axios.post(`${API_BASE_URL}/auth/oauth/login`, {
          provider: 'google',
          providerId: decoded.sub,
          email: decoded.email,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          photo: decoded.picture,
          accessToken: credentialResponse.credential
        });

        // Handle successful login
        const { token, user } = response.data;
        login(user);
        localStorage.setItem("token", token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Google OAuth login failed:', error);
        setError('Failed to authenticate with Google');
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign Up Failed');
  };

  const handleEmailSignUp = async (e: React.FormEvent<SignUpFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      email: form.elements.email.value,
      password: form.elements.password.value,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, formData);

      if (response.status === 201) {
        // Assuming the backend returns user details & token after signup
        const { user, token } = response.data;

        // Store the token (optional: in localStorage for persistence)
        login(user);
        localStorage.setItem("token", token);

        console.log('Signup successful, user logged in:', user);
        navigate('/dashboard');
      }
    } catch (err) {
      const error = err as Error | { response?: { data?: string } };
      setError('Signup failed');
      if ('response' in error && error.response?.data) {
        console.error('Signup failed:', error.response.data);
      } else if (error instanceof Error) {
        console.error('Signup failed:', error.message);
      } else {
        console.error('Signup failed:', error);
      }
    }
  };

  return (
    <Layout showFullMenu={false}>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">

            <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
            <p className="text-sm text-gray-500">
              Get started with PlantCare
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                type="standard"
                shape="rectangular"
                width="100%"
                text="signup_with"
                useOneTap
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

            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}