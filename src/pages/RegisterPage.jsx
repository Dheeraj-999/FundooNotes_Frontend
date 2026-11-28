import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/errors';
import { validateRegister } from '../utils/validators';

const EMPTY_FORM = { firstName: '', email: '', password: '' };

export default function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const credentials = { email: form.email.trim(), password: form.password };
    let registered = false;
    setSubmitting(true);
    try {
      await register({ firstName: form.firstName.trim(), ...credentials });
      registered = true;
      // Registration does not return a token, so log in to start the session.
      await login(credentials);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(
        registered
          ? 'Account created. Please log in to continue.'
          : getErrorMessage(error, 'Unable to create your account. Please try again.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="A few details and your notes are ready."
      footer={
        <p>
          Already have an account? <Link className="auth-link" to="/login">Sign in</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {apiError && <div className="form-error" role="alert">{apiError}</div>}

        <div className="field">
          <label htmlFor="firstName">First name</label>
          <div className="field__control">
            <UserRound size={18} aria-hidden="true" />
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Your first name"
              value={form.firstName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
          </div>
          {errors.firstName && <span className="field__error" id="firstName-error">{errors.firstName}</span>}
        </div>

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
          <label htmlFor="password">Password</label>
          <div className="field__control">
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
          </div>
          {errors.password && <span className="field__error" id="password-error">{errors.password}</span>}
          {!errors.password && <span className="field__hint">Use at least 6 characters.</span>}
        </div>

        <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
          {!submitting && <ArrowRight size={18} aria-hidden="true" />}
        </button>
      </form>
    </AuthLayout>
  );
}
