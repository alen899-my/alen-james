import { createAdminTable, seedDefaultAdmin } from '@/lib/admin/models/admin.model';
import { createSiteSettingsTable, seedDefaultSettings } from '@/lib/admin/models/settings.model';
import { createWorksTable } from '@/lib/admin/models/works.model';
import { createEducationTable } from '@/lib/admin/models/education.model';
import { createSkillsTable } from '@/lib/admin/models/skills.model';
import { createDiariesTable } from '@/lib/admin/models/diaries.model';
import { createBlogsTable } from '@/lib/admin/models/blogs.model';
import { createSocialLinksTable } from '@/lib/admin/models/social_links.model';
import { createPeopleTable } from '@/lib/admin/models/people.model';
import { createTravelsTable } from '@/lib/admin/models/travels.model';
import { createRegretsTable } from '@/lib/admin/models/regrets.model';
import { createExperiencesTable } from '@/lib/admin/models/experiences.model';

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
    await createWorksTable();
    await createEducationTable();
    await createSkillsTable();
    await createDiariesTable();
    await createBlogsTable();
    await createSocialLinksTable();
    await createPeopleTable();
    await createTravelsTable();
    await createRegretsTable();
    await createExperiencesTable();
    await seedDefaultAdmin();
    await seedDefaultSettings();
    console.log('✅ Admin database initialized');
  } catch (err) {
    console.error('❌ Admin database setup failed:', err);
  }
}
