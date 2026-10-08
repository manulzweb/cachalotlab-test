export interface CreateContactPersistence {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface UpdateContactPersistence {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}
