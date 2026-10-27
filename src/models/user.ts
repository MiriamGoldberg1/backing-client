export type Role = "admin" | "customer"

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string | null;
  role: Role;
  createdAt: string;
}
