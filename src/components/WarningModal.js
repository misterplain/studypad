import React from "react";
import { Modal, Button } from "react-bootstrap";

function WarningModal({
  show,
  onHide,
  title = "Action not allowed",
  message = "This action cannot be completed.",
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WarningModal;
