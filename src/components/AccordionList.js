import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Removed unused Button/ButtonGroup and switched to Bootstrap icons to avoid FA import mismatches
import { Button, ButtonGroup } from "react-bootstrap";
import { BsPlus, BsPencil, BsTrash } from "react-icons/bs";
import Accordion from "react-bootstrap/Accordion";
import HighlightedCodeBlock from "./HighlightedCodeBlock";
import NewItemModal from "./NewItemModal";
import EditNoteModal from "./EditNoteModal";
import WarningModal from "./WarningModal";
import { parseMixedContent } from "../utils/contentParser";
// import React, { useMemo, useState } from "react";
// Removed unused Button/ButtonGroup
// import { FaPlus, FaPen, FaTrash } from "react-icons/fa";
// import Accordion from "react-bootstrap/Accordion";
// import HighlightedCodeBlock from "./HighlightedCodeBlock";
// import NewItemModal from "./NewItemModal";
// import EditNoteModal from "./EditNoteModal";
// import WarningModal from "./WarningModal";
// import { parseMixedContent } from "../utils/contentParser";
import { createNote, updateNote, deleteNote } from "../store/noteActions";
import { clearNoteError } from "../store/noteSlice";

function renderText(text) {
  // Split on blank line to paragraphs
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map((p, idx) => (
    <p key={idx} className="mb-2">
      {p}
    </p>
  ));
}

function AccordionList({ items, defaultActiveKey, parentId = null }) {
  const dispatch = useDispatch();
  const {
    actionLoading,
    actionError,
    notes: allNotes,
    filters,
  } = useSelector((state) => state.notes);
  const [showModal, setShowModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const selectedUrgencies = filters?.urgency || { 1: true, 2: true, 3: true };

  const urgencyDot = (urg) => {
    const size = 8;
    const color = urg === 1 ? "#198754" : urg === 2 ? "#FFC107" : "#6f42c1"; // green, yellow, purple
    return (
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: color,
          marginRight: 8,
        }}
      />
    );
  };

  // Compute display urgency (leaf: own; parent: max of descendants)
  const urgencyCache = new Map();
  const computeUrgency = (node) => {
    if (!node) return 3;
    const key = node._id || node.id || node.title;
    if (urgencyCache.has(key)) return urgencyCache.get(key);
    const hasChildren =
      Array.isArray(node.children) && node.children.length > 0;
    let val = node.urgency ?? 3;
    if (hasChildren) {
      let maxChild = 0;
      for (const c of node.children) {
        const cu = computeUrgency(c);
        if (cu > maxChild) maxChild = cu;
      }
      val = maxChild || val || 3;
    }
    urgencyCache.set(key, val);
    return val;
  };

  // Filter tree to selected urgencies; keep parents if any descendant matches
  const filterTree = (nodes) => {
    if (!Array.isArray(nodes)) return [];
    const out = [];
    for (const n of nodes) {
      const children = Array.isArray(n.children) ? filterTree(n.children) : [];
      const isLeaf = !n.children || n.children.length === 0;
      const urg = computeUrgency(n);
      const selfMatch = isLeaf ? !!selectedUrgencies[urg] : false;
      if (selfMatch || children.length > 0) {
        out.push({ ...n, children });
      }
    }
    return out;
  };

  const sortTree = (nodes) => {
    if (!Array.isArray(nodes)) return [];
    const copy = nodes.map((n) => ({
      ...n,
      children: sortTree(n.children || []),
    }));
    copy.sort((a, b) => {
      const ua = computeUrgency(a);
      const ub = computeUrgency(b);
      if (ub !== ua) return ub - ua; // 3 -> 1
      const oa = a.order ?? 0;
      const ob = b.order ?? 0;
      if (oa !== ob) return oa - ob;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    return copy;
  };

  const preparedItems = React.useMemo(
    () => sortTree(filterTree(items)),
    [items, filters]
  );

  const handleCreateItem = async (itemData) => {
    const parentIdVal = selectedParent?._id || selectedParent?.id;
    const result = await dispatch(
      createNote({ ...itemData, parentId: parentIdVal })
    );
    if (createNote.fulfilled.match(result)) {
      setShowModal(false);
      setSelectedParent(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedParent(null);
    dispatch(clearNoteError());
  };

  const handleNewItemClick = (item) => {
    setSelectedParent(item);
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setEditTarget(item);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (updates) => {
    const id = editTarget?._id || editTarget?.id;
    const result = await dispatch(updateNote({ id, updates }));
    if (updateNote.fulfilled.match(result)) {
      setShowEditModal(false);
      setEditTarget(null);
    }
  };

  const handleDeleteClick = async (item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      setShowWarning(true);
      return;
    }
    const itemId = item._id || item.id;
    const result = await dispatch(deleteNote(itemId));
    if (deleteNote.fulfilled.match(result)) {
      // no-op, store already updated with full tree
    }
  };

  return (
    <>
      <Accordion defaultActiveKey={defaultActiveKey} alwaysOpen>
        {preparedItems.map((item, idx) => {
          const itemId = item._id || item.id;
          const segments = item.content
            ? Array.isArray(item.content)
              ? item.content
              : parseMixedContent(item.content)
            : [];
          const stop = (e, fn) => {
            e.stopPropagation();
            e.preventDefault();
            fn();
          };
          const keyActivate = (e, fn) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              fn();
            }
          };
          return (
            <Accordion.Item eventKey={String(idx)} key={itemId ?? idx}>
              <Accordion.Header>
                <div className="d-flex w-100 align-items-center">
                  <span className="me-auto d-flex align-items-center">
                    {urgencyDot(computeUrgency(item))}
                    <span>{item.title}</span>
                  </span>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      role="button"
                      tabIndex={0}
                      className="text-success"
                      title="Add item"
                      onClick={(e) => stop(e, () => handleNewItemClick(item))}
                      onKeyDown={(e) =>
                        keyActivate(e, () => handleNewItemClick(item))
                      }
                      aria-label="Add item"
                    >
                      <BsPlus />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="text-secondary"
                      title="Edit item"
                      onClick={(e) => stop(e, () => handleEditClick(item))}
                      onKeyDown={(e) =>
                        keyActivate(e, () => handleEditClick(item))
                      }
                      aria-label="Edit item"
                    >
                      <BsPencil />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="text-danger"
                      style={{ cursor: "pointer", marginRight: "8px" }}
                      title="Delete item"
                      onClick={(e) => stop(e, () => handleDeleteClick(item))}
                      onKeyDown={(e) =>
                        keyActivate(e, () => handleDeleteClick(item))
                      }
                      aria-label="Delete item"
                    >
                      <BsTrash />
                    </span>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {item.link && (
                  <p className="mb-2">
                    <a
                      href={
                        typeof item.link === "string"
                          ? item.link
                          : item.link.url
                      }
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {typeof item.link === "string"
                        ? "Open link"
                        : item.link.label || "Open link"}
                    </a>
                  </p>
                )}
                {segments.length > 0 && (
                  <div className="mb-2">
                    {segments.map((seg, i) =>
                      seg.type === "code" ? (
                        <HighlightedCodeBlock
                          key={`code-${i}`}
                          language={seg.language}
                          code={seg.code}
                        />
                      ) : (
                        <div key={`text-${i}`}>{renderText(seg.text)}</div>
                      )
                    )}
                  </div>
                )}
                {Array.isArray(item.children) && item.children.length > 0 && (
                  <div className="ms-2">
                    <AccordionList items={item.children} parentId={itemId} />
                  </div>
                )}
                {/* Action icons moved to header */}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <NewItemModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleCreateItem}
        loading={actionLoading}
        error={actionError}
        parentTitle={selectedParent?.title}
      />
      <EditNoteModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        loading={actionLoading}
        error={actionError}
        note={editTarget}
        allNotes={allNotes}
      />
      <WarningModal
        show={showWarning}
        onHide={() => setShowWarning(false)}
        title="Cannot delete"
        message="This note has children. Remove or move its children first."
      />
    </>
  );
}

export default AccordionList;
