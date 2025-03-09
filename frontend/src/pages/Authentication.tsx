import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { UseAuth } from '../context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { User } from './types';
import Layout from '../Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const Authentication = () => {
  const { login } = UseAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<User>(credentialResponse.credential);
  
      try {
        const response = await axios.post('http://localhost:5000/api/auth/oauth/login', {
          provider: 'google',
          providerId: decoded.sub,
          email: decoded.email,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          photo: decoded.picture,
          accessToken: credentialResponse.credential
        });
  
        const { token, user } = response.data;
        login(user);
        localStorage.setItem("token", token); // Save token
        navigate('/dashboard');
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data?.message || 'Invalid email or password');
        } else {
          setError('An unexpected error occurred');
        }
      }
      
    }
  };
  
  
  const handleEmailSignIn = async (e: React.FormEvent<SignInFormElement>) => {
    e.preventDefault();
    setError('');
  
    const form = e.currentTarget;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
  
      const { token, user } = response.data;
      if (!token) {
        throw new Error("Token not received from backend");
      }
  
      login(user);
      localStorage.setItem("token", token); // Save token
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
  
  

      
      return (
      <Layout showFullMenu={false}>
    
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
                onError={() => setError('Google sign in failed')}
                theme="outline"
                size="large"
                type="standard"
                shape="rectangular"
                width="100%"
                text="signin_with"
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Sign in
                  </button>
                </form>
    
                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{' '}
                  <a href="/signup" className="font-medium text-green-600 hover:text-green-500">
                    Sign up
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </Layout>
      );
    }

export default Authentication