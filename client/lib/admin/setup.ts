import { createAdminTable, seedDefaultAdmin } from '@/lib/admin/models/admin.model';
import { createSiteSettingsTable, seedDefaultSettings } from '@/lib/admin/models/settings.model';

declare global {
  // eslint-disable-next-line no-var
  var _dbInitialized: boolean | undefined;
}

export async function setupAdminDatabase(): Promise<void> {
  if (global._dbInitialized) return;
  global._dbInitialized = true;
  try {
    await createAdminTable();
    await createSiteSettingsTable();
    await seedDefaultAdmin();
    await seedDefaultSettings();
    console.log('✅ Admin database initialized');
  } catch (err) {
    console.error('❌ Admin database setup failed:', err);
  }
}
