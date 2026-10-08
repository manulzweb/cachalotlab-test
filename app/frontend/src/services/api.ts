import { Contact, CreateContactPayload, AddNotePayload } from '../types';

const API_BASE = '/api/v1';

export const api = {
  async getContacts(query?: { name?: string; company?: string }): Promise<Contact[]> {
    const params = new URLSearchParams();
    if (query?.name) params.append('name', query.name);
    if (query?.company) params.append('company', query.company);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/contacts${queryString}`);
    if (!res.ok) throw new Error('Error al obtener la lista de contactos');
    return res.json();
  },

  async getContact(id: number): Promise<Contact> {
    const res = await fetch(`${API_BASE}/contacts/${id}`);
    if (!res.ok) throw new Error(`Error al obtener el contacto #${id}`);
    return res.json();
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

  async addNote(contactId: number, payload: AddNotePayload): Promise<void> {
    const res = await fetch(`${API_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al agregar la nota');
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
