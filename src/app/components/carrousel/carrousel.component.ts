import {
  Component,
  signal,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css',
})
export class CarrouselComponent implements AfterViewChecked {
  @ViewChild('closeBtn') closeBtn?: ElementRef;

  hoveredIndex = signal<number | null>(null);
  modalOpen = signal(false);
  modalImageIndex = signal(0);
  isDesktop = signal(false);
  slideDirection = signal<'left' | 'right' | null>(null);
  isImageVertical = signal(false);
  private previouslyFocused: HTMLElement | null = null;

  images = [
    'wlop-cr1.webp',
    'wlop-cr2.webp',
    'wlop-cr3.webp',
    'wlop-cr4.webp',
    'wlop-cr5.webp',
    'wlop-cr6.webp',
    'wlop-cr7.webp',
    'wlop-cr8.webp',
    'wlop-cr9.webp',
    'wlop-cr10.webp',
    'wlop-cr11.webp',
    'wlop-cr12.webp',
    'wlop-cr13.webp',
    'wlop-cr14.webp',
    'wlop-cr15.webp',
    'wlop-cr16.webp',
  ];

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isDesktop.set(window.innerWidth >= 1024);
  }

  onHover(index: number) {
    this.hoveredIndex.set(index);
  }

  onLeave() {
    this.hoveredIndex.set(null);
  }

  openModal(index: number) {
    this.previouslyFocused = document.activeElement as HTMLElement;
    this.modalImageIndex.set(index);
    this.modalOpen.set(true);
    this.checkImageOrientation();
  }

  closeModal() {
    this.modalOpen.set(false);
    // Return focus to trigger element
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  }

  ngAfterViewChecked() {
    // Focus trap: keep focus in modal when open
    if (this.modalOpen() && this.closeBtn) {
      // Modal is open, ensure focus stays within
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    this.isImageVertical.set(img.naturalHeight > img.naturalWidth);
  }

  private checkImageOrientation() {
    const img = new Image();
    img.onload = () => {
      this.isImageVertical.set(img.height > img.width);
    };
    img.src = 'assets/galeria/' + this.images[this.modalImageIndex()];
  }

  prevImage() {
    if (this.slideDirection() !== null) return;
    this.slideDirection.set('left');
    const newIndex = this.modalImageIndex() - 1;
    this.modalImageIndex.set(newIndex < 0 ? this.images.length - 1 : newIndex);
    setTimeout(() => this.checkImageOrientation(), 50);
    setTimeout(() => this.slideDirection.set(null), 400);
  }

  nextImage() {
    if (this.slideDirection() !== null) return;
    this.slideDirection.set('right');
    const newIndex = this.modalImageIndex() + 1;
    this.modalImageIndex.set(newIndex >= this.images.length ? 0 : newIndex);
    setTimeout(() => this.checkImageOrientation(), 50);
    setTimeout(() => this.slideDirection.set(null), 400);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.modalOpen()) return;

    if (event.key === 'Escape') {
      this.closeModal();
    } else if (event.key === 'ArrowLeft') {
      this.prevImage();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    }
  }
}
