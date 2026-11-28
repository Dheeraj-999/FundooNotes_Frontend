import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Password recovery"
      subtitle="Here's where account recovery will live."
      footer={
        <Link className="auth-link" to="/login">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      }
    >
      <div className="notice-card" role="status">
        <span className="notice-card__icon"><Construction size={24} /></span>
        <h3>Not available yet</h3>
        <p>
          The backend does not expose a forgot-password endpoint. The OTP endpoints
          under <code>/api/redis/otp/*</code> are debug utilities and never change a
          password, so this screen will not pretend to send a reset link.
        </p>
        <p className="notice-card__meta">
          Ask the backend team to add <code>POST /api/users/forgot-password</code> and
          <code> POST /api/users/reset-password</code>, then this screen can be enabled.
        </p>
      </div>
    </AuthLayout>
  );
}
