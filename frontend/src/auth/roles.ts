export const SYSTEM_ADMIN_EMAIL = 'systemadmin@gmail.com';

export function isSystemAdmin(email: string): boolean {
  return email.toLowerCase().trim() === SYSTEM_ADMIN_EMAIL;
}
