import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ClienteApi } from '../../services/cliente-api';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-cliente-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './cliente-detail.html',
  styleUrl: './cliente-detail.css'
})
export class ClienteDetail implements OnInit {
  private api = inject(ClienteApi);
  private route = inject(ActivatedRoute);

  cliente = signal<Cliente | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.obtener(id).subscribe({
      next: (c) => { this.cliente.set(c); this.cargando.set(false); },
      error: () => { this.error.set('No se pudo cargar el cliente.'); this.cargando.set(false); }
    });
  }
}