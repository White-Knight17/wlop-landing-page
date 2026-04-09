# WLOP Portfolio - Landing Page

Portfolio profesional para el artista digital WLOP, showcasing su trabajo con animaciones avanzadas y una experiencia visual inmersiva.

## 🛠️ Tecnologías

| Tecnología               | Propósito                               |
| ------------------------ | --------------------------------------- |
| **Angular 21**           | Framework con Standalone Components     |
| **TypeScript**           | Tipado estricto                         |
| **GSAP + ScrollTrigger** | Animaciones avanzadas basadas en scroll |
| **Lenis**                | Smooth scroll para experiencia fluida   |
| **Font Awesome**         | Iconos (ArtStation)                     |

## 🎯 Highlights del Proyecto

### Animaciones GSAP Avanzadas

- **Pinned Sections** — Alice, Fiama y Mica se fijan durante el scroll con transiciones fluidas
- **Stagger Effects** — Las imágenes de la galería aparecen con delays escalonados
- **ScrollTrigger** — Animaciones que se ejecutan al entrar en viewport
- **Parallax** — Efecto de profundidad en el hero

### Smooth Scroll con Lenis

- Experiencia de scroll premium y fluida
- Configuración personalizada para evitar conflictos con GSAP

### Modal Interactivo

- Transiciones de barrido (slide animations)
- Navegación por teclado (Escape, Flechas)
- Click fuera para cerrar
- Diseño responsive (desktop/mobile)

### Performance

- **WebP** — Todas las imágenes convertidas (~60% más liviano)
- **Lazy loading** — Imágenes y rutas optimizadas

### UX/UI

- Diseño con estética dorada (#d4af37)
- Efectos hover con glow dorado
- Glassmorphism en el navbar
- Partículas flotantes en el hero (Canvas)
- Responsive completo (Mobile → Tablet → Desktop)

### SEO & Accesibilidad

- Meta tags, Open Graph, Twitter Cards
- JSON-LD Schema
- Skip link para navegación por teclado
- ARIA labels y roles
- Focus visible personalizado
- Formulario con validación

## 📁 Estructura

```
src/
├── app/
│   ├── components/
│   │   ├── alice/          # Pinned section
│   │   ├── carrousel/      # Galería + Modal
│   │   ├── contacto/       # Formulario
│   │   ├── fiama/          # Pinned section
│   │   ├── footer/         # Disclaimer + ArtStation
│   │   ├── hero/           # Partículas + blur
│   │   ├── mica/           # Pinned section
│   │   └── navbar/         # Navigation
│   ├── app.ts              # GSAP + Lenis setup
│   └── app.css             # Estilos globales
├── assets/                 # Imágenes WebP
├── index.html              # SEO meta tags
└── manifest.json           # PWA
```

## 🚀 Ejecución

```bash
npm install
ng serve
```

## 📝 Notas Legales

- Todas las ilustraciones son propiedad de **WLOP**
- Esta página es una **demo** de habilidades frontend
- No se obtiene ningún beneficio económico
- ArtStation: https://www.artstation.com/wlop

---

**Demo de portfolio** — Angular 21 + GSAP + Lenis
