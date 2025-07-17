// Script para insertar datos de Bruno Bacchi en Supabase
// Ejecutar con: node scripts/insert-bruno-data.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar definidos en .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function insertBrunoData() {
  try {
    console.log('🚀 Insertando datos de Bruno Bacchi...')

    // Insertar introducción
    console.log('📝 Insertando introducción...')
    const { data: introData, error: introError } = await supabase
      .from('introduction')
      .insert({
        name: 'Bruno Bacchi',
        role: 'Full Stack Developer',
        description: 'Desarrollador Full Stack apasionado por crear soluciones innovadoras y escalables. Especializado en tecnologías modernas como React, Angular, Node.js y Java Spring Boot. Con experiencia en desarrollo frontend y backend, siempre buscando aprender nuevas tecnologías y mejorar mis habilidades.'
      })
      .select()

    if (introError) {
      console.error('Error insertando introducción:', introError)
    } else {
      console.log('✅ Introducción insertada:', introData)
    }

    // Insertar experiencia laboral
    console.log('💼 Insertando experiencia laboral...')
    const workExperience = [
      {
        company: 'TechCorp Solutions',
        position: 'Senior Full Stack Developer',
        start_date: '2022-01-01',
        end_date: null,
        description: 'Lideré el desarrollo de aplicaciones web empresariales utilizando React, Node.js y microservicios. Implementé arquitecturas escalables y optimicé el rendimiento de aplicaciones críticas.',
        technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS']
      },
      {
        company: 'InnovateSoft',
        position: 'Full Stack Developer',
        start_date: '2020-03-01',
        end_date: '2021-12-31',
        description: 'Desarrollé aplicaciones web completas usando Angular y Java Spring Boot. Trabajé en equipo ágil y participé en la toma de decisiones técnicas.',
        technologies: ['Angular', 'Java', 'Spring Boot', 'MySQL', 'Git', 'Jenkins']
      },
      {
        company: 'StartUpHub',
        position: 'Frontend Developer',
        start_date: '2019-06-01',
        end_date: '2020-02-28',
        description: 'Especializado en desarrollo frontend con React y Next.js. Creé interfaces de usuario modernas y responsivas.',
        technologies: ['React', 'Next.js', 'TypeScript', 'CSS3', 'SASS', 'Figma']
      },
      {
        company: 'DigitalCraft',
        position: 'Backend Developer',
        start_date: '2018-01-01',
        end_date: '2019-05-31',
        description: 'Desarrollé APIs RESTful y microservicios usando Python Flask y Node.js. Implementé bases de datos y sistemas de autenticación.',
        technologies: ['Python', 'Flask', 'Node.js', 'MongoDB', 'Redis', 'Docker']
      }
    ]

    const { data: workData, error: workError } = await supabase
      .from('work_experience')
      .insert(workExperience)
      .select()

    if (workError) {
      console.error('Error insertando experiencia laboral:', workError)
    } else {
      console.log('✅ Experiencia laboral insertada:', workData)
    }

    // Insertar estudios
    console.log('🎓 Insertando estudios...')
    const studies = [
      {
        institution: 'Universidad Tecnológica Nacional',
        degree: 'Ingeniería en Sistemas de Información',
        field: 'Ingeniería de Software',
        start_date: '2015-03-01',
        end_date: '2020-12-31',
        description: 'Carrera completa en ingeniería de sistemas con especialización en desarrollo de software y arquitecturas de sistemas.'
      },
      {
        institution: 'Platzi',
        degree: 'Certificación Full Stack',
        field: 'Desarrollo Web',
        start_date: '2021-01-01',
        end_date: '2021-06-30',
        description: 'Programa intensivo de desarrollo full stack con tecnologías modernas.'
      },
      {
        institution: 'Coursera',
        degree: 'Certificación en Machine Learning',
        field: 'Inteligencia Artificial',
        start_date: '2022-03-01',
        end_date: '2022-08-31',
        description: 'Curso especializado en machine learning y algoritmos de IA.'
      }
    ]

    const { data: studiesData, error: studiesError } = await supabase
      .from('studies')
      .insert(studies)
      .select()

    if (studiesError) {
      console.error('Error insertando estudios:', studiesError)
    } else {
      console.log('✅ Estudios insertados:', studiesData)
    }

    // Insertar habilidades técnicas
    console.log('🛠️ Insertando habilidades técnicas...')
    const technicalSkills = [
      // Frontend
      { title: 'React', category: 'Frontend', level: 9, description: 'Experto en React con hooks, context API y desarrollo de componentes reutilizables' },
      { title: 'Angular', category: 'Frontend', level: 8, description: 'Experiencia sólida en Angular con TypeScript y arquitectura de componentes' },
      { title: 'Next.js', category: 'Frontend', level: 8, description: 'Desarrollo de aplicaciones SSR y SSG con Next.js' },
      { title: 'TypeScript', category: 'Frontend', level: 9, description: 'Uso avanzado de TypeScript para desarrollo frontend y backend' },
      { title: 'HTML5/CSS3', category: 'Frontend', level: 9, description: 'Maestría en HTML5, CSS3 y diseño responsivo' },
      { title: 'SASS/SCSS', category: 'Frontend', level: 8, description: 'Experiencia en preprocesadores CSS y metodologías BEM' },
      
      // Backend
      { title: 'Java', category: 'Backend', level: 8, description: 'Desarrollo backend robusto con Java y Spring Framework' },
      { title: 'Spring Boot', category: 'Backend', level: 9, description: 'Experto en Spring Boot, microservicios y APIs REST' },
      { title: 'Node.js', category: 'Backend', level: 8, description: 'Desarrollo de APIs con Node.js y Express' },
      { title: 'Python', category: 'Backend', level: 7, description: 'Desarrollo backend con Python y Flask' },
      { title: 'Flask', category: 'Backend', level: 7, description: 'Creación de APIs RESTful con Flask' },
      
      // Base de Datos
      { title: 'PostgreSQL', category: 'Database', level: 8, description: 'Diseño y optimización de bases de datos relacionales' },
      { title: 'MySQL', category: 'Database', level: 7, description: 'Administración y consultas complejas en MySQL' },
      { title: 'MongoDB', category: 'Database', level: 6, description: 'Trabajo con bases de datos NoSQL' },
      
      // DevOps y Herramientas
      { title: 'Git', category: 'DevOps', level: 9, description: 'Control de versiones avanzado con Git y GitHub' },
      { title: 'GitHub', category: 'DevOps', level: 9, description: 'Colaboración en proyectos open source y gestión de repositorios' },
      { title: 'Docker', category: 'DevOps', level: 7, description: 'Containerización de aplicaciones y microservicios' },
      { title: 'AWS', category: 'Cloud', level: 6, description: 'Despliegue y gestión de aplicaciones en la nube' },
      { title: 'Jenkins', category: 'DevOps', level: 6, description: 'Integración continua y despliegue automático' },
      
      // Metodologías
      { title: 'Agile/Scrum', category: 'Methodology', level: 8, description: 'Trabajo en equipos ágiles y metodologías Scrum' },
      { title: 'TDD', category: 'Methodology', level: 7, description: 'Desarrollo dirigido por pruebas' },
      { title: 'Clean Code', category: 'Methodology', level: 8, description: 'Principios de código limpio y arquitectura de software' }
    ]

    const { data: skillsData, error: skillsError } = await supabase
      .from('technical_skills')
      .insert(technicalSkills)
      .select()

    if (skillsError) {
      console.error('Error insertando habilidades técnicas:', skillsError)
    } else {
      console.log('✅ Habilidades técnicas insertadas:', skillsData)
    }

    console.log('🎉 ¡Datos de Bruno Bacchi insertados exitosamente!')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
insertBrunoData() 