import React, { useState, useEffect } from 'react';
import { api } from './services/api';
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
  FileText,
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
    } catch (err) {
      console.error(err);
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
    await api.addNote(contactId, { content });
    const fresh = await api.getContact(contactId);
    setSelectedContact(fresh);
    await loadContacts();
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
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Cachalot<span className="text-sky-400">CRM</span>
                </span>
                <span className="badge badge-sm badge-outline border-sky-400/30 text-sky-300 text-[10px]">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Gestión de Contactos y Notas de Clientes</p>
            </div>
          </div>

          {/* Quick Info & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/10 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus === 'ok' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                }`}
              />
              <span className="text-slate-300">
                Backend: {healthStatus === 'ok' ? 'Operativo' : 'Verificando'}
              </span>
            </div>

            <a
              href="/api/docs"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              API Docs
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nuevo Contacto
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Solución CRM Moderna & Escalable
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Control centralizado de tus <ShinyText text="contactos comerciales" speed={4} />
            </h1>
            <p className="mt-2 text-slate-400 text-sm md:text-base leading-relaxed">
              Administra clientes, relaciones y notas cronológicas con alta precisión técnica y
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

        {/* Filter Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/5">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar por empresa..."
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-medium transition shadow-md shadow-sky-500/10"
            >
              Buscar
            </button>

            {(searchName || searchCompany) && (
              <button
                type="button"
                onClick={() => {
                  setSearchName('');
                  setSearchCompany('');
                  api.getContacts().then(setContacts);
                }}
                className="px-3 py-2 border border-white/10 hover:bg-white/5 text-slate-400 text-sm rounded-xl transition"
              >
                Limpiar
              </button>
            )}

            <button
              type="button"
              onClick={loadContacts}
              disabled={loading}
              title="Refrescar contactos"
              className="p-2 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition ml-auto disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </form>
        </div>

        {/* Contacts Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" /> Lista de Contactos
            </h2>
            <span className="text-xs text-slate-400">
              Mostrando {contacts.length} resultado{contacts.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
                  <div className="h-6 bg-slate-800 rounded w-2/3" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : contacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <SpotlightCard
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="cursor-pointer group hover:-translate-y-1 transition duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-sky-300 transition text-base">
                          {contact.name}
                        </h3>
                        <p className="text-xs text-slate-400">{contact.company || 'Sin empresa'}</p>
                      </div>
                    </div>

                    <span className="badge badge-sm bg-sky-500/10 text-sky-300 border-none">
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
              <p className="text-sm text-slate-400 mt-1">
                {searchName || searchCompany
                  ? 'Intenta con otros términos de búsqueda.'
                  : 'Crea tu primer contacto para empezar a gestionar clientes.'}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-sky-500/20 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Crear Contacto
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass-panel border-t border-white/5 py-6 px-6 text-center text-xs text-slate-400 mt-12">
        <p>Cachalot CRM - Prueba Técnica Desarrollada con React 19, Vite, Tailwind CSS y NestJS</p>
      </footer>

      {/* Modals & Drawers */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateContact}
      />

      <ContactDrawer
        contact={selectedContact}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddNote={handleAddNote}
        onDeleteContact={handleDeleteContact}
      />
    </div>
  );
};
