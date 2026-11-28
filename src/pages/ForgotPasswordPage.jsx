import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { requestPasswordReset } from '../services/authService';
import { getErrorMessage } from '../utils/errors';
import { validateForgotPassword } from '../utils/validators';

const EMPTY_FORM = { email: '' };

export default function ForgotPasswordPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForgotPassword(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const email = form.email.trim();
    setSubmitting(true);
    try {
      await requestPasswordReset({ email });
      setSentTo(email);
    } catch (error) {
      setApiError(getErrorMessage(error, 'Unable to send the verification code. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a verification code."
      footer={
        <Link className="auth-link" to="/login">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      }
    >
      {sentTo ? (
        <div className="notice-card notice-card--success" role="status">
          <span className="notice-card__icon"><CheckCircle2 size={24} /></span>
          <h3>Check your inbox</h3>
          <p>
            If an account exists for <strong>{sentTo}</strong>, we've emailed a 6-digit
            verification code. It expires in 5 minutes.
          </p>
          <p className="notice-card__meta">
            Didn't get it? Check your spam folder, then try again.
          </p>
          <Link className="btn btn--primary btn--block" to="/reset-password" state={{ email: sentTo }}>
            Enter verification code <ArrowRight size={18} aria-hidden="true" />
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

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Sending code...' : 'Send verification code'}
            {!submitting && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
