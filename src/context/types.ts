export interface User {
    email: string;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    sub: string; // Google's unique identifier
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
  }