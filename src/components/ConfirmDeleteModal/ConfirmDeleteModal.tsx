import React from 'react';
import { Button, Modal } from 'react-bootstrap';

type ConfirmDeleteModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  /** Optional top header title (like "Delete Conversation"). If omitted, header is hidden. */
  headerTitle?: string;
  /** Main body title (e.g., "Are You Sure?"). */
  bodyTitle?: string;
  /** Main body message. */
  message: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  loading?: boolean;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  onClose,
  onConfirm,
  headerTitle,
  bodyTitle = 'Are You Sure?',
  message,
  cancelText = 'Cancel',
  confirmText = 'Delete',
  loading = false,
}) => {
  return (
    <Modal
      className="modal-theme modal-confirmation modal-reject"
      show={show}
      onHide={onClose}
      centered
      backdrop
      keyboard
    >
      {headerTitle ? (
        <Modal.Header>
          <h4 className="modal-title">{headerTitle}</h4>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
      ) : null}

      <Modal.Body>
        <div className="modal-confirmation-container">
          <div className="modal-confirmation-icon">
            <i className="material-symbols-outlined">delete</i>
          </div>
          <div className="modal-confirmation-content">
            {bodyTitle ? <h5>{bodyTitle}</h5> : null}
            <p>{message}</p>
          </div>
        </div>

        <div className="modal-button-group modal-full-width-btn modal-footer-button">
          <Button variant="light-white" className="btn-md" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="danger" className="btn-icon-text btn-md" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteModal;


