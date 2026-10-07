// Debe coincidir con backend/Models/Item.cs (en camelCase).
export type Item = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number; // Calificación de los lectores, de 1 a 5.
};

export type NewItem = Omit<Item, "id">;

export type ChatMessage = { role: "user" | "assistant"; content: string };
