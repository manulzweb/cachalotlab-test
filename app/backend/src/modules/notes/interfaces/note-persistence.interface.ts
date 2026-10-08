export interface CreateNotePersistence {
  content: string;
  contact: { id: number };
}

export interface UpdateNotePersistence {
  content: string;
}
