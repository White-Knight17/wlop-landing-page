import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AliceComponent } from './components/alice/alice.component';
import { FiamaComponent } from './components/fiama/fiama.component';
import { MicaComponent } from './components/mica/mica.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { FooterComponent } from './components/footer/footer.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AliceComponent,
    FiamaComponent,
    MicaComponent,
    CarrouselComponent,
    ContactoComponent,
    FooterComponent,
  ],
  template: `
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    <app-navbar></app-navbar>
    <main id="main-content">
      <div class="scroll-container">
        <section #section class="section-item" id="section-hero">
          <app-hero></app-hero>
        </section>
        <section #section class="section-item pinned" id="section-alice">
          <app-alice></app-alice>
        </section>
        <section #section class="section-item pinned" id="section-fiama">
          <app-fiama></app-fiama>
        </section>
        <section #section class="section-item pinned" id="section-mica">
          <app-mica></app-mica>
        </section>
        <section #section class="section-item" id="section-galeria">
          <app-carrousel></app-carrousel>
        </section>
        <section #section class="section-item" id="section-contacto">
          <app-contacto></app-contacto>
        </section>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChildren('section') sections!: QueryList<ElementRef>;
  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'WLOP',
        url: 'https://wlop.art/',
      });
      this.document.head.appendChild(script);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initLenis();
      setTimeout(() => this.setupAnimations(), 300);
    }
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
  }

  private initLenis() {
    this.lenis = new Lenis({
      duration: 0.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }

  private setupAnimations() {
    // PINNING en personajes
    const pinnedIds = ['section-alice', 'section-fiama', 'section-mica'];
    this.sections.forEach((ref) => {
      const section = ref.nativeElement;
      if (pinnedIds.includes(section.id)) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          scrub: false,
        });
      }
    });

    // GALERÍA animation
    const galeria = document.getElementById('section-galeria');
    if (galeria) {
      const title = galeria.querySelector('h2');
      const desktopItems = galeria.querySelectorAll('.parallelogram-item');
      const mobileItems = galeria.querySelectorAll('.gallery-item');
      const items = [...desktopItems, ...mobileItems];

      if (title) {
        gsap.from(title, {
          opacity: 0,
          scale: 0.5,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: galeria,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      if (items.length > 0) {
        gsap.from(items, {
          opacity: 0,
          y: 50,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galeria,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }

    // CONTACTO animation
    const contacto = document.getElementById('section-contacto');
    if (contacto) {
      const ctitle = contacto.querySelector('h2');
      const cform = contacto.querySelector('form');

      if (ctitle) {
        gsap.from(ctitle, {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contacto,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
      if (cform) {
        gsap.from(cform, {
          opacity: 0,
          x: -30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contacto,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }
  }
}
