const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

function getMDXFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist`);
    return [];
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist`);
    return null;
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  return {
    metadata: {
      title: data.title || "",
      publishedAt: data.publishedAt,
      summary: data.summary || "",
      image: data.image || "",
      images: data.images || [],
      tag: data.tag || "",
      team: data.team || [],
      link: data.link || "",
    },
    content,
  };
}

async function migrateProjects() {
  try {
    const projectsDir = path.join(process.cwd(), 'src', 'app', 'work', 'projects');
    const mdxFiles = getMDXFiles(projectsDir);

    console.log(`Found ${mdxFiles.length} MDX files to migrate`);

    for (const file of mdxFiles) {
      const filePath = path.join(projectsDir, file);
      const { metadata, content } = readMDXFile(filePath);
      const slug = path.basename(file, path.extname(file));

      if (!metadata.title || !metadata.publishedAt) {
        console.log(`Skipping ${file} - missing required fields`);
        continue;
      }

      // Check if project already exists
      const existingProject = await pool.query(
        'SELECT id FROM projects WHERE slug = $1',
        [slug]
      );

      if (existingProject.rows.length > 0) {
        console.log(`Project ${slug} already exists, skipping...`);
        continue;
      }

      // Insert project into database
      await pool.query(
        `INSERT INTO projects (slug, title, published_at, summary, images, tag, link, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          slug,
          metadata.title,
          metadata.publishedAt,
          metadata.summary,
          metadata.images,
          metadata.tag,
          metadata.link,
          content,
        ]
      );

      console.log(`✅ Migrated project: ${metadata.title}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await pool.end();
  }
}

migrateProjects(); 