import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook do sprawdzania uprawnień użytkownika
 * Ułatwia sprawdzanie ról w komponentach
 */
export const usePermissions = () => {
  const { hasRole } = useAuth();

  return {
    // Sprawdź pojedynczą rolę
    isAdmin: hasRole('Admin'),
    isDoctor: hasRole('Doctor'),
    isUser: hasRole('User'),
    isPatient: hasRole('Patient'),
    
    // Sprawdź wiele ról (operator OR)
    isAdminOrDoctor: hasRole(['Admin', 'Doctor']),
    isDoctorOrUser: hasRole(['Doctor', 'User']),
    
    // Sprawdź czy użytkownik może wykonać akcję
    canManageUsers: hasRole('Admin'),
    canManageAppointments: hasRole(['Admin', 'Doctor']),
    canViewPatients: hasRole(['Admin', 'Doctor']),
    canEditOwnProfile: hasRole(['Admin', 'Doctor', 'User']),
    canManageDoctors: hasRole('Admin'),
    canManageDepartments: hasRole('Admin'),
    canManageSchedule: hasRole(['Admin', 'Doctor']),
    canViewReports: hasRole('Admin'),
    canManageDiscounts: hasRole('Admin'),
    canManageServices: hasRole('Admin'),
  };
};

/**
 * Przykład użycia:
 * 
 * function MyComponent() {
 *   const { isAdmin, canManageUsers, canViewPatients } = usePermissions();
 *   
 *   return (
 *     <div>
 *       {isAdmin && <AdminPanel />}
 *       {canManageUsers && <UserManagement />}
 *       {canViewPatients && <PatientsList />}
 *     </div>
 *   );
 * }
 */
