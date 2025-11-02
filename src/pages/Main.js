import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Alert, Spinner, Form } from "react-bootstrap";
import SectionTitle from "../components/SectionTitle";
import AccordionList from "../components/AccordionList";
import NewSectionModal from "../components/NewSectionModal";
import { fetchNotes, createNote } from "../store/noteActions";
import { clearNoteError } from "../store/noteSlice";

function Main() {
  const dispatch = useDispatch();
  const { notes, loading, error, actionLoading, actionError, filters } =
    useSelector((state) => state.notes);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotes());
    }
  }, [dispatch, isAuthenticated]);

  const handleCreateSection = async (sectionData) => {
    const result = await dispatch(createNote(sectionData));
    if (createNote.fulfilled.match(result)) {
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearNoteError());
  };

  return (
    <div className="container py-3">
      <SectionTitle
        title="StudyPad Reference"
        subtitle="Code + Notes, organized by sections"
      />

      <div className="mb-3">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + New Section
        </Button>
      </div>

      {/* Urgency filter controls */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-3">
          <strong>Show urgency:</strong>
          <Form.Check
            inline
            type="checkbox"
            id="urgency-3"
            label="3"
            checked={filters.urgency[3]}
            onChange={(e) =>
              dispatch({
                type: "notes/setUrgencyFilter",
                payload: { level: 3, checked: e.target.checked },
              })
            }
          />
          <Form.Check
            inline
            type="checkbox"
            id="urgency-2"
            label="2"
            checked={filters.urgency[2]}
            onChange={(e) =>
              dispatch({
                type: "notes/setUrgencyFilter",
                payload: { level: 2, checked: e.target.checked },
              })
            }
          />
          <Form.Check
            inline
            type="checkbox"
            id="urgency-1"
            label="1"
            checked={filters.urgency[1]}
            onChange={(e) =>
              dispatch({
                type: "notes/setUrgencyFilter",
                payload: { level: 1, checked: e.target.checked },
              })
            }
          />
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => dispatch(clearNoteError())}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : !isAuthenticated ? (
        <Alert variant="warning">Please log in to view and create notes.</Alert>
      ) : notes.length > 0 ? (
        <AccordionList items={notes} defaultActiveKey={"0"} />
      ) : (
        <Alert variant="info">
          No sections yet. Click "New Section" to get started!
        </Alert>
      )}

      <NewSectionModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleCreateSection}
        loading={actionLoading}
        error={actionError}
      />
    </div>
  );
}

export default Main;
