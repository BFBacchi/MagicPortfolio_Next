import type { MetadataRoute } from "next";
import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import { getProjectsFromDB } from "@/lib/projects";
import { APP_LOCALES } from "@/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = APP_LOCALES.flatMap((locale) =>
    getPosts(["src", "app", "blog", "posts"]).map((post) => ({
      url: `${baseURL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.metadata.publishedAt),
    }))
  );

  const works = APP_LOCALES.flatMap(async (locale) => {
    const projects = await getProjectsFromDB({ orderBy: "published_at", locale });
    return projects.map((project) => ({
      url: `${baseURL}/${locale}/work/${encodeURIComponent(project.slug)}`,
      lastModified: new Date(project.published_at || project.created_at),
    }));
  });
  const worksResolved = (await Promise.all(works)).flat();

  const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route as keyof typeof routesConfig]);

  const routes = APP_LOCALES.flatMap((locale) =>
    activeRoutes.map((route) => ({
      url: `${baseURL}/${locale}${route !== "/" ? route : ""}`,
      lastModified: new Date(),
    }))
  );

  return [...routes, ...blogs, ...worksResolved];
}
