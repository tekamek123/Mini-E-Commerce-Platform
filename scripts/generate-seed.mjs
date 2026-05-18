import fs from 'fs';

async function generateSeed() {
  const res = await fetch('https://fakestoreapi.com/products');
  const products = await res.json();

  const values = products.map(p => {
    const title = p.title.replace(/'/g, "''");
    const desc = p.description.replace(/'/g, "''");
    const category = p.category.replace(/'/g, "''");
    const image = p.image.replace(/'/g, "''");
    
    return `('${title}', ${p.price}, '${desc}', '${category}', '${image}', ${p.rating.rate}, ${p.rating.count})`;
  });

  const sql = 'INSERT INTO public.products (title, price, description, category, image_url, rating_rate, rating_count) VALUES\n' + values.join(',\n') + ';';

  fs.writeFileSync('supabase/seed_products.sql', sql);
  console.log('Seed SQL file generated at supabase/seed_products.sql');
}

generateSeed();
