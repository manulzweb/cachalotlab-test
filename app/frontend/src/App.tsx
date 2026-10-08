import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { alertService } from './services/alert';
import { Contact, CreateContactPayload } from './types';
import { Squares } from './components/reactbits/Squares';
import { SpotlightCard } from './components/reactbits/SpotlightCard';
import { ShinyText } from './components/reactbits/ShinyText';
import { ContactModal } from './components/ContactModal';
import { ContactDrawer } from './components/ContactDrawer';
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string>('checking');

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await api.getContacts({
        name: searchName.trim() || undefined,
        company: searchCompany.trim() || undefined,
      });
      setContacts(data);
    } catch (err: any) {
      console.error(err);
      alertService.error('Error de conexión', 'No se pudieron cargar los contactos');
    } finally {
      setLoading(false);
    }
  };

  const checkSystemHealth = async () => {
    const res = await api.checkHealth();
    setHealthStatus(res.status);
  };

  useEffect(() => {
    loadContacts();
    checkSystemHealth();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadContacts();
  };

  const handleCreateContact = async (data: CreateContactPayload) => {
    await api.createContact(data);
    await loadContacts();
  };

  const handleSelectContact = async (contact: Contact) => {
    try {
      const fresh = await api.getContact(contact.id);
      setSelectedContact(fresh);
    } catch {
      setSelectedContact(contact);
    }
    setIsDrawerOpen(true);
  };

  const handleAddNote = async (contactId: number, content: string) => {
    const createdNote = await api.addNote(contactId, { content });
    
    // 1. Actualizar el estado local del drawer de forma inmediata
    setSelectedContact((prev) => {
      if (!prev || prev.id !== contactId) return prev;
      const updatedNotes = [createdNote, ...(prev.notes || [])];
      return { ...prev, notes: updatedNotes };
    });

    // 2. Actualizar el estado global de la lista de contactos para reflejar el nuevo conteo de notas en tiempo real
    setContacts((prevContacts) =>
      prevContacts.map((c) => {
        if (c.id !== contactId) return c;
        const updatedNotes = [createdNote, ...(c.notes || [])];
        return { ...c, notes: updatedNotes };
      }),
    );
  };

  const handleUpdateNote = async (contactId: number, noteId: number, content: string) => {
    const updatedNote = await api.updateNote(noteId, content);

    // 1. Actualizar el estado local del drawer
    setSelectedContact((prev) => {
      if (!prev || prev.id !== contactId) return prev;
      const updatedNotes = (prev.notes || []).map((n) =>
        n.id === noteId ? { ...n, content: updatedNote.content, updatedAt: updatedNote.updatedAt } : n,
      );
      return { ...prev, notes: updatedNotes };
    });

    // 2. Actualizar el estado global de contactos
    setContacts((prevContacts) =>
      prevContacts.map((c) => {
        if (c.id !== contactId) return c;
        const updatedNotes = (c.notes || []).map((n) =>
          n.id === noteId ? { ...n, content: updatedNote.content, updatedAt: updatedNote.updatedAt } : n,
        );
        return { ...c, notes: updatedNotes };
      }),
    );
  };

  const handleDeleteNote = async (contactId: number, noteId: number) => {
    await api.deleteNote(noteId);

    // 1. Actualizar estado local del drawer
    setSelectedContact((prev) => {
      if (!prev || prev.id !== contactId) return prev;
      const updatedNotes = (prev.notes || []).filter((n) => n.id !== noteId);
      return { ...prev, notes: updatedNotes };
    });

    // 2. Actualizar conteo global en contactos
    setContacts((prevContacts) =>
      prevContacts.map((c) => {
        if (c.id !== contactId) return c;
        const updatedNotes = (c.notes || []).filter((n) => n.id !== noteId);
        return { ...c, notes: updatedNotes };
      }),
    );
  };

  const handleDeleteContact = async (contactId: number) => {
    await api.deleteContact(contactId);
    setSelectedContact(null);
    await loadContacts();
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 flex flex-col overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Dynamic Background with ReactBits Squares */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <Squares
          direction="diagonal"
          speed={0.4}
          squareSize={48}
          borderColor="rgba(255, 255, 255, 0.05)"
          hoverFillColor="rgba(56, 189, 248, 0.08)"
        />
      </div>

      {/* Decorative Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 glass-panel border-b border-white/5 sticky top-0 px-6 py-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-sky-500/20">
              🐋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg tracking-tight text-white">Cachalot CRM</h1>
                <span className="badge badge-sm bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase">
                  Technical Test
                </span>
              </div>
              <p className="text-xs text-slate-400">Plataforma integral de gestión de clientes y notas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-medium">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">API Status:</span>
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  healthStatus === 'ok' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    healthStatus === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                {healthStatus === 'ok' ? 'Online' : 'Checking...'}
              </span>
            </div>

            {/* Create Contact Action */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nuevo Contacto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Hero Banner with ShinyText & Spotlight */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-48 h-48 text-sky-400" />
          </div>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Arquitectura Limpia & React 19
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Gestión Inteligente de <ShinyText text="Contactos y Notas" disabled={false} speed={3} />
            </h2>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
              Explora, filtra y gestiona contactos de forma reactiva con sincronización en tiempo real y
              persistencia segura en PostgreSQL.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Contactos</p>
              <p className="text-2xl font-bold text-white mt-1">{contacts.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Notas Registradas</p>
              <p className="text-2xl font-bold text-sky-400 mt-1">
                {contacts.reduce((acc, c) => acc + (c.notes?.length || 0), 0)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs uppercase tracking-wider text-slate-400">Arquitectura</p>
              <p className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1">
                <Layers className="w-4 h-4 text-emerald-400" /> NestJS + Vite + Tailwind
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/5 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre (ej: Alan, Ada)..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div className="relative flex-1">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por empresa (ej: Bletchley Park)..."
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 md:flex-none px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Buscar
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchName('');
                  setSearchCompany('');
                  api.getContacts().then(setContacts);
                }}
                className="p-2.5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center justify-center cursor-pointer"
                title="Limpiar filtros"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Contacts Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" /> Directorio de Clientes
            </h3>
            <span className="text-xs text-slate-400">Mostrando {contacts.length} resultados</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-panel rounded-2xl p-6 border border-white/5 animate-pulse h-44" />
              ))}
            </div>
          ) : contacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {contacts.map((contact) => (
                <SpotlightCard
                  key={contact.id}
                  className="cursor-pointer group hover:border-sky-500/50 transition-all duration-300 transform hover:-translate-y-1"
                  spotlightColor="rgba(56, 189, 248, 0.15)"
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg group-hover:scale-105 transition">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-sky-400 transition">
                          {contact.name}
                        </h3>
                        <p className="text-xs text-slate-400">{contact.company || 'Sin empresa'}</p>
                      </div>
                    </div>

                    <span className="badge badge-sm bg-sky-500/10 text-sky-300 border-none font-semibold">
                      {contact.notes?.length || 0} nota{(contact.notes?.length || 0) === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-xs text-slate-300 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 max-w-md mx-auto">
              <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No se encontraron contactos</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Prueba ajustando los criterios de búsqueda o crea un nuevo contacto para comenzar.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-semibold hover:bg-sky-400 transition cursor-pointer"
              >
                Crear Contacto
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Contact Creation Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateContact}
      />

      {/* Notes & Detail Drawer */}
      <ContactDrawer
        contact={selectedContact}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedContact(null);
        }}
        onAddNote={handleAddNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        onDeleteContact={handleDeleteContact}
      />
    </div>
  );
};
