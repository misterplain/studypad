import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Login from "../components/Login";
import Register from "../components/Register";

function Auth() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card>
            <Card.Body>
              {showRegister ? (
                <Register onToggle={() => setShowRegister(false)} />
              ) : (
                <Login onToggle={() => setShowRegister(true)} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Auth;
