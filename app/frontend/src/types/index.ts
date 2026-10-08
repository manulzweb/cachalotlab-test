export interface ContactNote {
  id: number;
  content: string;
  createdAt: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
  notes?: ContactNote[];
}

export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface AddNotePayload {
  content: string;
}
