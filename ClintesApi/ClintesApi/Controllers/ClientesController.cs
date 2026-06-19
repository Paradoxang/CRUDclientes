using ClientesApi.Data;
using ClientesApi.Dtos;
using ClientesApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClientesApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/clientes  -> Listar todos
    [HttpGet]
    public async Task<ActionResult<ResultadoPaginado<ClienteDto>>> GetClientes(
    [FromQuery] string? buscar = null,
    [FromQuery] bool? activo = null,
    [FromQuery] int pagina = 1,
    [FromQuery] int tamanoPagina = 10)
    {
        if (pagina < 1) pagina = 1;
        if (tamanoPagina < 1) tamanoPagina = 10;

        var query = _context.Clientes.AsQueryable();

        // Bonus: filtro por activo / inactivo
        if (activo.HasValue)
            query = query.Where(c => c.Activo == activo.Value);

        // Bonus: búsqueda por nombre, apellido o correo
        if (!string.IsNullOrWhiteSpace(buscar))
        {
            var texto = buscar.Trim().ToLower();
            query = query.Where(c =>
                c.Nombre.ToLower().Contains(texto) ||
                c.Apellido.ToLower().Contains(texto) ||
                c.Correo.ToLower().Contains(texto));
        }

        var totalRegistros = await query.CountAsync();

        var clientes = await query
            .OrderByDescending(c => c.FechaCreacion)
            .Skip((pagina - 1) * tamanoPagina)   // Bonus: paginación
            .Take(tamanoPagina)
            .ToListAsync();

        return Ok(new ResultadoPaginado<ClienteDto>
        {
            Datos = clientes.Select(ToDto).ToList(),
            Pagina = pagina,
            TamanoPagina = tamanoPagina,
            TotalRegistros = totalRegistros,
            TotalPaginas = (int)Math.Ceiling(totalRegistros / (double)tamanoPagina)
        });
    }

    // GET: api/clientes/5  -> Ver detalle
    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null)
            return NotFound(new { mensaje = "Cliente no encontrado." });

        return Ok(ToDto(cliente));
    }

    // POST: api/clientes  -> Crear
    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CrearCliente(ClienteInputDto dto)
    {
       
        bool correoExiste = await _context.Clientes.AnyAsync(c => c.Correo == dto.Correo);
        if (correoExiste)
            return BadRequest(new { mensaje = "Ya existe un cliente con ese correo." });

        var cliente = new Cliente
        {
            Nombre = dto.Nombre.Trim(),
            Apellido = dto.Apellido.Trim(),
            Telefono = dto.Telefono.Trim(),
            Correo = dto.Correo.Trim(),
            FechaNacimiento = dto.FechaNacimiento,
            Activo = dto.Activo,
            FechaCreacion = DateTime.Now
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, ToDto(cliente));
    }

    // PUT: api/clientes/5  -> Editar
    [HttpPut("{id}")]
    public async Task<IActionResult> EditarCliente(int id, ClienteInputDto dto)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null)
            return NotFound(new { mensaje = "Cliente no encontrado." });

        
        bool correoExiste = await _context.Clientes
            .AnyAsync(c => c.Correo == dto.Correo && c.Id != id);
        if (correoExiste)
            return BadRequest(new { mensaje = "Ya existe otro cliente con ese correo." });

        cliente.Nombre = dto.Nombre.Trim();
        cliente.Apellido = dto.Apellido.Trim();
        cliente.Telefono = dto.Telefono.Trim();
        cliente.Correo = dto.Correo.Trim();
        cliente.FechaNacimiento = dto.FechaNacimiento;
        cliente.Activo = dto.Activo;

        await _context.SaveChangesAsync();
        return Ok(ToDto(cliente));
    }

    // DELETE: api/clientes/5  -> Eliminar
    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarCliente(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null)
            return NotFound(new { mensaje = "Cliente no encontrado." });

        _context.Clientes.Remove(cliente);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Convierte la entidad en DTO de salida
    private static ClienteDto ToDto(Cliente c) => new ClienteDto
    {
        Id = c.Id,
        Nombre = c.Nombre,
        Apellido = c.Apellido,
        Telefono = c.Telefono,
        Correo = c.Correo,
        FechaNacimiento = c.FechaNacimiento,
        Activo = c.Activo,
        FechaCreacion = c.FechaCreacion
    };
}