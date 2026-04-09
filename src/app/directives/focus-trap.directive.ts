import {
  Directive,
  Input,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective {
  @Input() active = false;
  @Input() triggerElement: HTMLElement | null = null;
  @Output() closed = new EventEmitter<void>();

  private el = inject(ElementRef);
  private previousFocus: HTMLElement | null = null;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.active) return;

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = this.getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement;

      if (event.shiftKey && current === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && current === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.el.nativeElement.querySelectorAll(selector)) as HTMLElement[];
  }

  private close() {
    this.active = false;
    this.closed.emit();
    if (this.triggerElement) {
      this.triggerElement.focus();
    }
  }
}
