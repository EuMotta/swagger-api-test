export class AuthResponseDto {
  token: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    last_name: string;
    name: string;
  };
}
