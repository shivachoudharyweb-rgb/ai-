import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }
  
  if (users.users.length === 0) {
    console.log("No users found in the database yet.");
  } else {
    console.log("Found users:");
    users.users.forEach(user => {
      console.log(`- Email: ${user.email} (Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'})`);
    });
  }
}

checkUsers();
