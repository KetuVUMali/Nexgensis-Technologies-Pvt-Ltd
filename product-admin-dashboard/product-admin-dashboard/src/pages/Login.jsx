import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandMark from '../components/BrandMark';
import usePageTitle from '../hooks/usePageTitle';
import { loginUser } from '../services/authService';
import { saveToken, saveUser } from '../utils/auth';
import { getErrorMessage } from '../utils/errorMessage';
import { validateLogin } from '../utils/validation';

export default function Login() {
  usePageTitle('Log in');
  const navigate = useNavigate();
  const location = useLocation();

  // If the user was sent here from a protected page, go back there after login.
  const from = location.state && location.state.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return; // a request is already running: ignore extra clicks

    // 1) Check the empty fields first, no request needed.
    const foundErrors = validateLogin({ username, password });
    setErrors(foundErrors);
    setServerError('');
    if (Object.keys(foundErrors).length > 0) return;

    // 2) Send the request. The button is disabled while loading is true.
    setLoading(true);
    try {
      const data = await loginUser({ username: username.trim(), password });
      const token = data.accessToken || data.token;
      if (!token) {
        setServerError('Login worked, but the server sent no token. Please try again.');
        setLoading(false);
        return;
      }
      saveToken(token);
      saveUser({
        id: data.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err)); // e.g. "Invalid credentials"
      setLoading(false);
    }
  }

  function fillDemoAccount() {
    setUsername('emilys');
    setPassword('emilyspass');
    setErrors({});
    setServerError('');
  }

  return (
    <div className="login-page">
      <section className="login-art d-none d-lg-flex" aria-hidden="true">
        <div className="d-flex align-items-center gap-2">
          <BrandMark size={40} />
          <span className="brand-font fs-5 fw-bold">Product Admin</span>
        </div>
        <div>
          <h2 className="login-headline">Keep every product in order.</h2>
          <p className="login-lead">Search the catalogue, fix a price, and check stock in a few clicks.</p>
        </div>
        <svg className="login-tags" viewBox="0 0 380 240" focusable="false">
          <g transform="rotate(-9 130 120)">
            <rect x="30" y="40" width="230" height="130" rx="20" fill="#17423c" />
            <circle cx="60" cy="105" r="10" fill="#0f2f2b" />
            <rect x="92" y="76" width="130" height="12" rx="6" fill="#2f7a6f" />
            <rect x="92" y="102" width="86" height="12" rx="6" fill="#2f7a6f" />
            <rect x="92" y="130" width="64" height="18" rx="9" fill="#e8a317" />
          </g>
          <g transform="rotate(7 250 140)">
            <rect x="150" y="80" width="200" height="118" rx="18" fill="#0b7a6b" />
            <circle cx="178" cy="139" r="9" fill="#0f2f2b" />
            <rect x="205" y="112" width="110" height="11" rx="5.5" fill="#bfe3dc" />
            <rect x="205" y="136" width="70" height="11" rx="5.5" fill="#7fc2b6" />
            <rect x="205" y="162" width="52" height="16" rx="8" fill="#ffffff" />
          </g>
        </svg>
      </section>

      <main className="login-panel">
        <div className="login-card card" data-aos="fade-up">
          <div className="card-body p-4 p-sm-5">
            <div className="d-lg-none mb-3">
              <BrandMark size={44} />
            </div>
            <h1 className="h3 mb-1">Log in</h1>
            <p className="text-secondary mb-4">Use your admin account to manage products.</p>

            {from && !serverError && (
              <div className="alert alert-info py-2" role="status">Please log in to open that page.</div>
            )}
            {serverError && (
              <div className="alert alert-danger py-2" role="alert">{serverError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  id="username"
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  autoFocus
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group has-validation">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                  </button>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </form>

            <div className="demo-box mt-4">
              <div className="small text-secondary">Demo account: <strong>emilys</strong> / <strong>emilyspass</strong></div>
              <button type="button" className="btn btn-link btn-sm p-0" onClick={fillDemoAccount}>
                Fill in the demo account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
