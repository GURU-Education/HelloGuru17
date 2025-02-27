"use client";
import React from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Dashboard</Card.Title>
              <Card.Text>
                This is a placeholder for your dashboard content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John</td>
                <td>Doe</td>
                <td>@johndoe</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane</td>
                <td>Smith</td>
                <td>@janesmith</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Bob</td>
                <td>Johnson</td>
                <td>@bobjohnson</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
