import styled from "styled-components";
import Button from "react-bootstrap/Button";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { goBack } from "../store/oasSlice";

export default function Error() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.oas.error!);

  return (
    <Container>
      <p>
        <code>{error.message}</code>
      </p>
      {error.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" && (
        <div>Failed to establish secure connection. Try disabling SSL validation in Settings</div>
      )}
      <Button variant="primary" onClick={() => dispatch(goBack())}>
        Back
      </Button>
    </Container>
  );
}

const Container = styled.div`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`;
