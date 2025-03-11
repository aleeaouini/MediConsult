import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

// Exemple : Fonction qui récupère l'utilisateur connecté
const getUser = () => {
  return JSON.parse(localStorage.getItem("user")); 
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  console.log("Utilisateur actuel :", user);

  // Vérifier si l'utilisateur est connecté et a un rôle autorisé
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Validation des props avec PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.array.isRequired, // Liste des rôles autorisés
};

export default ProtectedRoute;
