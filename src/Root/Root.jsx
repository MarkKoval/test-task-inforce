import React from "react";
import { CssBaseline, Container } from "@mui/material";
import AddProductButton from "../components/addButton";
import ProductList from "../components/ProductList";

function Root() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <AddProductButton />
        <ProductList />
      </Container>
    </React.Fragment>
  );
}

export default Root;
