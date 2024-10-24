import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { ToastType } from "../types";

interface ToastNotificationProps {
  toasts: Array<ToastType>;
  removeToast: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, removeToast }) => {
  const [animateOut, setAnimateOut] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initialState = toasts.reduce((acc, toast) => {
      acc[toast.id] = false;
      return acc;
    }, {} as { [key: string]: boolean });
    
    setAnimateOut(initialState);
  }, [toasts]);

  const handleClose = (id: string) => {
    setAnimateOut(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      removeToast(id);
    }, 300);
  };

  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed bottom-0 end-0">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClose={() => handleClose(toast.id)}
          className={`mb-3 rounded ${animateOut[toast.id] ? "toast-animate-out" : "toast-animate-in"}`}
          autohide
          delay={3000}
        >
          <Toast.Header className={`bg-${toast.variant} text-white`}>
            <strong className="me-auto">
              {toast.variant === "success" && "Successo"}
              {toast.variant === "danger" && "Erro"}
              {toast.variant === "warning" && "Alerta"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-dark bg-white rounded-bottom">{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastNotification;
