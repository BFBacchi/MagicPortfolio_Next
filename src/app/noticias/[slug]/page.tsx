import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import { Meta, Schema, AvatarGroup, Button, Column, Heading, HeadingNav, Icon, Row, Text } from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import { Metadata } from 'next';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const posts = getPosts(["src", "app", "noticias", "posts"]);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for noticias:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  try {
    const routeParams = await params;
    const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

    const posts = getPosts(["src", "app", "noticias", "posts"])
    console.log("Metadata - Available slugs:", posts.map(p => p.slug));
    console.log("Metadata - Looking for slug:", slugPath);
    
    let post = posts.find((post) => post.slug === slugPath);

    if (!post) {
      console.error(`Post not found for slug in metadata: ${slugPath}`);
      console.error("Metadata - Available slugs:", posts.map(p => p.slug));
      return {};
    }

    return Meta.generate({
      title: post.metadata.title,
      description: post.metadata.summary,
      baseURL: baseURL,
      image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
      path: `${blog.path}/${post.slug}`,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {};
  }
}

export default async function Blog({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  try {
    const routeParams = await params;
    const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

    // Debug: mostrar todos los slugs disponibles
    const allPosts = getPosts(["src", "app", "noticias", "posts"]);
    console.log("Available slugs:", allPosts.map(p => p.slug));
    console.log("Looking for slug:", slugPath);
    
    let post = allPosts.find((post) => post.slug === slugPath);

    if (!post) {
      console.error(`Post not found for slug: ${slugPath}`);
      console.error("Available slugs:", allPosts.map(p => p.slug));
      notFound();
    }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Row maxWidth={12} hide="m"/>
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="xs" gap="l">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Button data-border="rounded" href="/noticias" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
            Noticias
          </Button>
          <Heading variant="display-strong-s">{post.metadata.title}</Heading>
          <Row gap="12" vertical="center">
            {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
            <Text variant="body-default-s" onBackground="neutral-weak">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
          </Row>
          <Column as="article" fillWidth>
            <CustomMDX source={post.content} />
          </Column>
          <ScrollToHash />
        </Column>
    </Row>
    <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" hide="m">
      <Row
        gap="12"
        paddingLeft="2"
        vertical="center"
        onBackground="neutral-medium"
        textVariant="label-default-s"
      >
        <Icon name="document" size="xs" />
        On this page
      </Row>
      <HeadingNav fitHeight/>
    </Column>
    </Row>
  );
  } catch (error) {
    console.error("Error in Blog component:", error);
    notFound();
  }
}
