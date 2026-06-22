import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import { Customer } from './models/Customer.js';
import { User } from './models/User.js';

dotenv.config();
await connectDatabase();

const user = await User.findOneAndUpdate(
  { email: 'admin@example.com' },
  { name: 'CRM Admin', email: 'admin@example.com', password: 'password123', role: 'admin' },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

await Customer.deleteMany({});
await Customer.insertMany([
  { name: 'Ava Patel', company: 'Northwind Health', email: 'ava@northwind.test', phone: '555-0101', status: 'Customer', value: 42000, notes: 'Renewal due this quarter.', owner: user._id },
  { name: 'Noah Kim', company: 'BrightPath Logistics', email: 'noah@brightpath.test', phone: '555-0134', status: 'Prospect', value: 18000, notes: 'Requested security questionnaire.', owner: user._id },
  { name: 'Mia Johnson', company: 'Summit Retail', email: 'mia@summit.test', phone: '555-0188', status: 'Lead', value: 9500, notes: 'Met at industry event.', owner: user._id }
]);

console.log('Seeded CRM data. Login: admin@example.com / password123');
process.exit(0);
