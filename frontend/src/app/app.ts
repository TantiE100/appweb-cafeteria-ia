import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanelService } from './core/state/panel.service';
import { Chatbot } from './layout/chatbot';
import { Footer } from './layout/footer';
import { Navbar } from './layout/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Chatbot],
  template: `
    <div class="contenido-principal" [class.con-panel]="panel.abierto()">
      <app-navbar />
      <main class="min-h-[70vh]">
        <router-outlet />
      </main>
      <app-footer />
    </div>
    <app-chatbot />
  `,
})
export class App {
  protected readonly panel = inject(PanelService);
}
