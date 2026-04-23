import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', creds);
      localStorage.setItem('token', res.data.token); 
      navigate('/dashboard');
    } catch (err) { alert("Invalid Credentials"); }
  };

  return (
    <div className="d-flex align-items-center justify-content-center w-100" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', margin: '-1.5rem', padding: '1.5rem', width: 'calc(100% + 3rem)' }}>
      <div className="card border-0 shadow-lg p-5" style={{ width: '100%', maxWidth: '450px', borderRadius: '1.5rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="text-center mb-5">
          <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
            🔒
          </div>
          <h2 className="fw-bolder text-dark mb-1">Welcome Back</h2>
          <p className="text-muted small">Sign in to the Campus System</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input type="email" className="form-control border-0 bg-light" id="floatingEmail" placeholder="name@example.com" onChange={e => setCreds({...creds, email: e.target.value})} required style={{ borderRadius: '1rem' }} />
            <label htmlFor="floatingEmail" className="text-muted">Email address</label>
          </div>
          <div className="form-floating mb-4">
            <input type="password" className="form-control border-0 bg-light" id="floatingPassword" placeholder="Password" onChange={e => setCreds({...creds, password: e.target.value})} required style={{ borderRadius: '1rem' }} />
            <label htmlFor="floatingPassword" className="text-muted">Password</label>
          </div>
          
          <button className="btn btn-primary btn-lg w-100 fw-bold shadow-sm" style={{ borderRadius: '1rem', padding: '12px' }}>
            Sign In
          </button>
        </form>
        
        <div className="text-center mt-4">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="text-decoration-none fw-bold text-primary small">Create one</Link>
        </div>
      </div>
    </div>
  );
}