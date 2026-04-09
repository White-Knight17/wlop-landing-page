import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormErrors } from '../../interfaces/form-validation.interface';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  formData = {
    nombre: '',
    mail: '',
    asunto: '',
  };

  errors: FormErrors[] = [];

  onSubmit() {
    this.errors = [];

    // Validate
    if (!this.formData.nombre.trim()) {
      this.errors.push({
        field: 'nombre',
        message: 'El nombre es obligatorio',
        elementId: 'nombre-error',
      });
    }

    if (!this.formData.mail.trim()) {
      this.errors.push({
        field: 'mail',
        message: 'El email es obligatorio',
        elementId: 'mail-error',
      });
    } else if (!this.isValidEmail(this.formData.mail)) {
      this.errors.push({
        field: 'mail',
        message: 'Ingresa un email válido',
        elementId: 'mail-error',
      });
    }

    if (!this.formData.asunto.trim()) {
      this.errors.push({
        field: 'asunto',
        message: 'El asunto es obligatorio',
        elementId: 'asunto-error',
      });
    }

    if (this.errors.length > 0) {
      // Form is invalid - errors are displayed via aria-live
      return;
    }

    // Success - reset form
    console.log('Form submitted:', this.formData);
    this.formData = { nombre: '', mail: '', asunto: '' };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
