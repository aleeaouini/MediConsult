import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUserMd, FaUser } from 'react-icons/fa';
import { useUser } from '../../context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState(null);
  const navigate = useNavigate();
  const { HandleLoginUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && email && loginType != null) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', { 
          email, 
          password, 
          loginType 
        });
        
        setError('');
        HandleLoginUser({ ...response.data.user, role: loginType });
        localStorage.setItem('token', response.data.token);
        
        if (response.data.loginType === "patient") {
          navigate('/consult');
        }
        if (response.data.loginType === "doctor") {
          navigate('/doctor');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Erreur de connexion');
      }
    } else {
      setError('Veuillez remplir tous les champs et sélectionner un type de compte');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaUserMd className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Espace Consultation</h1>
          <p className="text-gray-600 mt-2">Accédez à votre espace personnel</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex gap-4 p-1 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                loginType === 'patient'
                  ? 'bg-white shadow text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <FaUser className="w-4 h-4" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                loginType === 'doctor'
                  ? 'bg-white shadow text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <FaUserMd className="w-4 h-4" />
              <span>Docteur</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Votre email"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Votre mot de passe"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Se connecter
          </button>

          <div className="text-center pt-4">
            <a
              href="/signup"
              className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
              Pas encore inscrit ? Créer un compte
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;