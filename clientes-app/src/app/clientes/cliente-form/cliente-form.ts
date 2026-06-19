import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClienteApi } from '../../services/cliente-api';
import { ClienteInput } from '../../models/cliente';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteForm implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ClienteApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clienteId = signal<number | null>(null);
  guardando = signal(false);
  errorServidor = signal<string | null>(null);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    telefono: ['', [Validators.required, Validators.maxLength(30)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    fechaNacimiento: ['', [Validators.required]],
    activo: [true]
  });

  ngOnInit(): void {
    // Si la ruta trae un id, estamos editando: cargamos el cliente
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.clienteId.set(id);
      this.api.obtener(id).subscribe({
        next: (cliente) => {
          this.form.patchValue({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            telefono: cliente.telefono,
            correo: cliente.correo,
            fechaNacimiento: cliente.fechaNacimiento?.substring(0, 10), // yyyy-MM-dd
            activo: cliente.activo
          });
        },
        error: () => this.errorServidor.set('No se pudo cargar el cliente.')
      });
    }
  }

  get esEdicion(): boolean {
    return this.clienteId() !== null;
  }

  guardar(): void {
    this.errorServidor.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // fuerza a mostrar los mensajes de error
      return;
    }

    this.guardando.set(true);
    const datos: ClienteInput = {
      nombre: this.form.value.nombre!,
      apellido: this.form.value.apellido!,
      telefono: this.form.value.telefono!,
      correo: this.form.value.correo!,
      fechaNacimiento: this.form.value.fechaNacimiento!,
      activo: this.form.value.activo!
    };

    const peticion = this.esEdicion
      ? this.api.actualizar(this.clienteId()!, datos)
      : this.api.crear(datos);

    peticion.subscribe({
      next: () => this.router.navigate(['/clientes']),
      error: (err) => {
        this.guardando.set(false);
        // El backend manda { mensaje: "..." } cuando el correo está duplicado
        this.errorServidor.set(err?.error?.mensaje ?? 'Ocurrió un error al guardar.');
      }
    });
  }
}