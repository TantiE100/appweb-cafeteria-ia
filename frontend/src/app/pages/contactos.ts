import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CafeteriaService } from '../core/services/cafeteria.service';
import { ContactosService } from '../core/services/contactos.service';
import { cargar } from '../core/util/cargar';
import { EstadoCarga } from '../shared/estado-carga';

type Estado = 'inactivo' | 'enviando' | 'exito' | 'error';

@Component({
  selector: 'app-contactos',
  imports: [ReactiveFormsModule, EstadoCarga],
  template: `
    <div class="pagina">
      <h1 class="titulo-seccion mb-12" appReveal>Contactos</h1>
      <div class="grid gap-12 lg:grid-cols-3">
        <form class="space-y-5 lg:col-span-2" [formGroup]="form" (ngSubmit)="enviar()" novalidate>
          <div>
            <label for="nombre" class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-oro">Nombre</label>
            <input id="nombre" type="text" class="campo" formControlName="nombre" autocomplete="name" />
            @if (invalido('nombre')) {
              <p class="mt-1 text-xs text-red-400">Ingresa tu nombre.</p>
            }
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="email" class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-oro">Email</label>
              <input id="email" type="email" class="campo" formControlName="email" autocomplete="email" />
              @if (invalido('email')) {
                <p class="mt-1 text-xs text-red-400">Ingresa un email válido.</p>
              }
            </div>
            <div>
              <label for="telefono" class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-oro">Teléfono (opcional)</label>
              <input id="telefono" type="tel" class="campo" formControlName="telefono" autocomplete="tel" />
            </div>
          </div>
          <div>
            <label for="mensaje" class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-oro">Mensaje</label>
            <textarea id="mensaje" rows="6" class="campo resize-y" formControlName="mensaje"></textarea>
            @if (invalido('mensaje')) {
              <p class="mt-1 text-xs text-red-400">Escribe un mensaje de al menos 5 caracteres.</p>
            }
          </div>

          @if (estado() === 'exito') {
            <p class="border border-oro/50 bg-oro/10 p-4 text-sm text-oro-claro">{{ confirmacion() }}</p>
          }
          @if (estado() === 'error') {
            <div class="border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
              <p class="font-semibold">{{ errorGeneral() }}</p>
              @if (detalles().length) {
                <ul class="mt-2 list-disc pl-5">
                  @for (d of detalles(); track d) {
                    <li>{{ d }}</li>
                  }
                </ul>
              }
            </div>
          }

          <button type="submit" class="btn-oro" [disabled]="estado() === 'enviando'">
            {{ estado() === 'enviando' ? 'Enviando…' : 'Enviar mensaje' }}
          </button>
        </form>

        <aside class="h-fit space-y-5 border border-borde bg-superficie p-8 text-sm">
          <app-estado-carga [cargando]="cafeteria.cargando()" [error]="cafeteria.error()" />
          @if (cafeteria.datos(); as c) {
            <div>
              <p class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Dirección</p>
              <p>{{ c.direccion }}</p>
            </div>
            <div>
              <p class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Teléfono</p>
              <p>{{ c.telefono }}</p>
            </div>
            <div>
              <p class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Email</p>
              <p class="break-all">{{ c.email }}</p>
            </div>
            <div>
              <p class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oro">Horario</p>
              <p class="whitespace-pre-line">{{ c.horario }}</p>
            </div>
          }
        </aside>
      </div>
    </div>
  `,
})
export class Contactos {
  private readonly contactos = inject(ContactosService);
  protected readonly cafeteria = cargar(inject(CafeteriaService).cafeteria$);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    mensaje: ['', [Validators.required, Validators.minLength(5)]],
  });

  protected readonly estado = signal<Estado>('inactivo');
  protected readonly confirmacion = signal('');
  protected readonly errorGeneral = signal('');
  protected readonly detalles = signal<string[]>([]);

  protected invalido(campo: 'nombre' | 'email' | 'mensaje'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, email, telefono, mensaje } = this.form.getRawValue();
    this.estado.set('enviando');
    this.detalles.set([]);

    this.contactos
      .enviar({ nombre, email, mensaje, ...(telefono.trim() ? { telefono: telefono.trim() } : {}) })
      .subscribe({
        next: (r) => {
          this.confirmacion.set(r.mensaje);
          this.estado.set('exito');
          this.form.reset();
        },
        error: (e: HttpErrorResponse) => {
          const cuerpo = e.error;
          this.errorGeneral.set(
            typeof cuerpo?.error === 'string' && cuerpo.error
              ? cuerpo.error
              : 'No se pudo enviar el mensaje. Intenta nuevamente.',
          );
          this.detalles.set(Array.isArray(cuerpo?.detalles) ? cuerpo.detalles : []);
          this.estado.set('error');
        },
      });
  }
}
