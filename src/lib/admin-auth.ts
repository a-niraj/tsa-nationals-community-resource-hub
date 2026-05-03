const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export function checkAdminPassword(provided: string | null | undefined): boolean {
  if (!ADMIN_PASSWORD) return false
  return provided === ADMIN_PASSWORD
}
