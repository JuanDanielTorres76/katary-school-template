using System.Collections.Concurrent;
using KataryApi.Models;

namespace KataryApi.Data;

// Almacén en memoria: se reinicia cada vez que corres la API.
// Reto para casa: reemplázalo por una base de datos con Entity Framework Core.
public class ItemStore
{
    private readonly ConcurrentDictionary<int, Item> _items = new();
    private int _nextId;

    public ItemStore()
    {
        // Libros de ejemplo de Páginas Vivas.
        Seed(new Item(0, "Cien años de soledad", "La historia de la familia Buendía en el pueblo de Macondo.", "Realismo mágico", 65000, 4.8));
        Seed(new Item(0, "El principito", "Un pequeño príncipe viaja por planetas y descubre lo esencial.", "Fábula", 32000, 4.7));
        Seed(new Item(0, "1984", "Un futuro donde el Gran Hermano vigila cada paso.", "Ciencia ficción", 48000, 4.6));
        Seed(new Item(0, "El nombre del viento", "Kvothe cuenta su vida, desde artista itinerante hasta leyenda.", "Fantasía", 15000, 4.5));
        Seed(new Item(0, "Sapiens", "Una breve historia de la humanidad, de cazadores a la era digital.", "Divulgación", 12000, 4.3));
    }

    public IEnumerable<Item> GetAll() => _items.Values.OrderBy(i => i.Id);

    public Item? Get(int id) => _items.GetValueOrDefault(id);

    public Item Add(Item item)
    {
        var created = item with { Id = Interlocked.Increment(ref _nextId) };
        _items[created.Id] = created;
        return created;
    }

    public bool Remove(int id) => _items.TryRemove(id, out _);

    private void Seed(Item item) => Add(item);
}
