export class UserDto {
  id: string;
  last_name: string;
  name: string;
  image: string;
  email: string;
  is_active?: boolean;
  is_banned?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  password: string;
}

export interface CreateUserResponse {
  id: string;
  last_name: string;
  name: string;
  email: string;
}
