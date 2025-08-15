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
import { AboutClient } from "@/components/about/AboutClient";
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

// Simplified About page
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
    <AboutClient
      introduction={introduction}
      workExperience={workExperience}
      studies={studies}
      technicalSkills={technicalSkills}
    />
  );
}

    