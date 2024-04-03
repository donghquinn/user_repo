export interface UserInfo {
  user_id: string;
  user_type: string;
  user_email?: string;
  user_password?: string;
}

export interface UserSession {
  session_id: string;
}

export interface UserTableData {
  user_id: string;
  user_name: string;
  user_email: string;
  user_password?: string;
  user_status?: string;
  user_type?: number;
  reg_date?: Date;
}
