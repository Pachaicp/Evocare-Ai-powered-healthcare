// TypeScript interfaces for EvoCare

export type UserRole = 'ROLE_ADMIN' | 'ROLE_DOCTOR' | 'ROLE_CAREGIVER' | 'ROLE_PATIENT';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Patient {
  id: number;
  patientCode: string;
  fullName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  doctor?: User;
  caregiver?: User;
  user?: User;
}

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Observation {
  id: number;
  patient: Patient;
  caregiver: User;
  symptom: string;
  severity: Severity;
  notes: string;
  createdAt: string;
}

export interface Medication {
  id: number;
  patient: Patient;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy?: User;
}

export interface MedicalReport {
  id: number;
  patient: Patient;
  fileName: string;
  fileUrl: string;
  reportType?: string;
  description?: string;
  uploadedBy?: User;
  uploadedAt: string;
}

export interface ClinicalNote {
  id: number;
  doctor: User;
  patient: Patient;
  note: string;
  visitType?: string;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  user?: User;
  action: string;
  entityType?: string;
  entityId?: number;
  details?: string;
  timestamp: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalCaregivers: number;
  totalUsers: number;
  observationsThisMonth: number;
  totalReports: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TimelineItem {
  id: number;
  type: 'observation' | 'note' | 'medication' | 'report';
  title: string;
  description: string;
  date: string;
  severity?: Severity;
  createdBy?: string;
}
