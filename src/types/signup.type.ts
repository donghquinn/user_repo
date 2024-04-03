export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  adminCode: string;
}

export interface UserCountResult {
  count: string;
}
