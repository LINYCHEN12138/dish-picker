export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string; avatar_key: string | null; theme_id: string | null; created_at: string; updated_at: string };
        Insert: { id: string; display_name?: string; avatar_key?: string | null; theme_id?: string | null };
        Update: { display_name?: string; avatar_key?: string | null; theme_id?: string | null; updated_at?: string };
        Relationships: [];
      };
      dishes: {
        Row: { id: string; slug: string; name: string; category: string; tags: string[]; difficulty: string; cook_minutes: number; servings: number; description: string; emoji: string; tone: string; tips: string[]; video_url: string; featured: boolean; active: boolean; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["dishes"]["Row"]> & { id: string; slug: string; name: string };
        Update: Partial<Database["public"]["Tables"]["dishes"]["Row"]>;
        Relationships: [];
      };
      ingredients: {
        Row: { id: string; name: string; category: string; default_unit: string; created_at: string };
        Insert: { id?: string; name: string; category: string; default_unit?: string };
        Update: { name?: string; category?: string; default_unit?: string };
        Relationships: [];
      };
      dish_ingredients: {
        Row: { id: string; dish_id: string; ingredient_id: string; kind: "ingredient" | "seasoning"; amount: number | null; unit: string; display_amount: string; optional: boolean; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["dish_ingredients"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["dish_ingredients"]["Row"]>;
        Relationships: [];
      };
      recipe_steps: {
        Row: { id: string; dish_id: string; step_number: number; title: string; description: string };
        Insert: Omit<Database["public"]["Tables"]["recipe_steps"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["recipe_steps"]["Row"]>;
        Relationships: [];
      };
      favorites: {
        Row: { id: string; user_id: string; dish_id: string; created_at: string };
        Insert: { id?: string; user_id: string; dish_id: string };
        Update: never;
        Relationships: [];
      };
      menu_history: {
        Row: { id: string; user_id: string; source: string; menu_name: string | null; dish_ids: string[]; dish_snapshots: Json; created_at: string };
        Insert: { id?: string; user_id: string; source: string; menu_name?: string | null; dish_ids: string[]; dish_snapshots: Json };
        Update: never;
        Relationships: [];
      };
      shopping_list: {
        Row: { id: string; list_id: string; user_id: string; dish_ids: string[]; ingredient_id: string | null; item_name: string; category: string; display_amount: string; checked: boolean; created_at: string; updated_at: string };
        Insert: Omit<Database["public"]["Tables"]["shopping_list"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: { checked?: boolean; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type DishRow = Database["public"]["Tables"]["dishes"]["Row"];
export type IngredientRow = Database["public"]["Tables"]["ingredients"]["Row"];
export type DishIngredientRow = Database["public"]["Tables"]["dish_ingredients"]["Row"];
export type RecipeStepRow = Database["public"]["Tables"]["recipe_steps"]["Row"];
