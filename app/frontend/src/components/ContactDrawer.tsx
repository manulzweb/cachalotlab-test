import React, { useState } from 'react';
import { Contact } from '../types';
import { X, MessageSquarePlus, Trash2, Calendar, Phone, Mail, Building, Plus } from 'lucide-react';

interface DrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (contactId: number, content: string) => Promise<void>;
  onDeleteContact: (contactId: number) => Promise<void>;
}

export const ContactDrawer: React.FC<DrawerProps> = ({
  contact,
  isOpen,
  onClose,
  onAddNote,
  onDeleteContact,
}) => {
  const [noteContent, setNoteContent] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !contact) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setSubmittingNote(true);
    try {
      await onAddNote(contact.id, noteContent);
      setNoteContent('');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar el contacto "${contact.name}"?`)) return;

    setDeleting(true);
    try {
      await onDeleteContact(contact.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/10 p-6 flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{contact.name}</h3>
              <p className="text-sm text-slate-400">{contact.company || 'Sin empresa'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition rounded-xl hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-3 p-4 bg-slate-900/60 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Mail className="w-4 h-4 text-sky-400" />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.company && (
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Building className="w-4 h-4 text-amber-400" />
              <span>{contact.company}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-slate-400 text-xs pt-2 border-t border-white/5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Creado el {new Date(contact.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-sky-400" /> Notas de Seguimiento
            </h4>
            <span className="text-xs bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-medium">
              {contact.notes?.length || 0}
            </span>
          </div>

          {/* Form to add note */}
          <form onSubmit={handleAddNote} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe una nota rápida..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={submittingNote || !noteContent.trim()}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-medium transition disabled:opacity-40 flex items-center gap-1 shadow-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Notes list */}
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {contact.notes && contact.notes.length > 0 ? (
              contact.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 bg-slate-800/40 border border-white/5 rounded-xl hover:border-white/10 transition"
                >
                  <p className="text-sm text-slate-200 leading-relaxed">{note.content}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No hay notas registradas para este contacto.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-4">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm px-3 py-2 rounded-xl hover:bg-rose-500/10 transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Eliminando...' : 'Eliminar Contacto'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm border border-white/10 text-slate-300 hover:bg-white/5 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
