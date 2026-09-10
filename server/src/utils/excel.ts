import * as XLSX from 'xlsx';

interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

interface RegistrationData {
  id: string;
  registrationNumber: number;
  name: string;
  email: string;
  status: string;
  createdAt: Date | string;
  responses: Record<string, unknown> | string;
}

export const generateExcel = (
  eventTitle: string,
  fields: FormField[],
  registrations: RegistrationData[]
): Buffer => {
  // Build headers dynamically from form fields
  const headers = [
    'Reg #',
    'Name',
    'Email',
    ...fields.map(f => f.label),
    'Status',
    'Registration Date',
  ];

  // Build rows
  const rows = registrations.map(reg => {
    const responses = typeof reg.responses === 'string' ? JSON.parse(reg.responses) : reg.responses;
    return [
      reg.registrationNumber,
      reg.name,
      reg.email,
      ...fields.map(f => {
        const val = responses[f.id];
        if (Array.isArray(val)) return val.join(', ');
        return val ?? '';
      }),
      reg.status,
      new Date(reg.createdAt).toLocaleString(),
    ];
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Auto-width columns
  const colWidths = headers.map((h, i) => {
    const maxLen = Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length));
    return { wch: Math.min(maxLen + 2, 50) };
  });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

  return Buffer.from(XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }));
};
