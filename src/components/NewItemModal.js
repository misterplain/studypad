import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function NewItemModal({ show, onHide, onSubmit, loading, error, parentTitle }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkEnabled, setLinkEnabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const payload = {
        title: title.trim(),
        content: content.trim(),
      };
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
    setContent("");
    setLinkUrl("");
    setLinkLabel("");
    setLinkEnabled(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          New Item {parentTitle && `in "${parentTitle}"`}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Item Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Enter content with optional code blocks using ~~~language"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Form.Text className="text-muted">
              Use ~~~js or ~~~html to add code blocks
            </Form.Text>
          </Form.Group>
          <hr />
          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="new-item-add-link"
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
          <Form.Group className="mb-2">
            <Form.Label>Link URL (optional)</Form.Label>
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
            {loading ? "Creating..." : "Create Item"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NewItemModal;
