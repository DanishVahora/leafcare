import React from 'react'
import { Leaf, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
// import { Button } from '@/components/ui/button';
import { Separator } from '../components/ui/separator';
import { UseAuth } from '../context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { User } from './types';

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }
  
  interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }

  
const Authentication = () => {
    const { login } = UseAuth();
  
    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
      if (credentialResponse.credential) {
        const decoded = jwtDecode<User>(credentialResponse.credential);
        login(decoded);
        // You can also send this token to your backend for verification
        console.log('Google Sign In Success:', decoded);
      }
    };
  
    const handleGoogleError = () => {
      console.error('Google Sign In Failed');
    };

    const handleEmailSignIn = async (e: React.FormEvent<SignInFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = form.elements.email.value;
        const password = form.elements.password.value;
        // Implement your email sign in logic here
      };

      
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100/50 to-white flex flex-col">
          {/* Navigation */}
          <nav className="border-b bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-green-800">PlantCare</span>
              </div>
            </div>
          </nav>
    
          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1 text-center">
                <button 
                  onClick={() => window.history.back()} 
                  className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                <p className="text-sm text-gray-500">
                  Sign in to your account to continue
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Sign In Button */}
                <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
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
                  <a href="#" className="font-medium text-green-600 hover:text-green-500">
                    Sign up
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

export default Authentication