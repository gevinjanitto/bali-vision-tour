import { COMPANY } from '../mock/common';

export const buildWhatsAppUrl = (message = '') => {
  const text = encodeURIComponent(message || COMPANY.whatsappMessage || '');
  return `https://wa.me/${COMPANY.whatsapp}?text=${text}`;
};

export const buildBookingMessage = ({ type, itemName, name, phone, date, pax, option, notes, total }) => {
  const lines = [
    `Halo Bali Vision Tour! Saya ingin booking *${type}*.`,
    ``,
    `*Item:* ${itemName}`,
    name ? `*Nama:* ${name}` : null,
    phone ? `*No. HP/WA:* ${phone}` : null,
    date ? `*Tanggal:* ${date}` : null,
    pax ? `*Jumlah Peserta:* ${pax}` : null,
    option ? `*Opsi:* ${option}` : null,
    total ? `*Estimasi Total:* ${total}` : null,
    notes ? `*Catatan:* ${notes}` : null,
    ``,
    `Mohon info ketersediaan & konfirmasi. Terima kasih!`,
  ].filter((l) => l !== null);
  return lines.join('\n');
};

export const openWhatsApp = (message) => {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
};
