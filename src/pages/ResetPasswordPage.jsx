import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <Link className="auth-link" to="/login">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      }
    >
      <div className="notice-card" role="status">
        <span className="notice-card__icon"><Construction size={24} /></span>
        <h3>Waiting on the API</h3>
        <p>
          Password reset is not wired up yet. Once the backend exposes a reset
          endpoint, this page will accept a new password and complete the flow.
        </p>
        <p className="notice-card__meta">
          Until then, please contact your administrator if you are locked out.
        </p>
      </div>
    </AuthLayout>
  );
}
