using System.ComponentModel.DataAnnotations;

namespace ClientesApi.Dtos;

public class ClienteInputDto
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio.")]
    [MaxLength(100)]
    public string Apellido { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es obligatorio.")]
    [MaxLength(30)]
    public string Telefono { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo es obligatorio.")]
    [EmailAddress(ErrorMessage = "El correo no es válido.")]
    [MaxLength(150)]
    public string Correo { get; set; } = string.Empty;

    public DateTime FechaNacimiento { get; set; }

    public bool Activo { get; set; } = true;
}