import { useEffect, useState } from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";

function App() {
  const theme = useAppSelector((state) => state.theme);

  return (
    <>
      <ThemeStyles theme={theme} />
      <Container>
        <Form>
          <FloatingLabel label="Email address">
            <Form.Control type="email" placeholder="name@example.com" />
          </FloatingLabel>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 600px;
  margin-left: 100px;
`;

export default App;
