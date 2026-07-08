import { Component, HostListener, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  scrolled = signal(false);

  menuItems = [
    { label: 'Arte', id: 'section-alice' },
    { label: 'Galeria', id: 'section-galeria' },
    { label: 'Contacto', id: 'section-contacto' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrolled.set(window.scrollY > 50);
  }

  scrollTo(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      // Use native smooth scrolling — Lenis will intercept and smooth it
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  }
}
