import { Dispatch, SetStateAction } from "react";
import { FormErrors } from "../types";

// Função genérica para manipular mudanças em formulários
export const handleInputChange = <T>(
  e: React.ChangeEvent<HTMLInputElement>,
  formData: T,
  setFormData: Dispatch<SetStateAction<T>>,
  formErrors: FormErrors,
  setFormErrors: Dispatch<SetStateAction<FormErrors>>
) => {
  const { name, value } = e.target;

  // Atualiza o estado do formulário com o novo valor
  setFormData({ ...formData, [name]: value });

  // Reseta o erro no campo correspondente, se houver
  if (formErrors[name]) {
    setFormErrors({ ...formErrors, [name]: false });
  }
};
