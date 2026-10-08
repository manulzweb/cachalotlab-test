import { Contact, CreateContactPayload, AddNotePayload, ContactNote } from '../types';

const API_BASE = '/api/v1';

export const api = {
  async getContacts(query?: { name?: string; company?: string }): Promise<Contact[]> {
    const params = new URLSearchParams();
    if (query?.name) params.append('name', query.name);
    if (query?.company) params.append('company', query.company);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/contacts${queryString}`);
    if (!res.ok) throw new Error('Error al obtener la lista de contactos');
    const contacts: Contact[] = await res.json();

    // Consultar en paralelo las notas asociadas a cada contacto para reflejar el conteo real
    const contactsWithNotes = await Promise.all(
      contacts.map(async (c) => {
        try {
          const notesRes = await fetch(`${API_BASE}/contacts/${c.id}/notes`);
          const notes = notesRes.ok ? await notesRes.json() : [];
          return { ...c, notes };
        } catch {
          return { ...c, notes: [] };
        }
      }),
    );

    return contactsWithNotes;
  },

  async getContact(id: number): Promise<Contact> {
    const [contactRes, notesRes] = await Promise.all([
      fetch(`${API_BASE}/contacts/${id}`),
      fetch(`${API_BASE}/contacts/${id}/notes`),
    ]);
    if (!contactRes.ok) throw new Error(`Error al obtener el contacto #${id}`);
    const contact = await contactRes.json();
    const notes = notesRes.ok ? await notesRes.json() : [];
    return { ...contact, notes };
  },

  async createContact(payload: CreateContactPayload): Promise<Contact> {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al crear el contacto');
    }
    return data;
  },

  async deleteContact(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar el contacto');
  },

  async addNote(contactId: number, payload: AddNotePayload): Promise<ContactNote> {
    const res = await fetch(`${API_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al agregar la nota');
    }
    return data;
  },

  async updateNote(noteId: number, content: string): Promise<ContactNote> {
    const res = await fetch(`${API_BASE}/notes/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al actualizar la nota');
    }
    return data;
  },

  async deleteNote(noteId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error al eliminar la nota');
    }
  },

  async checkHealth(): Promise<{ status: string; database?: string }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) return { status: 'down' };
      return res.json();
    } catch {
      return { status: 'down' };
    }
  },
};
