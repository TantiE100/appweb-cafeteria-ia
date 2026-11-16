import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-titulo',
  template: `{{ partes().antes }}@if (partes().destacado) {<em>{{ partes().destacado }}</em>}{{ partes().despues }}`,
})
export class Titulo {
  readonly texto = input.required<string>();
  readonly destacado = input('');

  protected readonly partes = computed(() => {
    const texto = this.texto();
    const destacado = this.destacado();
    const indice = destacado ? texto.indexOf(destacado) : -1;
    if (indice < 0) {
      return { antes: texto, destacado: '', despues: '' };
    }
    return {
      antes: texto.slice(0, indice),
      destacado,
      despues: texto.slice(indice + destacado.length),
    };
  });
}
