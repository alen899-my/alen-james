const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const what_i_did = `Full Stack Development
Designed and developed the complete frontend and backend system. Built scalable APIs using FastAPI and Node.js. Developed responsive dashboard interfaces using Next.js and React.

Project Architecture
Created modular architecture for workshop management operations and designed real-time repair tracking systems. Structured vehicle and repair databases for efficient data management.

Frontend & User Experience
Developed modern dashboard interfaces for workshop owners, building responsive management panels for repairs, billing, and customers. Optimized the application for desktop and mobile devices.

Backend & Business Logic
Built REST APIs for workshop operations and developed secure data handling systems. Managed repair workflows and service management systems.`;

const key_features = `Repair Management
- Create digital job cards instantly
- Track repairs from intake to delivery
- Real-time repair progress monitoring
- Repair milestones & technician notes

Vehicle Records
- Maintain complete repair history
- Track previously replaced parts
- Service due reminders
- Digital maintenance logs

Customer Profiles
- CRM System for owner data
- Store multiple vehicles per customer
- Fast customer & vehicle search
- Notification & alert management

Worker Management
- Assign workers to active jobs
- Monitor workshop workload
- Track worker productivity
- Shift & assignment tracking

Bills & Invoices
- GST-ready billing system
- Labour & spare parts management
- WhatsApp invoice sharing
- Instant digital generation

Reports & Insights
- Revenue analytics & growth tracking
- Performance reports per worker
- Operational statistics dashboard
- Service period analysis

Workshop Smart Features
- Paperless repair management
- Digitized history storage
- Error reduction in workflows
- Organized service tracking

Vehicle Services
- Washing & detailing records
- Oil change & general service
- Periodic maintenance alerts
- Permanent maintenance logs

Custom Garages
- Modification project tracking
- Timeline & part documentation
- Custom build management
- Vehicle transformation logs`;

async function update() {
  try {
    await pool.query('UPDATE works SET what_i_did = $1, key_features = $2 WHERE id = 5', [what_i_did, key_features]);
    console.log('Successfully updated Repairo details');
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await pool.end();
  }
}

update();
