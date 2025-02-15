import React from 'react';
import '../styles/Modal.css'; // Ensure you create corresponding styles

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Thank You!</h2>
        <p>Got your message! Can't wait to connect with you soon! ❤️.</p>
        <button onClick={onClose} className="modal-close-button">Close</button>
      </div>
    </div>
  );
};

export default Modal;