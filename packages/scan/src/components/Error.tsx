import styled from "styled-components";
import Button from "react-bootstrap/Button";

import { useAppDispatch } from "../store/hooks";
import { goToPage } from "../store/oasSlice";

export default function Error({ error }: { error: any }) {
  const dispatch = useAppDispatch();

  return (
    <Container>
      <p>
        <code>{error.message}</code>
      </p>
      <Button variant="primary" onClick={() => dispatch(goToPage("tryOperation"))}>
        Back
      </Button>
    </Container>
  );
}

const Container = styled.div``;
