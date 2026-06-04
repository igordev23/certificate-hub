export interface Template {
  id: string;
  name: string;
  description: string;
  layoutConfig: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
