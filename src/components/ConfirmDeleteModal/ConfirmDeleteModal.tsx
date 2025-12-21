import React from 'react';
import { Button, Modal } from 'react-bootstrap';

type ConfirmDeleteModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  /** Optional modal className override (controls theme styling). */
  modalClassName?: string;
  /** Optional top header title (like "Delete Conversation"). If omitted, header is hidden. */
  headerTitle?: string;
  /** Main body title (e.g., "Are You Sure?"). */
  bodyTitle?: string;
  /** Material icon name for the left icon (defaults to "delete"). */
  iconName?: string;
  /** Main body message. */
  message: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  /** React-Bootstrap button variant for confirm button (defaults to "danger"). */
  confirmVariant?: string;
  /** Optional icon shown inside the confirm button (material icon name). */
  confirmIconName?: string;
  /** Text shown while loading (defaults to "Deleting..."). */
  loadingText?: string;
  loading?: boolean;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  onClose,
  onConfirm,
  modalClassName = 'modal-theme modal-confirmation modal-reject',
  headerTitle,
  bodyTitle = 'Are You Sure?',
  iconName = 'delete',
  message,
  cancelText = 'Cancel',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  confirmIconName,
  loadingText = 'Deleting...',
  loading = false,
}) => {
  return (
    <Modal
      className={modalClassName}
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
            <i className="material-symbols-outlined">{iconName}</i>
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
          <Button variant={confirmVariant} className="btn-icon-text btn-md" onClick={onConfirm} disabled={loading}>
            {loading ? (
              loadingText
            ) : (
              <>
                {confirmIconName ? (
                  <i className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }}>
                    {confirmIconName}
                  </i>
                ) : null}
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteModal;


