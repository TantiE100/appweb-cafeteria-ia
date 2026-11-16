import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactosService } from '../core/services/contactos.service';
import { SitioService } from '../core/services/sitio.service';
import { Icono } from '../shared/icono';
import { Reveal } from '../shared/reveal';

type Estado = 'inactivo' | 'enviando' | 'exito' | 'error';

@Component({
  selector: 'app-contactos',
  imports: [ReactiveFormsModule, Icono, Reveal],
  template: `
    <div class="pagina">
      <header class="encabezado" appReveal>
        <h1 class="titulo-seccion">{{ t('contactos.titulo') }}</h1>
        <p class="subtitulo">{{ t('contactos.subtitulo') }}</p>
      </header>
      <div class="grid gap-10 lg:grid-cols-3">
        <form class="tarjeta space-y-5 p-7 lg:col-span-2" [formGroup]="form" (ngSubmit)="enviar()" novalidate>
          <div>
            <label for="nombre" class="etiqueta-campo">{{ t('contactos.nombre') }}</label>
            <input id="nombre" type="text" class="campo" [class.campo-error]="invalido('nombre')" formControlName="nombre" autocomplete="name" [placeholder]="t('contactos.ph.nombre')" />
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="email" class="etiqueta-campo">{{ t('contactos.email') }}</label>
              <input id="email" type="email" class="campo" [class.campo-error]="invalido('email')" formControlName="email" autocomplete="email" [placeholder]="t('contactos.ph.email')" />
            </div>
            <div>
              <label for="telefono" class="etiqueta-campo">{{ t('contactos.telefono') }}</label>
              <input id="telefono" type="tel" class="campo" formControlName="telefono" autocomplete="tel" [placeholder]="t('contactos.ph.telefono')" />
            </div>
          </div>
          <div>
            <label for="mensaje" class="etiqueta-campo">{{ t('contactos.mensaje') }}</label>
            <textarea id="mensaje" rows="6" class="campo resize-y" [class.campo-error]="invalido('mensaje')" formControlName="mensaje" [placeholder]="t('contactos.ph.mensaje')"></textarea>
          </div>

          @if (estado() === 'exito') {
            <p class="flex items-center gap-3 rounded-xl border border-oro/40 bg-oro/10 p-4 text-sm text-oro-claro">
              <app-icono nombre="check" [tamano]="18" />
              {{ confirmacion() }}
            </p>
          }
          @if (estado() === 'error') {
            <div class="rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-300">
              <p class="flex items-center gap-3 font-medium">
                <app-icono nombre="circle-alert" [tamano]="18" />
                {{ errorGeneral() }}
              </p>
              @if (detalles().length) {
                <ul class="mt-2 list-disc pl-10">
                  @for (d of detalles(); track d) {
                    <li>{{ d }}</li>
                  }
                </ul>
              }
            </div>
          }

          <button type="submit" class="btn-oro" [disabled]="estado() === 'enviando'">
            <app-icono nombre="arrow-right" [tamano]="16" />
            {{ estado() === 'enviando' ? t('contactos.enviando') : t('contactos.enviar') }}
          </button>
        </form>

        @if (sitio.cafeteria(); as c) {
          <aside class="tarjeta h-fit space-y-5 p-7 text-sm">
            @for (f of filas(c); track f.icono) {
              <div class="flex gap-3">
                <span class="mt-0.5 text-oro"><app-icono [nombre]="f.icono" [tamano]="17" /></span>
                <div class="min-w-0">
                  <p class="mb-0.5 text-xs font-medium text-suave">{{ t(f.clave) }}</p>
                  <p class="whitespace-pre-line break-words">{{ f.valor }}</p>
                </div>
              </div>
            }
          </aside>
        }
      </div>
    </div>
  `,
})
export class Contactos {
  private readonly contactos = inject(ContactosService);
  protected readonly sitio = inject(SitioService);
  protected readonly t = this.sitio.t;

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

  protected filas(c: { direccion: string; telefono: string; email: string; horario: string }) {
    return [
      { icono: 'map-pin', clave: 'nosotros.direccion', valor: c.direccion },
      { icono: 'phone', clave: 'nosotros.telefono', valor: c.telefono },
      { icono: 'mail', clave: 'nosotros.email', valor: c.email },
      { icono: 'clock', clave: 'nosotros.horario', valor: c.horario },
    ];
  }

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
          this.confirmacion.set(this.t('contactos.exito') || r.mensaje);
          this.estado.set('exito');
          this.form.reset();
        },
        error: (e: HttpErrorResponse) => {
          const cuerpo = e.error;
          this.errorGeneral.set(
            typeof cuerpo?.error === 'string' && cuerpo.error ? cuerpo.error : this.t('contactos.error'),
          );
          this.detalles.set(Array.isArray(cuerpo?.detalles) ? cuerpo.detalles : []);
          this.estado.set('error');
        },
      });
  }
}
