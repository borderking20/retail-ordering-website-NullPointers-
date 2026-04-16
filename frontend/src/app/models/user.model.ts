export interface User {
  userId: string;
  userName: string;
  userEmail: string;
  passwordHash: string;
  role?: string;
}
