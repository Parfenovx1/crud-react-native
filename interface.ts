export interface ListItem {
    id: number;
    title: string;
    text: string;
    image: string;
    active: number;
    updated_at: Date;
    deleted_at: Date | null;
    url: string;
    created_at: Date;
    sort_order: number | null;
  }
  