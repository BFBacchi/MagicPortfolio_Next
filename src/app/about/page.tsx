import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Icon,
  IconButton,
  Media,
  Tag,
  Text,
  Meta,
  Schema
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";
import { 
  getIntroduction, 
  getWorkExperience, 
  getStudies, 
  getTechnicalSkills 
} from "@/lib/supabase/queries";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default async function About() {
  // Fetch data from Supabase
  const [introduction, workExperience, studies, technicalSkills] = await Promise.all([
    getIntroduction(),
    getWorkExperience(),
    getStudies(),
    getTechnicalSkills()
  ]);

  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: workExperience.map((exp) => exp.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: studies.map((study) => study.institution),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: technicalSkills.map((skill) => skill.title),
    },
  ];
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          hide="s"
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      {about.avatar.display && (
        <Column
          className={styles.avatar}
          position="sticky"
          minWidth="160"
          paddingX="l"
          paddingBottom="xl"
          gap="m"
          flex={3}
          horizontal="center"
        >
          <Avatar src={person.avatar} size="xl" />
          <Flex gap="8" vertical="center">
            <Icon onBackground="accent-weak" name="globe" />
            {person.location}
          </Flex>
          {person.languages.length > 0 && (
            <Flex wrap gap="8">
              {person.languages.map((language, index) => (
                <Tag key={language} size="l">
                  {language}
                </Tag>
              ))}
            </Flex>
          )}
        </Column>
      )}
      <Column
        id={about.intro.title}
        fillWidth
        minHeight="160"
        vertical="center"
        marginBottom="32"
      >
        {about.calendar.display && (
          <Flex
            fitWidth
            border="brand-alpha-medium"
            className={styles.blockAlign}
            style={{
              backdropFilter: "blur(var(--static-space-1))",
            }}
            background="brand-alpha-weak"
            radius="full"
            padding="4"
            gap="8"
            marginBottom="m"
            vertical="center"
          >
            <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
            <Flex paddingX="8">Schedule a call</Flex>
            <IconButton
              href={about.calendar.link}
              data-border="rounded"
              variant="secondary"
              icon="chevronRight"
            />
          </Flex>
        )}
        <Heading className={styles.textAlign} variant="display-strong-xl">
          {introduction?.name || person.name}
        </Heading>
        <Text
          className={styles.textAlign}
          variant="display-default-xs"
          onBackground="neutral-weak"
        >
          {introduction?.role || person.role}
        </Text>
        {introduction?.description && (
          <Text
            className={styles.textAlign}
            variant="body-default-m"
            onBackground="neutral-weak"
            marginTop="m"
          >
            {introduction.description}
          </Text>
        )}
      </Column>
      <Column
        id={about.work.title}
        fillWidth
        minHeight="160"
        vertical="center"
        marginBottom="32"
      >
        <Heading className={styles.textAlign} variant="display-strong-l">
          {about.work.title}
        </Heading>
        {workExperience.map((experience, index) => (
          <Column key={experience.id} marginTop={index > 0 ? "xl" : "m"} gap="m">
            <Flex gap="m" vertical="center" wrap>
              <Heading variant="display-default-m">
                {experience.position}
              </Heading>
              <Tag size="l" variant="neutral">
                {experience.company}
              </Tag>
            </Flex>
            <Flex gap="s" vertical="center">
              <Icon name="calendar" onBackground="neutral-weak" />
              <Text variant="body-default-s" onBackground="neutral-weak">
                {new Date(experience.start_date).getFullYear()} - {experience.end_date ? new Date(experience.end_date).getFullYear() : 'Present'}
              </Text>
            </Flex>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {experience.description}
            </Text>
            {experience.technologies && experience.technologies.length > 0 && (
              <Flex wrap gap="8" marginTop="s">
                {experience.technologies.map((tech) => (
                  <Tag key={tech} size="s" variant="neutral">
                    {tech}
                  </Tag>
                ))}
              </Flex>
            )}
          </Column>
        ))}
      </Column>
      <Column
        id={about.studies.title}
        fillWidth
        minHeight="160"
        vertical="center"
        marginBottom="32"
      >
        <Heading className={styles.textAlign} variant="display-strong-l">
          {about.studies.title}
        </Heading>
        {studies.map((study, index) => (
          <Column key={study.id} marginTop={index > 0 ? "xl" : "m"} gap="m">
            <Flex gap="m" vertical="center" wrap>
              <Heading variant="display-default-m">
                {study.degree}
              </Heading>
              <Tag size="l" variant="neutral">
                {study.institution}
              </Tag>
            </Flex>
            <Flex gap="s" vertical="center">
              <Icon name="calendar" onBackground="neutral-weak" />
              <Text variant="body-default-s" onBackground="neutral-weak">
                {new Date(study.start_date).getFullYear()} - {study.end_date ? new Date(study.end_date).getFullYear() : 'Present'}
              </Text>
            </Flex>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {study.field}
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {study.description}
            </Text>
          </Column>
        ))}
      </Column>
      <Column
        id={about.technical.title}
        fillWidth
        minHeight="160"
        vertical="center"
        marginBottom="32"
      >
        <Heading className={styles.textAlign} variant="display-strong-l">
          {about.technical.title}
        </Heading>
        {technicalSkills.map((skill, index) => (
          <Column key={skill.id} marginTop={index > 0 ? "xl" : "m"} gap="m">
            <Flex gap="m" vertical="center" wrap>
              <Heading variant="display-default-m">
                {skill.title}
              </Heading>
              <Tag size="l" variant="neutral">
                {skill.category}
              </Tag>
              <Tag size="l" variant="brand">
                Level {skill.level}/10
              </Tag>
            </Flex>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {skill.description}
            </Text>
          </Column>
        ))}
      </Column>
    </Column>
  );
}
