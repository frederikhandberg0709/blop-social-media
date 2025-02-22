export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateUsername(username: string) {
  const regex = /^[a-z0-9-_]+$/; // Only lowercase letters, numbers, dash, and underscore
  return regex.test(username);
}

export function validatePassword(password: string): boolean {
  const minLength = 8;

  const specialCharRegex =
    /^(?=.*[!@#$%^&*()_,.?":{}|<>])[a-zA-Z0-9!@#$%^&*()_,.?":{}|<>]{8,}$/;

  return password.length >= minLength && specialCharRegex.test(password);
}

export function passwordsMatch(
  password: string,
  confirmPassword: string,
): boolean {
  return password === confirmPassword;
}

export function getPasswordErrorMessage(password: string): string {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";

  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (!specialCharRegex.test(password))
    return "Password must contain at least one special character";

  return "";
}

export function getPasswordMatchErrorMessage(
  password: string,
  confirmPassword: string,
): string {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}
