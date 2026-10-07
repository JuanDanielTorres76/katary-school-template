namespace KataryApi.Models;

// Un libro de Páginas Vivas: Name = título, Category = género, Price = venta o préstamo.
// Rating: calificación de los lectores, de 1 a 5.
public record Item(int Id, string Name, string Description, string Category, decimal Price, double Rating);
