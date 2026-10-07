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
        // 👉 PASO .NET: reemplaza estos datos de ejemplo por los de TU idea.
        Seed(new Item(0, "Camiseta oversize negra", "Algodón 100%, corte amplio y cuello redondo.", "Camisetas", 59000, 25));
        Seed(new Item(0, "Camiseta estampada urbana", "Estampado frontal, tela suave y fresca.", "Camisetas", 65000, 18));
        Seed(new Item(0, "Jean baggy azul", "Denim resistente, tiro alto y bota ancha.", "Pantalones", 129000, 12));
        Seed(new Item(0, "Gorra snapback", "Ajustable, visera plana y logo bordado.", "Accesorios", 45000, 30));
        Seed(new Item(0, "Bolso bandolera", "Compacto, con correa ajustable y cierre resistente.", "Accesorios", 79000, 8));
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
