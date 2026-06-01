const { Client } = require('pg');

async function testConn() {
  const clientOld = new Client({
    connectionString: 'postgresql://postgres:MyPdfProject123@db.hcgjatlbduyswuporqmg.supabase.co:5432/postgres'
  });
  
  const clientNew = new Client({
    connectionString: 'postgresql://postgres:MyPdfProject123@db.ukxwejrgfayjlouinpew.supabase.co:5432/postgres'
  });

  try {
    await clientOld.connect();
    console.log('Connected to OLD DB!');
    
    // fetch categories
    const catRes = await clientOld.query('SELECT * FROM categories ORDER BY id ASC');
    console.log(`Fetched ${catRes.rowCount} categories`);
    
    // fetch tools
    const toolRes = await clientOld.query('SELECT * FROM allpdftools ORDER BY id ASC');
    console.log(`Fetched ${toolRes.rowCount} tools`);
    
    await clientOld.end();
    
    console.log('Connecting to NEW DB...');
    await clientNew.connect();
    console.log('Connected to NEW DB!');
    
    // Insert categories
    for (const c of catRes.rows) {
      await clientNew.query(
        'INSERT INTO categories (id, name, icon, sort_order, is_active) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        [c.id, c.name, c.icon, c.sort_order, c.is_active]
      );
    }
    console.log('Inserted categories');
    
    // Insert tools
    for (const t of toolRes.rows) {
      await clientNew.query(
        'INSERT INTO allpdftools (id, tool_key, title, url, category_id, is_verified, category, img_convert) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
        [t.id, t.tool_key, t.title, t.url, t.category_id, t.is_verified, t.category, t.img_convert]
      );
    }
    console.log('Inserted tools');
    
    // update sequences
    await clientNew.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`);
    await clientNew.query(`SELECT setval('allpdftools_id_seq', (SELECT MAX(id) FROM allpdftools))`);
    console.log('Updated sequences');
    
    await clientNew.end();
    console.log('MIGRATION COMPLETE');
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

testConn();
