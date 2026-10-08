import Swal, { SweetAlertOptions } from 'sweetalert2';

// Instancia base de SweetAlert2 estilizada con la estética Dark Glassmorphism del CRM
const darkSwal = Swal.mixin({
  background: '#0f172a',
  color: '#f8fafc',
  confirmButtonColor: '#0ea5e9', // sky-500
  cancelButtonColor: '#475569',  // slate-600
  customClass: {
    popup: 'border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl',
    title: 'text-xl font-bold text-white',
    htmlContainer: 'text-sm text-slate-300',
    confirmButton: 'px-5 py-2.5 rounded-xl font-medium shadow-lg hover:brightness-110 transition',
    cancelButton: 'px-5 py-2.5 rounded-xl font-medium transition',
  },
});

export const alertService = {
  // Toast flotante no intrusivo en la esquina superior derecha
  toast(title: string, icon: 'success' | 'error' | 'info' | 'warning' = 'success') {
    return darkSwal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon,
      title,
      background: '#1e293b',
      customClass: {
        popup: 'border border-white/10 rounded-2xl shadow-xl',
        title: 'text-sm font-semibold text-white',
      },
    });
  },

  success(title: string, text?: string) {
    return darkSwal.fire({
      icon: 'success',
      title,
      text,
      iconColor: '#38bdf8', // sky-400
      confirmButtonText: 'Entendido',
    });
  },

  error(title: string, text?: string) {
    return darkSwal.fire({
      icon: 'error',
      title,
      text: text || 'Ocurrió un error inesperado.',
      iconColor: '#f43f5e', // rose-500
      confirmButtonColor: '#f43f5e',
      confirmButtonText: 'Cerrar',
    });
  },

  async confirm(options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDangerous?: boolean;
  }): Promise<boolean> {
    const res = await darkSwal.fire({
      title: options.title,
      text: options.text,
      icon: options.isDangerous ? 'warning' : 'question',
      iconColor: options.isDangerous ? '#f59e0b' : '#38bdf8',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
      confirmButtonColor: options.isDangerous ? '#f43f5e' : '#0ea5e9',
      reverseButtons: true,
    });
    return res.isConfirmed;
  },
};
