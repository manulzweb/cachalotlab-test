import React, { useState } from 'react';
import { CreateContactPayload } from '../types';
import { alertService } from '../services/alert';
import { UserPlus, X, Mail, Phone, Building, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateContactPayload) => Promise<void>;
}

export const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateContactPayload>({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('El nombre y el correo electrónico son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      alertService.toast('Contacto creado exitosamente', 'success');
      setFormData({ name: '', email: '', phone: '', company: '' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el contacto');
      alertService.error('No se pudo crear el contacto', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Nuevo Contacto</h3>
              <p className="text-sm text-slate-400">Registra un cliente en el CRM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition rounded-xl hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Nombre Completo <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ej. Alan Turing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Correo Electrónico <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="alan.turing@enigma.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Empresa
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Bletchley Park"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Crear Contacto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
