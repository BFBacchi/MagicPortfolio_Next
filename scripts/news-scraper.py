#!/usr/bin/env python3
"""
Script para extraer noticias de desarrollo y generar archivos MDX
"""

import requests
import feedparser
import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path
import hashlib
import time

class NewsScraper:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.posts_dir = self.base_dir / "src" / "app" / "noticias" / "posts"
        self.processed_file = self.base_dir / "scripts" / "processed_news.json"
        # Workflow pasa MAX_POSTS; por defecto 3. Más entradas por feed = más posibilidad de hallar ítems aún no procesados.
        self.max_posts_per_run = max(1, int(os.environ.get("MAX_POSTS", "3")))
        self.max_entries_per_feed = max(5, int(os.environ.get("MAX_ENTRIES_PER_FEED", "25")))
        self._rss_headers = {
            "User-Agent": "MagicPortfolioNewsBot/1.0 (+https://github.com/BFBacchi/MagicPortfolio_Next)"
        }
        
        # Fuentes RSS en español
        self.rss_feeds = [
            {
                "name": "Dev.to Español",
                "url": "https://dev.to/feed/tag/spanish",
                "category": "Desarrollo Web"
            },
            {
                "name": "FreeCodeCamp Español",
                "url": "https://www.freecodecamp.org/espanol/news/rss.xml",
                "category": "Programación"
            },
            {
                "name": "Platzi Blog",
                "url": "https://platzi.com/blog/feed/",
                "category": "Educación Tech"
            },
            {
                "name": "Código Facilito",
                "url": "https://codigofacilito.com/articulos.rss",
                "category": "Tutoriales"
            },
            {
                "name": "OpenWebinars",
                "url": "https://openwebinars.net/blog/feed/",
                "category": "Tecnología"
            },
            {
                "name": "Genbeta",
                "url": "https://www.genbeta.com/feed",
                "category": "Tecnología"
            },
            {
                "name": "Xataka",
                "url": "https://www.xataka.com/feed",
                "category": "Tecnología"
            }
        ]
        
        # Palabras clave para filtrar contenido relevante (en español e inglés)
        self.keywords = [
            # Términos en español
            "javascript", "react", "vue", "angular", "node.js", "python", "typescript",
            "css", "html", "desarrollo web", "frontend", "backend", "api", "base de datos",
            "git", "github", "docker", "kubernetes", "aws", "azure", "next.js", "nuxt",
            "svelte", "tailwind", "bootstrap", "webpack", "vite", "npm", "yarn",
            "programación", "código", "desarrollo de software", "devops", "aprendizaje automático",
            "inteligencia artificial", "blockchain", "desarrollo móvil", "ios", "android",
            "tutorial", "curso", "aprender", "tecnología", "programador", "desarrollador",
            "aplicación", "web", "móvil", "servidor", "cliente", "framework", "librería",
            "algoritmo", "estructura de datos", "patrones de diseño", "arquitectura",
            "testing", "pruebas", "debugging", "depuración", "optimización", "performance",
            "seguridad", "autenticación", "autorización", "criptografía", "https", "ssl",
            "responsive", "adaptativo", "ux", "ui", "diseño", "usabilidad", "accesibilidad",
            # Términos en inglés (por si acaso)
            "web development", "frontend", "backend", "database", "programming", "coding",
            "software development", "machine learning", "artificial intelligence", "mobile development"
        ]
    
    def load_processed_news(self):
        """Cargar lista de noticias ya procesadas"""
        if self.processed_file.exists():
            with open(self.processed_file, 'r', encoding='utf-8') as f:
                return set(json.load(f))
        return set()
    
    def save_processed_news(self, processed_set):
        """Guardar lista de noticias procesadas"""
        with open(self.processed_file, 'w', encoding='utf-8') as f:
            json.dump(list(processed_set), f, ensure_ascii=False, indent=2)
    
    def is_relevant_content(self, title, summary, content=""):
        """Verificar si el contenido es relevante para desarrollo"""
        text = f"{title} {summary} {content}".lower()
        return any(keyword.lower() in text for keyword in self.keywords)
    
    def clean_text(self, text):
        """Limpiar y formatear texto"""
        if not text:
            return ""
        
        # Remover HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Limpiar caracteres especiales
        text = re.sub(r'[^\w\s\-.,!?]', '', text)
        # Normalizar espacios
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def is_spanish_content(self, text):
        """Verificar si el contenido está en español"""
        if not text:
            return False
        
        # Palabras comunes en español
        spanish_words = [
            "el", "la", "de", "que", "y", "a", "en", "un", "es", "se", "no", "te", "lo", "le",
            "da", "su", "por", "son", "con", "para", "al", "del", "los", "las", "una", "como",
            "más", "pero", "sus", "todo", "esta", "sobre", "entre", "cuando", "muy", "sin",
            "hasta", "desde", "donde", "quien", "cual", "cómo", "porque", "aunque", "también",
            "desarrollo", "programación", "aplicación", "tecnología", "software", "código",
            "tutorial", "curso", "aprender", "programador", "desarrollador", "web", "móvil"
        ]
        
        text_lower = text.lower()
        spanish_count = sum(1 for word in spanish_words if word in text_lower)
        
        # Al menos 2 términos típicos de español (antes 3 descartaba mucho contenido válido)
        return spanish_count >= 2
    
    def generate_slug(self, title):
        """Generar slug único para el archivo"""
        # Mapeo de caracteres con acentos a sin acentos
        accent_map = {
            'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ã': 'a', 'å': 'a',
            'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
            'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
            'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'õ': 'o',
            'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
            'ý': 'y', 'ÿ': 'y',
            'ñ': 'n', 'ç': 'c',
            'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A', 'Ã': 'A', 'Å': 'A',
            'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
            'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
            'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O', 'Õ': 'O',
            'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
            'Ý': 'Y', 'Ÿ': 'Y',
            'Ñ': 'N', 'Ç': 'C'
        }
        
        # Convertir acentos a caracteres normales
        slug = title.lower()
        for accent, normal in accent_map.items():
            slug = slug.replace(accent, normal)
        
        # Limpiar título para slug
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')
        
        # Limitar longitud del slug
        if len(slug) > 50:
            slug = slug[:50].rstrip('-')
        
        # Agregar timestamp para unicidad
        timestamp = datetime.now().strftime("%Y%m%d")
        return f"{slug}-{timestamp}"
    
    def fetch_rss_news(self):
        """Obtener noticias de feeds RSS"""
        all_news = []
        stats = {"entries_seen": 0, "passed_relevance": 0, "passed_spanish": 0}

        for feed_config in self.rss_feeds:
            try:
                print(f"📡 Obteniendo noticias de {feed_config['name']}...")
                url = feed_config["url"]
                try:
                    r = requests.get(url, headers=self._rss_headers, timeout=45)
                    r.raise_for_status()
                    feed = feedparser.parse(r.content)
                except Exception as http_err:
                    print(f"⚠️  requests falló ({http_err}), reintento con feedparser directo...")
                    feed = feedparser.parse(url)

                if getattr(feed, "bozo", False) and feed.bozo_exception:
                    print(f"⚠️  Feed con avisos ({feed_config['name']}): {feed.bozo_exception}")

                limit = self.max_entries_per_feed
                for entry in feed.entries[:limit]:
                    try:
                        stats["entries_seen"] += 1
                        title = self.clean_text(getattr(entry, "title", "") or "")
                        summary = self.clean_text(getattr(entry, "summary", "") or "")[:200] + "..."
                        body = ""
                        if getattr(entry, "content", None):
                            try:
                                first = entry.content[0]
                                body = first.get("value", "") if hasattr(first, "get") else getattr(first, "value", "")
                            except (IndexError, AttributeError, TypeError):
                                body = ""
                        content = self.clean_text(body)[:500] + "..."

                        # Verificar si es contenido relevante Y en español
                        if not self.is_relevant_content(title, summary, content):
                            continue
                        stats["passed_relevance"] += 1

                        if not self.is_spanish_content(f"{title} {summary} {content}"):
                            print(f"⚠️  Saltando contenido no en español: {title[:50]}...")
                            continue
                        stats["passed_spanish"] += 1

                        link = getattr(entry, "link", None) or ""
                        if not link:
                            continue

                        news_item = {
                            "title": title,
                            "summary": summary,
                            "url": link,
                            "published": getattr(entry, "published_parsed", None),
                            "source": feed_config["name"],
                            "category": feed_config["category"],
                            "content": content,
                        }

                        all_news.append(news_item)
                        time.sleep(0.5)  # Rate limiting
                    except Exception as entry_err:
                        print(f"⚠️  Entrada omitida en {feed_config['name']}: {entry_err}")
                        continue

            except Exception as e:
                print(f"❌ Error obteniendo {feed_config['name']}: {e}")
                continue

        print(
            f"📈 Resumen fetch: entradas revisadas={stats['entries_seen']}, "
            f"pasan relevancia={stats['passed_relevance']}, pasan español={stats['passed_spanish']}, "
            f"ítems en cola={len(all_news)}"
        )
        return all_news
    
    def generate_mdx_content(self, news_item):
        """Generar contenido MDX para la noticia"""
        # Formatear fecha
        if news_item['published']:
            pub_date = datetime(*news_item['published'][:6]).strftime("%Y-%m-%d")
        else:
            pub_date = datetime.now().strftime("%Y-%m-%d")
        
        # Generar slug
        slug = self.generate_slug(news_item['title'])
        
        # Cargar template
        template_path = self.base_dir / "scripts" / "news-template.mdx"
        if template_path.exists():
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
        else:
            # Template por defecto si no existe el archivo
            template = """---
title: "{{title}}"
summary: "{{summary}}"
publishedAt: "{{publishedAt}}"
tag: "{{category}}"
source: "{{source}}"
originalUrl: "{{originalUrl}}"
autoGenerated: true
---

## 📰 {{title}}

**📡 Fuente:** {{source}}  
**🏷️ Categoría:** {{category}}  
**📅 Fecha original:** {{publishedAt}}

### 📝 Resumen
{{summary}}

### 📖 Contenido
{{content}}

### 🔗 Acceso al Artículo Original
<div style="text-align: center; margin: 2rem 0;">
  <a href="{{originalUrl}}" target="_blank" rel="noopener noreferrer" 
     style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; 
            text-decoration: none; border-radius: 8px; font-weight: bold;">
    📖 Leer artículo completo en {{source}}
  </a>
</div>

---
*Este artículo fue agregado automáticamente desde {{source}} y traducido al español.*"""
        
        # Reemplazar variables en el template
        content = template.replace("{{title}}", news_item['title'])
        content = content.replace("{{summary}}", news_item['summary'])
        content = content.replace("{{publishedAt}}", pub_date)
        content = content.replace("{{category}}", news_item['category'])
        content = content.replace("{{source}}", news_item['source'])
        content = content.replace("{{originalUrl}}", news_item['url'])
        content = content.replace("{{content}}", news_item['content'])
        content = content.replace("{{currentDate}}", datetime.now().strftime("%Y-%m-%d"))
        
        # Limpiar caracteres problemáticos que pueden causar problemas de redirección
        content = content.replace('\r\n', '\n').replace('\r', '\n')
        
        return content, slug
    
    def create_mdx_file(self, content, slug):
        """Crear archivo MDX"""
        filename = f"{slug}.mdx"
        filepath = self.posts_dir / filename
        
        # Verificar si el archivo ya existe
        if filepath.exists():
            print(f"⚠️  El archivo {filename} ya existe, saltando...")
            return False
        
        # Asegurar que el directorio existe
        self.posts_dir.mkdir(parents=True, exist_ok=True)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Creado: {filename}")
            return True
        except Exception as e:
            print(f"❌ Error creando {filename}: {e}")
            return False
    
    def run(self):
        """Ejecutar el scraper"""
        print("🚀 Iniciando scraper de noticias de desarrollo...")
        
        # Cargar noticias ya procesadas
        processed = self.load_processed_news()
        
        # Obtener nuevas noticias
        news_items = self.fetch_rss_news()
        
        # Filtrar noticias ya procesadas
        new_news = []
        for item in news_items:
            # Crear hash único para la noticia
            news_hash = hashlib.md5(f"{item['title']}{item['url']}".encode()).hexdigest()
            
            if news_hash not in processed:
                new_news.append((item, news_hash))
        
        print(
            f"📊 Encontradas {len(new_news)} noticias nuevas (no estaban en processed_news.json; "
            f"{len(processed)} hashes ya procesados)"
        )

        # Procesar hasta max_posts_per_run noticias por ejecución
        created_count = 0
        for item, news_hash in new_news[:self.max_posts_per_run]:
            try:
                content, slug = self.generate_mdx_content(item)
                
                if self.create_mdx_file(content, slug):
                    processed.add(news_hash)
                    created_count += 1
                    
            except Exception as e:
                print(f"❌ Error procesando noticia: {e}")
                continue
        
        # Guardar noticias procesadas
        self.save_processed_news(processed)
        
        print(f"🎉 Proceso completado. Se crearon {created_count} nuevos posts.")
        return created_count > 0

if __name__ == "__main__":
    scraper = NewsScraper()
    scraper.run()
