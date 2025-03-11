import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaEnvelope, FaPhone, FaBirthdayCake, FaLock } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';

const Inscrit = () => {
  const [formData, setFormData] = useState({
    lastname: '',
    username: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    specialty: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { phone, age, password } = formData;

    if (!/^\d{8}$/.test(phone)) {
      setError('Le numéro de téléphone doit contenir exactement 8 chiffres.');
      return false;
    }

    if (!/^\d{1,2}$/.test(age)) {
      setError('L\'âge doit contenir 2 chiffres maximum.');
      return false;
    }

    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/~\\-]).{8,}$/.test(password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un symbole.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (Object.values(formData).some((field) => !field.trim())) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:3000/auth/register-docteur', formData);
      setSuccessMessage('Inscription réussie !');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faStethoscope} className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Inscription Docteur</h1>
          <p className="text-gray-600 mt-2">Créez votre compte professionnel</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUserAlt className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Nom"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUserAlt className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Prénom"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Email"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faStethoscope} className="h-5 w-5 text-blue-500" />
              </div>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                required
              >
                <option value="">Sélectionnez une spécialité</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Dentiste">Dentiste</option>
                <option value="Généraliste">Généraliste</option>
                <option value="Généraliste">Généraliste</option>
                <option value="Gynécologue">Gynécologue</option>
                <option value="Ophtalmologue">Ophtalmologue</option>
                <option value="Psychiatre">Psychiatre</option>
                <option value="Chirurgien">Chirurgien</option>
                <option value="Radiologue">Radiologue</option>
                <option value="Cardiologue">Cardiologue</option>
                <option value="Neurologue">Neurologue</option>
                <option value="Dermatologue">Dermatologue</option>

              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Téléphone"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaBirthdayCake className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Âge"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Mot de passe"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            S inscrire
          </button>

          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full mt-4 bg-white text-blue-600 py-3 px-4 rounded-lg font-medium border-2 border-blue-500 hover:bg-blue-50 transition-all"
          >
            S inscrire en tant que Patient
          </button>

          <div className="text-center pt-4">
            <a
              href="/login"
              className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
              Déjà inscrit ? Connectez-vous ici
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inscrit;