import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    id: bigint;
    name: string;
    description: string;
    price: bigint;
}
export interface InvoiceItem {
    description: string;
    amount: bigint;
}
export interface Invoice {
    id: bigint;
    status: InvoiceStatus;
    createdAt: string;
    totalAmount: bigint;
    patientName: string;
    phone: string;
    items: Array<InvoiceItem>;
}
export interface Appointment {
    id: bigint;
    age: bigint;
    service: string;
    status: AppointmentStatus;
    cnic: string;
    appointmentDate: string;
    appointmentTime: string;
    gender: string;
    notes: string;
    patientName: string;
    phone: string;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum InvoiceStatus {
    paid = "paid",
    unpaid = "unpaid"
}
export interface backendInterface {
    addService(name: string, description: string, price: bigint): Promise<bigint>;
    createAppointment(appointment: Appointment): Promise<bigint>;
    createInvoice(invoice: Invoice): Promise<bigint>;
    deleteAppointment(id: bigint): Promise<void>;
    deleteInvoice(id: bigint): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getAllServices(): Promise<Array<Service>>;
    getAppointmentById(id: bigint): Promise<Appointment>;
    getInvoiceById(id: bigint): Promise<Invoice>;
    markInvoiceAsPaid(id: bigint): Promise<void>;
    updateAppointmentStatus(id: bigint, status: AppointmentStatus): Promise<void>;
}
