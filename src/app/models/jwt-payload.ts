export interface JwtPayload {
  id: string;
  email: string;
  exp: number;
  iat: number;
  jti: string;
  nbf: number;
  role: string;
}
