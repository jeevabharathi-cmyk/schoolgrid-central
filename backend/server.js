require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the SchoolConnect Pro API!' });
});

// Example route calling Supabase
app.get('/api/schools', async (req, res) => {
  try {
    const { data, error } = await supabase.from('schools').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
