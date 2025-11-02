import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

// Flatten tree to options with indentation
const buildOptions = (
  allNotes,
  excludeIds = new Set(),
  depth = 0,
  acc = []
) => {
  if (!Array.isArray(allNotes)) return acc;
  for (const n of allNotes) {
    const id = n._id || n.id;
    const disabled = excludeIds.has(id);
    acc.push({
      value: id,
      label: `${"\u2014 ".repeat(depth)}${n.title}`,
      disabled,
    });
    if (Array.isArray(n.children) && n.children.length) {
      buildOptions(n.children, excludeIds, depth + 1, acc);
    }
  }
  return acc;
};

// Collect all descendant ids (including self) to prevent cycles
const collectDescendants = (node, set = new Set()) => {
  if (!node) return set;
  const id = node._id || node.id;
  set.add(id);
  if (Array.isArray(node.children)) {
    for (const c of node.children) collectDescendants(c, set);
  }
  return set;
};

function EditNoteModal({
  show,
  onHide,
  onSubmit,
  loading,
  error,
  note,
  allNotes,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [parentId, setParentId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkEnabled, setLinkEnabled] = useState(false);
  const [urgency, setUrgency] = useState(3);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setParentId(note.parentId || "");
      const l = note.link || null;
      setLinkUrl((l && (l.url || (typeof l === "string" ? l : ""))) || "");
      setLinkLabel((l && l.label) || "");
      setLinkEnabled(Boolean(l));
      setUrgency(note.urgency ?? 3);
    }
  }, [note]);

  const excluded = useMemo(() => collectDescendants(note), [note]);
  const options = useMemo(
    () => buildOptions(allNotes || [], excluded),
    [allNotes, excluded]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const updates = {
      title: title.trim(),
      content,
      parentId: parentId || null,
    };
    if (linkEnabled) {
      if (linkUrl.trim()) {
        updates.link = {
          url: linkUrl.trim(),
          label: linkLabel.trim() || undefined,
        };
      } else {
        // Link enabled but URL empty: clear link
        updates.link = null;
      }
    } else {
      // Link disabled toggle: clear link
      updates.link = null;
    }
    // Only allow urgency edits for leaf nodes (no children)
    const isLeaf = !note?.children || note.children.length === 0;
    if (isLeaf && [1, 2, 3].includes(Number(urgency))) {
      updates.urgency = Number(urgency);
    }
    onSubmit(updates);
  };

  const handleClose = () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Note</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {/* Parent selector */}
          <Form.Group className="mb-3">
            <Form.Label>Parent</Form.Label>
            <Form.Select
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value)}
              disabled={loading}
            >
              <option value="">No parent (top level)</option>
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* Urgency only for leaf items */}
          {(!note || !note.children || note.children.length === 0) && (
            <Form.Group className="mb-3">
              <Form.Label>Urgency</Form.Label>
              <Form.Select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                disabled={loading}
              >
                <option value={3}>3 (Purple - default)</option>
                <option value={2}>2 (Yellow)</option>
                <option value={1}>1 (Green)</option>
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Use ~~~js, ~~~html for code blocks"
            />
          </Form.Group>
          <hr />
          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="edit-item-add-link"
              label="Add link"
              checked={linkEnabled}
              onChange={(e) => setLinkEnabled(e.target.checked)}
              disabled={loading}
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
                  disabled={loading}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Link Label (optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Open link"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>
            </>
          )}
          {/* End conditional blocks */}
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditNoteModal;
