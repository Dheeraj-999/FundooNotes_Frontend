import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { resetPassword } from '../services/authService';
import { getErrorMessage } from '../utils/errors';
import { validateResetPassword } from '../utils/validators';

export default function ResetPasswordPage() {
  const location = useLocation();
  const initialEmail = location.state?.email
    || new URLSearchParams(location.search).get('email')
    || '';

  const [form, setForm] = useState({
    email: initialEmail,
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateResetPassword(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await resetPassword({
        email: form.email.trim(),
        otp: form.otp.trim(),
        newPassword: form.newPassword,
      });
      setComplete(true);
    } catch (error) {
      setApiError(getErrorMessage(error, 'Unable to reset your password. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter the code from your email and choose a new password."
      footer={
        <Link className="auth-link" to="/login">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      }
    >
      {complete ? (
        <div className="notice-card notice-card--success" role="status">
          <span className="notice-card__icon"><CheckCircle2 size={24} /></span>
          <h3>Password updated</h3>
          <p>Your password has been changed. Sign in with your new password to continue.</p>
          <p className="notice-card__meta">Old sessions are no longer able to log in.</p>
          <Link className="btn btn--primary btn--block" to="/login">
            Go to sign in <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {apiError && <div className="form-error" role="alert">{apiError}</div>}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <div className="field__control">
              <Mail size={18} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && <span className="field__error" id="email-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="otp">Verification code</label>
            <div className="field__control">
              <ShieldCheck size={18} aria-hidden="true" />
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="6-digit code"
                value={form.otp}
                onChange={handleChange}
                aria-invalid={Boolean(errors.otp)}
                aria-describedby={errors.otp ? 'otp-error' : 'otp-hint'}
              />
            </div>
            {errors.otp ? (
              <span className="field__error" id="otp-error">{errors.otp}</span>
            ) : (
              <span className="field__hint" id="otp-hint">Expires 5 minutes after it's sent.</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="newPassword">New password</label>
            <div className="field__control">
              <KeyRound size={18} aria-hidden="true" />
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={form.newPassword}
                onChange={handleChange}
                aria-invalid={Boolean(errors.newPassword)}
                aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide new password' : 'Show new password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="field__error" id="new-password-error">{errors.newPassword}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <div className="field__control">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                value={form.confirmPassword}
                onChange={handleChange}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
            </div>
            {errors.confirmPassword && (
              <span className="field__error" id="confirm-password-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Resetting password...' : 'Reset password'}
            {!submitting && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
