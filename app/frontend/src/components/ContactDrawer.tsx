import React, { useState, useRef, useEffect } from 'react';
import { Contact, ContactNote } from '../types';
import { alertService } from '../services/alert';
import {
  X,
  MessageSquarePlus,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Building,
  Plus,
  Edit2,
  Check,
} from 'lucide-react';

interface DrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (contactId: number, content: string) => Promise<void>;
  onUpdateNote: (contactId: number, noteId: number, content: string) => Promise<void>;
  onDeleteNote: (contactId: number, noteId: number) => Promise<void>;
  onDeleteContact: (contactId: number) => Promise<void>;
}

export const ContactDrawer: React.FC<DrawerProps> = ({
  contact,
  isOpen,
  onClose,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onDeleteContact,
}) => {
  const [noteContent, setNoteContent] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Estado para edición en línea de una nota
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Referencias para detectar clicks fuera (Click Outside)
  const createFormRef = useRef<HTMLFormElement | null>(null);
  const createBtnRef = useRef<HTMLButtonElement | null>(null);
  const editFormRef = useRef<HTMLDivElement | null>(null);

  // Reset isClosing when opening a new contact
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen, contact?.id]);

  // Cierre animado: reproduce animación de salida (slide a la derecha) antes de desmontar
  const handleAnimatedClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 240); // Duración que calza con el animate-slide-out-right (250ms)
  };

  // Efecto para cerrar la sección de creación/edición de nota al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Si está creando una nota y hace click fuera del formulario de creación y del botón que lo abre
      if (
        isCreatingNote &&
        createFormRef.current &&
        !createFormRef.current.contains(target) &&
        (!createBtnRef.current || !createBtnRef.current.contains(target))
      ) {
        setIsCreatingNote(false);
      }

      // Si está editando una nota y hace click fuera del formulario de edición
      if (editingNoteId !== null && editFormRef.current && !editFormRef.current.contains(target)) {
        setEditingNoteId(null);
        setEditingContent('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCreatingNote, editingNoteId]);

  if (!isOpen || !contact) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setSubmittingNote(true);
    try {
      await onAddNote(contact.id, noteContent.trim());
      setNoteContent('');
      setIsCreatingNote(false);
      alertService.toast('Nota registrada exitosamente', 'success');
    } catch (err: any) {
      alertService.error('Error al agregar nota', err.message);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleStartEdit = (note: ContactNote) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
    setIsCreatingNote(false); // Cierra creación si estaba activa
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async (noteId: number) => {
    if (!editingContent.trim()) return;
    setSavingEdit(true);
    try {
      await onUpdateNote(contact.id, noteId, editingContent.trim());
      setEditingNoteId(null);
      setEditingContent('');
      alertService.toast('Nota actualizada correctamente', 'success');
    } catch (err: any) {
      alertService.error('Error al actualizar nota', err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    const confirmed = await alertService.confirm({
      title: '¿Eliminar Nota?',
      text: 'Esta nota será eliminada del historial del contacto.',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      isDangerous: true,
    });

    if (!confirmed) return;

    try {
      await onDeleteNote(contact.id, noteId);
      alertService.toast('Nota eliminada', 'info');
    } catch (err: any) {
      alertService.error('Error al eliminar nota', err.message);
    }
  };

  const handleDeleteContact = async () => {
    const confirmed = await alertService.confirm({
      title: '¿Eliminar Contacto?',
      text: `Se eliminará a "${contact.name}" y sus notas asociadas del CRM.`,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      isDangerous: true,
    });

    if (!confirmed) return;

    setDeleting(true);
    try {
      await onDeleteContact(contact.id);
      onClose();
      alertService.toast('Contacto eliminado', 'info');
    } catch (err: any) {
      alertService.error('Error al eliminar contacto', err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={(e) => {
        // Cerrar el drawer al hacer click en el backdrop oscuro
        if (e.target === e.currentTarget) handleAnimatedClose();
      }}
    >
      <div
        className={`w-full max-w-md h-full glass-panel border-l border-white/10 p-6 flex flex-col shadow-2xl overflow-y-auto ${
          isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}
      >
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
            onClick={handleAnimatedClose}
            className="p-2 text-slate-400 hover:text-white transition rounded-xl hover:bg-white/5 cursor-pointer"
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
            <span className="text-xs bg-sky-500/10 text-sky-400 px-2.5 py-0.5 rounded-full font-bold">
              {contact.notes?.length || 0} nota{(contact.notes?.length || 0) === 1 ? '' : 's'}
            </span>
          </div>

          {/* Form / Trigger to add note with click outside */}
          <div className="mb-4">
            {!isCreatingNote ? (
              <button
                ref={createBtnRef}
                type="button"
                onClick={() => setIsCreatingNote(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-sky-500/30 text-sky-400 hover:bg-sky-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Agregar nueva nota
              </button>
            ) : (
              <form
                ref={createFormRef}
                onSubmit={handleAddNote}
                className="p-3 bg-slate-900/90 border border-sky-500/40 rounded-2xl shadow-lg space-y-2 animate-fade-in"
              >
                <textarea
                  autoFocus
                  placeholder="Escribe el detalle de la nota..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none h-20"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNote(false);
                      setNoteContent('');
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingNote || !noteContent.trim()}
                    className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition disabled:opacity-40 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {submittingNote ? 'Guardando...' : 'Guardar Nota'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Notes list with Edit, Delete and Click Outside */}
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {contact.notes && contact.notes.length > 0 ? (
              contact.notes.map((note) => (
                <div
                  key={note.id}
                  className="group p-3.5 bg-slate-800/40 border border-white/5 rounded-xl hover:border-white/10 transition flex flex-col justify-between gap-2"
                >
                  {editingNoteId === note.id ? (
                    <div ref={editFormRef} className="space-y-2 animate-fade-in">
                      <textarea
                        autoFocus
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full bg-slate-900 border border-sky-500/50 rounded-lg p-2.5 text-sm text-white focus:outline-none resize-none h-20"
                        placeholder="Edita el contenido de la nota..."
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:bg-white/5 transition cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={savingEdit || !editingContent.trim()}
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {savingEdit ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-200 leading-relaxed break-words">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(note)}
                            className="p-1 hover:text-sky-400 transition rounded hover:bg-white/5 cursor-pointer"
                            title="Editar nota"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 hover:text-rose-400 transition rounded hover:bg-white/5 cursor-pointer"
                            title="Eliminar nota"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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
            onClick={handleDeleteContact}
            disabled={deleting}
            className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm px-3 py-2 rounded-xl hover:bg-rose-500/10 transition disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Eliminando...' : 'Eliminar Contacto'}
          </button>
          <button
            onClick={handleAnimatedClose}
            className="px-4 py-2 rounded-xl text-sm border border-white/10 text-slate-300 hover:bg-white/5 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
