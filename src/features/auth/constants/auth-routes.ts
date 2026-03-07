export const AUTH_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
} as const;

export const PUBLIC_AUTH_PAGES = [
  AUTH_ROUTES.home,
  AUTH_ROUTES.login,
  AUTH_ROUTES.register,
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.resetPassword,
  AUTH_ROUTES.verifyEmail,
];