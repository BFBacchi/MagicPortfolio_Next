import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { getProjectsFromDB } from "@/lib/projects";

interface ProjectsProps {
  range?: [number, number?];
}

export async function Projects({ range }: ProjectsProps) {
  const allProjects = await getProjectsFromDB();

  const displayedProjects = range
    ? allProjects.slice(range[0] - 1, range[1] ?? allProjects.length)
    : allProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((project, index) => (
        <ProjectCard
          priority={index < 2}
          key={project.slug}
          href={`work/${project.slug}`}
          images={project.images}
          title={project.title}
          description={project.summary}
          content={project.content}
          avatars={[]} // We'll need to add team members to the database if needed
          link={project.link || ""}
        />
      ))}
    </Column>
  );
}
