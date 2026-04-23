import { notFound } from "next/navigation";
import { Meta, Schema, AvatarGroup, Button, Column, Flex, Heading, Media, Text } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { Metadata } from "next";
import { getProjectsFromDB, getProjectBySlug, isSafeProjectSlug } from "@/lib/projects";
import { getRequestLocale } from "@/i18n/locale.server";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const projects = await getProjectsFromDB({ locale: "es" });
    return projects
      .filter((project) => isSafeProjectSlug(project.slug))
      .map((project) => ({
        slug: project.slug,
      }));
  } catch (error) {
    console.error('Error generating static params for projects:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  try {
    const locale = await getRequestLocale();
    const routeParams = await params;
    const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

    const project = await getProjectBySlug(slugPath, locale);

    if (!project) {
      console.error(`Project not found for slug: ${slugPath}`);
      return {};
    }

    return Meta.generate({
      title: project.title,
      description: project.summary,
      baseURL: baseURL,
      image: project.images[0] || `/api/og/generate?title=${project.title}`,
      path: `${work.path}/${project.slug}`,
    });
  } catch (error) {
    console.error('Error generating metadata for project:', error);
    return {};
  }
}

export default async function Project({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  try {
    const locale = await getRequestLocale();
    const routeParams = await params;
    const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

    const project = await getProjectBySlug(slugPath, locale);

    if (!project) {
      console.error(`Project not found for slug: ${slugPath}`);
      notFound();
    }

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${project.slug}`}
        title={project.title}
        description={project.summary}
        datePublished={project.published_at}
        dateModified={project.published_at}
        image={project.images[0] || `/api/og/generate?title=${encodeURIComponent(project.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="xs" gap="16">
        <Button data-border="rounded" href="/work" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
          Projects
        </Button>
        <Heading variant="display-strong-s">{project.title}</Heading>
      </Column>
      {project.images.length > 0 && (
        <Media
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={`Imagen principal del proyecto ${project.title}`}
          src={project.images[0]}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Flex gap="12" marginBottom="24" vertical="center">
          <Text variant="body-default-s" onBackground="neutral-weak">
            {project.published_at && formatDate(project.published_at)}
          </Text>
        </Flex>
        <CustomMDX source={project.content} />
      </Column>
      <ScrollToHash />
    </Column>
  );
  } catch (error) {
    console.error('Error in Project component:', error);
    notFound();
  }
}
