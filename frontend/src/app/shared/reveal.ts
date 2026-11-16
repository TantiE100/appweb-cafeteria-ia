import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class Reveal implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;
  readonly appReveal = input<number | string>(0);

  ngOnInit(): void {
    const retraso = Number(this.appReveal()) || 0;
    this.el.style.setProperty('--retraso', `${retraso}ms`);
    if (typeof IntersectionObserver === 'undefined') {
      this.el.classList.add('visible');
      return;
    }
    this.observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          this.el.classList.add('visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(this.el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
