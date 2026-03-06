export type UserRole = "RIDER" | "CAPTAIN" | "ADMIN";

export interface AuthClaims {
  sub: string;
  phoneNumber: string;
  role: UserRole;
  tokenType: "access" | "refresh";
}
