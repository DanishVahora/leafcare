export interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: string | number | boolean | null | undefined; // Add other properties as required
  }
  