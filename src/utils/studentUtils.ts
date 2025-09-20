
/**
 * Utility for determining engineering student year from email, name, or profile.
 * For demo: returns 2nd year by default (can be expanded).
 */
export function getStudentYear(user: { name: string; email: string }) {
  // You can parse from email (e.g., 23batch means 1st/2nd yr), else prompt.
  // For demo, default to "2nd Year"
  return "2nd Year";
}

// You could improve this with more logic later.
