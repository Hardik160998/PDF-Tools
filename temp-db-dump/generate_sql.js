const { Client } = require('pg');
const fs = require('fs');

async function generateSQL() {
  const clientOld = new Client({
    connectionString: 'postgresql://postgres:MyPdfProject123@db.hcgjatlbduyswuporqmg.supabase.co:5432/postgres'
  });
  
  try {
    await clientOld.connect();
    
    let sql = `-- Data Migration SQL File\n\n`;
    
    // fetch categories
    const catRes = await clientOld.query('SELECT * FROM categories ORDER BY id ASC');
    if (catRes.rowCount > 0) {
      sql += `-- Insert Categories\nINSERT INTO "public"."categories" ("id", "name", "icon", "sort_order", "is_active") VALUES\n`;
      const catValues = catRes.rows.map(c => `(${c.id}, '${c.name.replace(/'/g, "''")}', '${c.icon.replace(/'/g, "''")}', ${c.sort_order}, ${c.is_active})`).join(',\n');
      sql += catValues + `\nON CONFLICT (id) DO NOTHING;\n\n`;
    }
    
    // fetch tools
    const toolRes = await clientOld.query('SELECT * FROM allpdftools ORDER BY id ASC');
    if (toolRes.rowCount > 0) {
      sql += `-- Insert Tools\nINSERT INTO "public"."allpdftools" ("id", "tool_key", "title", "url", "category_id", "is_verified", "category", "img_convert") VALUES\n`;
      const toolValues = toolRes.rows.map(t => `(${t.id}, '${t.tool_key.replace(/'/g, "''")}', '${t.title.replace(/'/g, "''")}', '${t.url.replace(/'/g, "''")}', ${t.category_id}, ${t.is_verified}, ${t.category ? "'" + t.category.replace(/'/g, "''") + "'" : 'NULL'}, ${t.img_convert})`).join(',\n');
      sql += toolValues + `\nON CONFLICT (id) DO NOTHING;\n\n`;
    }
    
    sql += `-- Update sequences\nSELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));\n`;
    sql += `SELECT setval('allpdftools_id_seq', (SELECT MAX(id) FROM allpdftools));\n`;
    
    fs.writeFileSync('../data_migration.sql', sql);
    console.log('Successfully generated data_migration.sql!');
    
    await clientOld.end();
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

generateSQL();
