import {
  Component,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  showText = signal(false);
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private canvas: HTMLCanvasElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    setTimeout(() => {
      this.showText.set(true);
    }, 3000);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initParticles();
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initParticles() {
    this.canvas = this.canvasRef?.nativeElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Reduce particles on mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 80;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }

    this.animate();
  }

  private createParticle(): Particle {
    const w = this.canvas?.width ?? window.innerWidth;
    const h = this.canvas?.height ?? window.innerHeight;
    const size = Math.random() * 2 + 0.5;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size,
      alpha: Math.random() * 0.5 + 0.2,
    };
  }

  private resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private animate() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      const w = this.canvas?.width ?? window.innerWidth;
      const h = this.canvas?.height ?? window.innerHeight;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Draw particle
      this.ctx!.beginPath();
      this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx!.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      this.ctx!.fill();

      // Draw connections (subtle)
      this.particles.forEach((p2) => {
        if (p === p2) return;
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.ctx!.beginPath();
          this.ctx!.moveTo(p.x, p.y);
          this.ctx!.lineTo(p2.x, p2.y);
          this.ctx!.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - dist / 100)})`;
          this.ctx!.stroke();
        }
      });
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
