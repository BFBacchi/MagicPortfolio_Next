import { Flex, RevealFx, Column, Schema } from "@once-ui-system/core";
import { home, about, person, newsletter, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import Posts from "@/components/blog/Posts";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeLatestBlogHeading } from "@/components/home/HomeLatestBlogHeading";
import { getPortfolioAvatarForSite } from "@/lib/portfolioAvatar";

export default async function Home() {
  const { imgSrc, absoluteForSeo } = await getPortfolioAvatarForSite();

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
        <Projects range={[1, 1]} />
      </RevealFx>
      {routes["/noticias"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <HomeLatestBlogHeading />
          <Flex flex={3} paddingX="20">
            <Posts range={[1, 2]} columns="2" />
          </Flex>
        </Flex>
      )}
      <Projects range={[2]} />
      {newsletter.display && <Mailchimp />}
    </Column>
  );
}
