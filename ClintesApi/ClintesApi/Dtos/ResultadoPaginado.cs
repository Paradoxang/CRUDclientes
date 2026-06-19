namespace ClientesApi.Dtos;

public class ResultadoPaginado<T>
{
    public List<T> Datos { get; set; } = new();
    public int Pagina { get; set; }
    public int TamanoPagina { get; set; }
    public int TotalRegistros { get; set; }
    public int TotalPaginas { get; set; }
}