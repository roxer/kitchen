export interface Ingredient {
  id: number;
  name: string;
  title: string;
  quantity?: number | null;
  dependencies: Array<number> | null;
}
