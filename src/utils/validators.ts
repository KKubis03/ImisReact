// Validation functions for form fields

export const validateName = (value: string): string => {
  if (!value.trim()) return "Name is required";
  if (/\d/.test(value)) return "Name cannot contain numbers";
  if (value.length < 2) return "Name must be at least 2 characters";
  if (value.length > 100) return "Name cannot exceed 100 characters";
  return "";
};

export const validateFirstName = (value: string): string => {
  if (!value.trim()) return "First name is required";
  if (/\d/.test(value)) return "First name cannot contain numbers";
  if (value.length < 2) return "First name must be at least 2 characters";
  if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(value)) 
    return "First name can only contain letters, spaces, and hyphens";
  return "";
};

export const validateLastName = (value: string): string => {
  if (!value.trim()) return "Last name is required";
  if (/\d/.test(value)) return "Last name cannot contain numbers";
  if (value.length < 2) return "Last name must be at least 2 characters";
  if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(value)) 
    return "Last name can only contain letters, spaces, and hyphens";
  return "";
};

export const validatePesel = (value: string): string => {
  if (!value.trim()) return "PESEL is required";
  if (!/^\d+$/.test(value)) return "PESEL can only contain digits";
  if (value.length !== 11) return "PESEL must be exactly 11 digits";
  return "";
};

export const validateDateOfBirth = (value: string): string => {
  if (!value) return "Date of birth is required";
  const date = new Date(value);
  const today = new Date();
  if (date > today) return "Date of birth cannot be in the future";
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  if (date < minDate) return "Date of birth cannot be more than 120 years ago";
  return "";
};

export const validateGender = (value: string): string => {
  if (!value) return "Gender is required";
  return "";
};

export const validateEmail = (value: string): string => {
  if (!value.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Invalid email format (example: user@example.com)";
  if (value.length > 100) return "Email is too long";
  return "";
};

export const validatePhoneNumber = (value: string): string => {
  if (!value.trim()) return "Phone number is required";
  const phoneRegex = /^[+]?[\d\s-()]{9,}$/;
  if (!phoneRegex.test(value)) return "Invalid phone number format (digits, spaces, +, -, () allowed)";
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length < 9) return "Phone number must have at least 9 digits";
  if (digitsOnly.length > 15) return "Phone number cannot exceed 15 digits";
  return "";
};

export const validateDescription = (value: string, minLength: number = 10, maxLength: number = 500): string => {
  if (!value.trim()) return "Description is required";
  if (value.length < minLength) return `Description must be at least ${minLength} characters`;
  if (value.length > maxLength) return `Description cannot exceed ${maxLength} characters`;
  return "";
};

export const validateStatusName = (value: string): string => {
  if (!value.trim()) return "Status name is required";
  if (value.length < 2) return "Status name must be at least 2 characters";
  if (value.length > 50) return "Status name cannot exceed 50 characters";
  return "";
};

export const validatePercentage = (value: string): string => {
  if (!value.trim()) return "Percentage is required";
  const num = Number(value);
  if (isNaN(num)) return "Percentage must be a number";
  if (num < 0) return "Percentage cannot be negative";
  if (num === 0) return "Percentage cannot be zero";
  if (num > 100) return "Percentage cannot exceed 100";
  if (!Number.isInteger(num)) return "Percentage must be a whole number";
  return "";
};

// Appointment validation functions
export const validatePatientId = (value: string | number): string => {
  if (!value) return "Patient is required";
  return "";
};

export const validateDoctorId = (value: string | number): string => {
  if (!value) return "Doctor is required";
  return "";
};

export const validateAppointmentDate = (value: string): string => {
  if (!value) return "Date is required";
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) return "Cannot schedule appointments in the past";
  return "";
};

export const validateAppointmentTime = (value: string): string => {
  if (!value) return "Time is required";
  return "";
};
