// utils/passwordStrengthChecker.ts
type PasswordStrength = ''|'weak' | 'good' | 'strong' | 'veryStrong';

function checkPasswordStrength(password: string): PasswordStrength {
  const lowercaseRegex = /^(?=.*[a-z]).*$/;
  const uppercaseRegex = /^(?=.*[A-Z]).*$/;
  const numberRegex = /^(?=.*[0-9]).*$/;
  const specialCharRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).*$/;

  let strength = -1;

  if (lowercaseRegex.test(password)) strength++;
  if (uppercaseRegex.test(password)) strength++;
  if (numberRegex.test(password)) strength++;
  if (specialCharRegex.test(password)) strength++;

  switch (strength) {
    case -1:
        return '';
    case 0:
      return 'weak';
    case 1:
      return 'good';
    case 2:
      return 'strong';
    case 3:
      return 'veryStrong';
    default:
      throw new Error('Invalid password strength calculation');
  }
}

export { checkPasswordStrength };