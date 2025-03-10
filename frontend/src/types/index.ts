export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
