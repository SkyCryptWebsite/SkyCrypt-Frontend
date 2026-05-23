export enum UserRole {
  User = "user",
  Admin = "admin"
}

export const roles = [
  { value: UserRole.Admin, label: "Admin" },
  { value: UserRole.User, label: "User" }
] satisfies { value: UserRole; label: string }[];
