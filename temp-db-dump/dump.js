const { Client } = require('pg');
const fs = require('fs');

async function dump() {
  const client = new Client({
    connectionString: 'postgresql://postgres:MyPdfProject123@db.hcgjatlbduyswuporqmg.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log('Connected!');
    
    // Get all tables in public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    
    const tables = tablesRes.rows.map(r => r.table_name);
    console.log('Tables:', tables);

    let sql = '';
    for (const table of tables) {
      const colRes = await client.query(`
        SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      sql += 'CREATE TABLE public.' + table + ' (\n';
      const cols = colRes.rows.map(c => {
        let def = '  ' + c.column_name + ' ' + c.data_type;
        if (c.character_maximum_length) def += '(' + c.character_maximum_length + ')';
        if (c.is_nullable === 'NO') def += ' NOT NULL';
        if (c.column_default) def += ' DEFAULT ' + c.column_default;
        return def;
      });
      sql += cols.join(',\n');
      sql += '\n);\n\n';
    }
    
    fs.writeFileSync('schema.sql', sql);
    console.log('Done writing schema.sql');
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

dump();
