import type { MetadataRoute } from "next";
import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import { getProjectsFromDB } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt),
  }));

  const projects = await getProjectsFromDB({ orderBy: "published_at" });
  const works = projects.map((project) => ({
    url: `${baseURL}/work/${encodeURIComponent(project.slug)}`,
    lastModified: new Date(project.published_at || project.created_at),
  }));

  const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route as keyof typeof routesConfig]);

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date(),
  }));

  return [...routes, ...blogs, ...works];
}
