import { db } from './db';

export interface Project {
  id: number;
  slug: string;
  title: string;
  published_at: string;
  summary: string;
  images: string[];
  tag?: string;
  link?: string;
  content: string;
  created_at: string;
}

export async function getProjectsFromDB(): Promise<Project[]> {
  try {
    const result = await db.query(
      'SELECT * FROM projects ORDER BY published_at DESC'
    );
    
    return result.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      published_at: row.published_at,
      summary: row.summary,
      images: row.images || [],
      tag: row.tag,
      link: row.link,
      content: row.content,
      created_at: row.created_at,
    }));
  } catch (error) {
    console.error('Error fetching projects from database:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const result = await db.query(
      'SELECT * FROM projects WHERE slug = $1',
      [slug]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      published_at: row.published_at,
      summary: row.summary,
      images: row.images || [],
      tag: row.tag,
      link: row.link,
      content: row.content,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
} 