export interface SResponse<T> {
  data: T | null;
  message: string;
  status: number;
  error: string | null | Object;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "SUPERADMIN"|"USER";
  cabang: number | null;
  name: string;
}

export interface AuthRes {
  token: Token;
  user: User;
}
