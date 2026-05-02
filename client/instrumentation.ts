export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setupAdminDatabase } = await import('@/lib/admin/setup');
    await setupAdminDatabase();
  }
}
