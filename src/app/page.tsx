import { Flex, RevealFx, Column, Schema } from "@once-ui-system/core";
import { home, about, person, newsletter, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import Posts from "@/components/blog/Posts";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeLatestBlogHeading } from "@/components/home/HomeLatestBlogHeading";
import { getPortfolioAvatarForSite } from "@/lib/portfolioAvatar";
import { getProjectsFromDB } from "@/lib/projects";
import { getRequestLocale } from "@/i18n/locale.server";

export default async function Home() {
  const locale = await getRequestLocale();
  const { imgSrc, absoluteForSeo } = await getPortfolioAvatarForSite();
  const projects = await getProjectsFromDB({ orderBy: "created_at", locale });
  const latestProject = projects.slice(0, 1);
  const otherProjects = projects.slice(1);

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: absoluteForSeo,
        }}
      />
      <HomeIntro aboutCtaAvatarSrc={imgSrc} />
      <RevealFx translateY="16" delay={0.6}>
        <Projects initialProjects={latestProject} />
      </RevealFx>
      {routes["/noticias"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <HomeLatestBlogHeading />
          <Flex flex={3} paddingX="20">
            <Posts range={[1, 2]} columns="2" />
          </Flex>
        </Flex>
      )}
      <Projects initialProjects={otherProjects} />
      {newsletter.display && <Mailchimp />}
    </Column>
  );
}
