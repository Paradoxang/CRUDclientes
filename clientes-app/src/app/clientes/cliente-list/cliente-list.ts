import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteApi } from '../../services/cliente-api';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css'
})
export class ClienteList implements OnInit {
  private api = inject(ClienteApi);

  clientes = signal<Cliente[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  // Modal de confirmación
  clienteAEliminar = signal<Cliente | null>(null);
  eliminando = signal(false);

  // Bonus: búsqueda, filtro y paginación
  buscar = '';
  filtroActivo: string = '';          // '', 'true' o 'false'
  pagina = signal(1);
  tamanoPagina = 5;
  totalPaginas = signal(1);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    // Convierte el filtro de texto a booleano (o null si está vacío)
    let activo: boolean | null = null;
    if (this.filtroActivo === 'true') activo = true;
    if (this.filtroActivo === 'false') activo = false;

    this.api.listar(this.buscar, activo, this.pagina(), this.tamanoPagina).subscribe({
      next: (resultado) => {
        this.clientes.set(resultado.datos);
        this.totalPaginas.set(resultado.totalPaginas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los clientes. ¿Está corriendo la API?');
        this.cargando.set(false);
      }
    });
  }

  // Al buscar o filtrar, siempre volvemos a la página 1
  aplicarFiltros(): void {
    this.pagina.set(1);
    this.cargar();
  }

  paginaAnterior(): void {
    if (this.pagina() > 1) {
      this.pagina.set(this.pagina() - 1);
      this.cargar();
    }
  }

  paginaSiguiente(): void {
    if (this.pagina() < this.totalPaginas()) {
      this.pagina.set(this.pagina() + 1);
      this.cargar();
    }
  }

  pedirConfirmacion(cliente: Cliente): void {
    this.clienteAEliminar.set(cliente);
  }

  cancelarEliminar(): void {
    this.clienteAEliminar.set(null);
  }

  confirmarEliminar(): void {
    const cliente = this.clienteAEliminar();
    if (!cliente) return;
    this.eliminando.set(true);
    this.api.eliminar(cliente.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.clienteAEliminar.set(null);
        this.cargar();
      },
      error: () => {
        this.eliminando.set(false);
        this.error.set('No se pudo eliminar el cliente.');
        this.clienteAEliminar.set(null);
      }
    });
  }
}