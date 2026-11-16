import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AccionChat, OpcionCafe, OpcionesCafe } from '../core/models/chat.model';
import { Imagen } from '../shared/imagen';

@Component({
  selector: 'app-chat-accion',
  imports: [DecimalPipe, Imagen],
  template: `
    @let a = accion();
    <div class="border border-borde bg-fondo text-xs">
      @switch (a.tipo) {
        @case ('menu') {
          @for (grupo of a.datos; track grupo.categoria) {
            <details class="border-b border-borde last:border-b-0" open>
              <summary class="flex cursor-pointer items-center justify-between px-3 py-2 font-semibold uppercase tracking-widest text-oro">
                {{ grupo.categoria }}
                <span class="text-suave">{{ grupo.productos.length }}</span>
              </summary>
              <ul class="space-y-2 px-3 pb-3">
                @for (p of grupo.productos; track p.id) {
                  <li class="flex items-baseline justify-between gap-3">
                    <span>
                      <span class="font-medium text-texto">{{ p.nombre }}</span>
                      <span class="block text-suave">{{ p.descripcion }}</span>
                    </span>
                    <span class="whitespace-nowrap text-oro">Bs {{ p.precio | number: '1.2-2' }}</span>
                  </li>
                }
              </ul>
            </details>
          }
        }
        @case ('productos') {
          <ul class="space-y-2 p-3">
            @for (p of a.datos; track p.id) {
              <li class="flex items-baseline justify-between gap-3">
                <span>
                  <span class="font-medium text-texto">{{ p.nombre }}</span>
                  <span class="block text-suave">{{ p.categoria }} · {{ p.descripcion }}</span>
                </span>
                <span class="whitespace-nowrap text-oro">Bs {{ p.precio | number: '1.2-2' }}</span>
              </li>
            }
          </ul>
        }
        @case ('especialidades') {
          <div class="grid grid-cols-2 gap-2 p-2">
            @for (e of a.datos; track e.id) {
              <div class="border border-borde bg-superficie">
                <div class="h-20">
                  <app-imagen [src]="e.imagen" [nombre]="e.nombre" />
                </div>
                <div class="p-2">
                  <p class="font-medium text-texto">{{ e.nombre }}</p>
                  <p class="text-oro">Bs {{ e.precio | number: '1.2-2' }}</p>
                </div>
              </div>
            }
          </div>
        }
        @case ('pedido') {
          <div class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-suave">Pedido</p>
                <p class="text-2xl font-bold tracking-widest text-texto">{{ a.datos.codigo }}</p>
              </div>
              <span class="border border-oro px-2 py-1 font-semibold uppercase tracking-widest text-oro">{{ a.datos.estado }}</span>
            </div>
            <p class="mt-1 text-suave">{{ a.datos.cliente }} · {{ a.datos.creado_en }}</p>
            <ul class="mt-3 space-y-2 border-y border-dashed border-borde py-3">
              @for (i of a.datos.items; track $index) {
                <li class="flex justify-between gap-3">
                  <span>
                    {{ i.cantidad }} × {{ i.producto }}
                    @if (i.detalle) {
                      <span class="block text-suave">{{ i.detalle }}</span>
                    }
                  </span>
                  <span class="whitespace-nowrap">Bs {{ i.subtotal | number: '1.2-2' }}</span>
                </li>
              }
            </ul>
            <p class="mt-3 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span class="text-oro">Bs {{ a.datos.total | number: '1.2-2' }}</span>
            </p>
          </div>
        }
        @case ('reserva') {
          <div class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-suave">Reserva</p>
                <p class="text-2xl font-bold tracking-widest text-texto">{{ a.datos.codigo }}</p>
              </div>
              <span class="border border-oro px-2 py-1 font-semibold uppercase tracking-widest text-oro">{{ a.datos.estado }}</span>
            </div>
            <dl class="mt-3 grid grid-cols-2 gap-3">
              <div><dt class="text-suave">Nombre</dt><dd>{{ a.datos.nombre }}</dd></div>
              <div><dt class="text-suave">Personas</dt><dd>{{ a.datos.personas }}</dd></div>
              <div><dt class="text-suave">Fecha</dt><dd>{{ a.datos.fecha }}</dd></div>
              <div><dt class="text-suave">Hora</dt><dd>{{ a.datos.hora }}</dd></div>
            </dl>
          </div>
        }
        @case ('info') {
          <dl class="space-y-2 p-3">
            <div><dt class="text-oro">Dirección</dt><dd>{{ a.datos.direccion }}</dd></div>
            <div><dt class="text-oro">Teléfono</dt><dd>{{ a.datos.telefono }}</dd></div>
            <div><dt class="text-oro">Horario</dt><dd class="whitespace-pre-line">{{ a.datos.horario }}</dd></div>
            <div><dt class="text-oro">Email</dt><dd class="break-all">{{ a.datos.email }}</dd></div>
          </dl>
        }
        @case ('servicios') {
          <ul class="space-y-2 p-3">
            @for (s of a.datos; track s.id) {
              <li class="flex gap-3">
                <span class="text-lg">{{ s.icono }}</span>
                <span>
                  <span class="font-medium text-texto">{{ s.nombre }}</span>
                  <span class="block text-suave">{{ s.descripcion }}</span>
                </span>
              </li>
            }
          </ul>
        }
        @case ('opciones') {
          <div class="space-y-3 p-3">
            @for (grupo of grupos(a.datos); track grupo.titulo) {
              @if (grupo.items.length) {
                <div>
                  <p class="mb-1 font-semibold uppercase tracking-widest text-oro">{{ grupo.titulo }}</p>
                  <ul class="space-y-1">
                    @for (o of grupo.items; track o.id) {
                      <li class="flex justify-between gap-3">
                        <span>{{ o.nombre }}</span>
                        <span class="text-suave">{{ o.precio_extra > 0 ? '+ Bs ' + (o.precio_extra | number: '1.2-2') : 'Incluido' }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }
            }
          </div>
        }
      }
    </div>
  `,
})
export class ChatAccion {
  readonly accion = input.required<AccionChat>();

  protected grupos(d: OpcionesCafe): { titulo: string; items: OpcionCafe[] }[] {
    return [
      { titulo: 'Tamaños', items: d.tamanos ?? [] },
      { titulo: 'Bases', items: d.bases ?? [] },
      { titulo: 'Leches', items: d.leches ?? [] },
      { titulo: 'Extras', items: d.extras ?? [] },
      { titulo: 'Endulzantes', items: d.endulzantes ?? [] },
    ];
  }
}
