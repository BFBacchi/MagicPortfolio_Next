import { Logo } from "@once-ui-system/core";

const person = {
  firstName: "Bruno",
  lastName: "Bacchi",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Design Engineer",
  avatar: "/favicon.ico",
  email: "bfbacchi@gmail.com",
  location: "America/Argentina/Buenos_Aires", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Spanish"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: true,
  title: <>💬 ¡Hablemos de tu proyecto!</>,
  description: (
    <>
      ¿Tienes una idea para un proyecto? ¿Necesitas un desarrollador fullstack? 
      Envíame un mensaje y conversemos sobre cómo puedo ayudarte a hacer realidad tu visión.
      <br />
      <strong>Respuesta garantizada en menos de 24 horas.</strong>
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/BFBacchi"
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/bruno-bacchi",
  },
  {
    name: "Discord",
    icon: "discord",
    link: "https://discord.gg/3rR5M9Ju"
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Contruyendo Sofware combinando diseño y código</>,
  featured: {
    display: true,
    title: <>Proyectos recientes: <strong className="ml-4">Creator Hub</strong></>,
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      Hola, Soy Bruno, un desarrollador fullstack que combina diseño y código para crear soluciones innovadoras.
      <br />Desarrollo software desde 2018, con experiencia en desarrollo frontend y backend, siempre buscando aprender nuevas tecnologías y mejorar mis habilidades.
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Selene is a Jakarta-based design engineer with a passion for transforming complex challenges
        into simple, elegant design solutions. Her work spans digital interfaces, interactive
        experiences, and the convergence of design and technology.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "FLY",
        timeframe: "2022 - Present",
        role: "Senior Design Engineer",
        achievements: [
          <>
            Redesigned the UI/UX for the FLY platform, resulting in a 20% increase in user
            engagement and 30% faster load times.
          </>,
          <>
            Spearheaded the integration of AI tools into design workflows, enabling designers to
            iterate 50% faster.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Once UI Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Creativ3",
        timeframe: "2018 - 2022",
        role: "Lead Designer",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple platforms, improving
            design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line, contributing to a 15% increase
            in overall company revenue.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Jakarta",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog = {
  path: "/noticias",
  label: "Noticias",
  title: "Noticias de Desarrollo y Tecnología",
  description: `Mantente actualizado con las últimas noticias del mundo del desarrollo y la tecnología`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /noticias route
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Placeholders vía Picsum (no requieren archivos en public/). Sustituye por
  // "/images/gallery/tu-foto.jpg" cuando copies imágenes a public/images/gallery/.
  images: [
    {
      src: "https://picsum.photos/id/1018/1600/900",
      alt: "Gallery",
      orientation: "horizontal",
    },
    {
      src: "https://picsum.photos/id/1015/1600/900",
      alt: "Gallery",
      orientation: "horizontal",
    },
    {
      src: "https://picsum.photos/id/1019/1600/900",
      alt: "Gallery",
      orientation: "horizontal",
    },
    {
      src: "https://picsum.photos/id/1022/1600/900",
      alt: "Gallery",
      orientation: "horizontal",
    },
    {
      src: "https://picsum.photos/id/1003/900/1200",
      alt: "Gallery",
      orientation: "vertical",
    },
    {
      src: "https://picsum.photos/id/1011/900/1200",
      alt: "Gallery",
      orientation: "vertical",
    },
    {
      src: "https://picsum.photos/id/1025/900/1200",
      alt: "Gallery",
      orientation: "vertical",
    },
    {
      src: "https://picsum.photos/id/1035/900/1200",
      alt: "Gallery",
      orientation: "vertical",
    },
  ],
};

const dbTest = {
  path: "/db-test",
  label: "DB Test",
  title: `Database Test – ${person.name}`,
  description: `Database connection diagnostic tool`,
};

export { person, social, newsletter, home, about, blog, work, gallery, dbTest };
