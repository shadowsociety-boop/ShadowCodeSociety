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
export declare const generateExcel: (eventTitle: string, fields: FormField[], registrations: RegistrationData[]) => Buffer;
export {};
//# sourceMappingURL=excel.d.ts.map