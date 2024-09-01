export function validateName(username) {
  if (username.length < 3) {
    return 'Name must be at least 3 characters'
  }
  return null
}

export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return 'Invalid email address'
  }
  return null
}

export function validatePassword(password) {
  if (password.length < 8) {
    return `Password must be at least 8 characters long.`
  } else if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.'
  } else if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.'
  } else if (!/\d/.test(password)) {
    return 'Password must contain at least one number.'
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character.'
  }
  return null
}
