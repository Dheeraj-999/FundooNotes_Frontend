const TITLES = {
  '/dashboard': 'All notes',
  '/archive': 'Archive',
  '/trash': 'Trash',
  '/labels': 'Labels',
  '/reminders': 'Reminders',
  '/import': 'Import notes',
  '/login': 'Log in',
  '/register': 'Create account',
  '/forgot-password': 'Forgot password',
  '/reset-password': 'Reset password',
};

export function getPageTitle(pathname = '/') {
  const label = TITLES[pathname] || 'Fundoo Notes';
  return label === 'Fundoo Notes' ? label : `${label} — Fundoo Notes`;
}
