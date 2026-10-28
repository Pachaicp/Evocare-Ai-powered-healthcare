import { Patient } from '../types';

const STORAGE_KEY = 'evocare_custom_patients';

export const defaultPatients: Patient[] = [
  { id: 1, patientCode: 'PAT-1001', fullName: 'Eleanor Vance', age: 78, gender: 'FEMALE', bloodGroup: 'O+', address: '123 Health Ave', emergencyContact: '+1-555-0192', medicalHistory: 'Hypertension', doctor: { name: 'Dr. Sarah Smith' } as any, caregiver: { name: 'Mary Johnson' } as any },
  { id: 2, patientCode: 'PAT-1002', fullName: 'Arthur Pendelton', age: 82, gender: 'MALE', bloodGroup: 'A+', address: '456 Oak Ave', emergencyContact: '+1-555-0183', medicalHistory: 'Type 2 Diabetes', doctor: { name: 'Dr. Sarah Smith' } as any, caregiver: { name: 'Mary Johnson' } as any },
  { id: 3, patientCode: 'PAT-1003', fullName: 'Margaret Thatcher', age: 85, gender: 'FEMALE', bloodGroup: 'B+', address: '789 Pine Rd', emergencyContact: '+1-555-0174', medicalHistory: 'Arthritis', doctor: { name: 'Dr. Sarah Smith' } as any, caregiver: { name: 'Mary Johnson' } as any },
];

export const getStoredPatients = (): Patient[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored patients', e);
  }
  return defaultPatients;
};

export const savePatientToStore = (newPatient: Patient): Patient[] => {
  const current = getStoredPatients();
  const exists = current.some(p => p.id === newPatient.id || p.patientCode === newPatient.patientCode);
  const updated = exists
    ? current.map(p => (p.id === newPatient.id || p.patientCode === newPatient.patientCode ? newPatient : p))
    : [newPatient, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getMergedPatients = (apiPatients: Patient[] = []): Patient[] => {
  const stored = getStoredPatients();
  const map = new Map<string, Patient>();

  // Add default/API patients first
  defaultPatients.forEach(p => map.set(p.patientCode, p));
  apiPatients.forEach(p => p.patientCode && map.set(p.patientCode, p));

  // Add stored patients (overwriting/adding custom newly created patients at top)
  stored.forEach(p => p.patientCode && map.set(p.patientCode, p));

  return Array.from(map.values()).sort((a, b) => {
    const numA = parseInt(a.patientCode.replace(/\D/g, '') || '0', 10);
    const numB = parseInt(b.patientCode.replace(/\D/g, '') || '0', 10);
    return numB - numA; // newest / highest code first
  });
};
