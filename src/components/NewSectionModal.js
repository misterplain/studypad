import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function NewSectionModal({ show, onHide, onSubmit, loading, error }) {
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkEnabled, setLinkEnabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const payload = { title: title.trim(), parentId: null };
      if (linkEnabled && linkUrl.trim()) {
        payload.link = {
          url: linkUrl.trim(),
          label: linkLabel.trim() || undefined,
        };
      }
      onSubmit(payload);
    }
  };

  const handleClose = () => {
    setTitle("");
    setLinkUrl("");
    setLinkLabel("");
    setLinkEnabled(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Section</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group>
            <Form.Label>Section Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter section name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <hr />
          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="new-section-add-link"
              label="Add link"
              checked={linkEnabled}
              onChange={(e) => setLinkEnabled(e.target.checked)}
            />
          </Form.Group>
          {linkEnabled && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Link URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  inputMode="url"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Link Label (optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Open link"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !title.trim()}
          >
            {loading ? "Creating..." : "Create Section"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NewSectionModal;
