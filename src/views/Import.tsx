import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";
import { importJSONFromFile } from "../database/db";

const Import: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = params.get("data");

    if (data) {
      const jsonString = decodeURIComponent(atob(data));
      const decodedData = JSON.parse(jsonString);

      // Mensagem de confirmação antes de importar
      const confirmImport = window.confirm("Você tem certeza que deseja importar os dados? Isso sobrescreverá os dados existentes.");

      if (confirmImport) {
        // Importando diretamente o objeto JSON
        importJSONFromFile(decodedData)
          .then(() => {
            showToast("Dados importados com sucesso!", "success");
            navigate("/home");
          })
          .catch((error) => {
            console.error("Erro ao importar dados:", error);
            showToast("Erro ao importar dados", "danger");
            navigate("/home");
          });
      } else {
        navigate("/home"); // Se o usuário cancelar, redireciona para a home
      }
    } else {
      navigate("/home");
    }
  }, [location.search, navigate, showToast]);

  return null;
};

export default Import;
