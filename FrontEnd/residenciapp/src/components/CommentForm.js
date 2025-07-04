// src/components/CommentForm.js
import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import Navbar2 from "./navbar2";

const CommentForm = () => {
  const [studentId, setStudentId] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post("http://localhost:2000/comments", {
        comment: { student_id: studentId, content: content },
      });
      setMessage("Comment create");
      setContent("");
      setStudentId("");
    } catch (err) {
      setError("Hubo un error al crear el comentario");
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <div className="position-absolute top-0 w-100">
        <Navbar2 />
      </div><br></br><br></br>
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h2 className="text-center mb-4">Dejanos tu Comentario</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="studentId" className="mb-3">
              <Form.Label>ID Estudiante</Form.Label>
              <Form.Control
                type="number"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                placeholder="Ingresa tu ID de estudiante"
              />
            </Form.Group>

            <Form.Group controlId="content" className="mb-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Escribe tu comentario aquí..."
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" type="submit">
                Enviar Comentario
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CommentForm;
