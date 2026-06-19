import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, ClienteInput, ResultadoPaginado } from '../models/cliente';

@Injectable({ providedIn: 'root' })
export class ClienteApi {
  private http = inject(HttpClient);

  // 
  private baseUrl = 'https://localhost:7021/api/Clientes';

  listar(buscar?: string, activo?: boolean | null,
         pagina: number = 1, tamanoPagina: number = 10): Observable<ResultadoPaginado<Cliente>> {
    let params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanoPagina', tamanoPagina);
    if (buscar) params = params.set('buscar', buscar);
    if (activo !== null && activo !== undefined) params = params.set('activo', activo);

    return this.http.get<ResultadoPaginado<Cliente>>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  crear(cliente: ClienteInput): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente);
  }

  actualizar(id: number, cliente: ClienteInput): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, cliente);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}