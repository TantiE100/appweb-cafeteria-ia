import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  host: { class: 'inline-flex items-center' },
  template: `
    <svg
      [attr.height]="alto()"
      [attr.width]="alto()"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-oro"
      aria-hidden="true"
    >
      <path d="M17 4.5c-2.6 2-2.6 4 0 6s2.6 3.5 0 5.5" />
      <path d="M23 4.5c-2.6 2-2.6 4 0 6s2.6 3.5 0 5.5" />
      <path d="M8 19h19v6a8 8 0 0 1-8 8h-3a8 8 0 0 1-8-8z" />
      <path d="M27 21h1.5a3.5 3.5 0 0 1 0 7H26" />
      <path d="M10 37h15" />
    </svg>
    <span class="ml-3 flex flex-col leading-none">
      <span class="font-semibold tracking-tight text-texto" [style.font-size.px]="alto() * 0.5">{{ principal() }}</span>
      @if (secundario()) {
        <span
          class="mt-1 font-medium uppercase tracking-[0.35em] text-suave"
          [style.font-size.px]="alto() * 0.22"
        >{{ secundario() }}</span>
      }
    </span>
  `,
})
export class Logo {
  readonly nombre = input('');
  readonly alto = input(32);

  private readonly partes = computed(() => {
    const [primera, ...resto] = this.nombre().trim().split(/\s+/);
    return { principal: primera ?? '', secundario: resto.join(' ') };
  });
  protected readonly principal = computed(() => this.partes().principal);
  protected readonly secundario = computed(() => this.partes().secundario);
}
