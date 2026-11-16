import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chatbot } from './layout/chatbot';
import { Footer } from './layout/footer';
import { Navbar } from './layout/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Chatbot],
  template: `
    <app-navbar />
    <main class="min-h-[70vh]">
      <router-outlet />
    </main>
    <app-footer />
    <app-chatbot />
  `,
})
export class App {}
