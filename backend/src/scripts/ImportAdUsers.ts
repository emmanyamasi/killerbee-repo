import fs from "fs";
import csv from "csv-parser";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("🔍 DB Connection:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  db: process.env.DB_NAME
});

const { Pool } = pkg;

// Connect to your Postgres DB (using your .env settings)
const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "KillerBeeDB",
});

interface ADUser {
  SamAccountName?: string;
  GivenName?: string;
  Surname?: string;
  Mail?: string;
  Title?: string;
  Department?: string;
  Groups?: string;
  Enabled?: string;
}

async function importUsers() {
  const results: ADUser[] = [];

  fs.createReadStream("app_users.csv") // ensure this CSV file is in the same folder
    .pipe(csv())
    .on("data", (data: ADUser) => results.push(data))
    .on("end", async () => {
      const client = await pool.connect();
      try {
        console.log(`📥 Importing ${results.length} AD users...`);

        for (const row of results) {
          // Skip disabled accounts
          if (row.Enabled && row.Enabled.toLowerCase() === "false") continue;

          // Build full name
          const name = row.GivenName
            ? `${row.GivenName} ${row.Surname || ""}`.trim()
            : row.SamAccountName || "Unknown";

          // Default email (use AD email if available, otherwise placeholder)
          const email =
            row.Mail || `${(row.SamAccountName || name).toLowerCase()}@example.com`;

          // Default password (since AD passwords aren’t exported)
          const password = "1234"; // placeholder until LDAP login is ready

          // Assign role based on group membership
          let roleId = 4; // Default = Factory
          if (row.Groups?.includes("R&D")) roleId = 2;
          else if (row.Groups?.includes("Test")) roleId = 3;
          else if (row.Groups?.includes("Admin")) roleId = 1;

          // Insert into DB
          await client.query(
  `INSERT INTO public.users (name, email, password, role_id)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (email)
   DO UPDATE SET 
     name = EXCLUDED.name,
     role_id = EXCLUDED.role_id`,
  [name, email, password, roleId]
);

         
      


          console.log(`✅ Imported: ${name} (${email}) [Role ID: ${roleId}]`);
        }

        console.log("🎉 Import complete!");
      } catch (err) {
        console.error("❌ Error during import:", err);
      } finally {
        client.release();
        pool.end();
      }
    });
}

importUsers();
