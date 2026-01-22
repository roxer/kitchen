export interface Recipe {
  id: number;
  title: string;
  image?: string | null;
  image_url?: string | null;
  cook_time?: number | null;
  prep_time?: number | null;
  rating?: number | null;
  author_name?: string | null;
  created_at: string;
  updated_at: string;
}
