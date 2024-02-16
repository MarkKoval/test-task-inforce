import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "./productSlice";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddProductButton = () => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errors, setErrors] = useState({ imageUrl: "" });
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({
    imageUrl: "",
    name: "",
    count: 1,
    size: { width: 100, height: 100 },
    weight: 100,
  });

  const handleChange = (e) => {
    if (e.target.name === "imageUrl") {
      if (e.target.name === "imageUrl") {
        const isValidUrl =
          e.target.value.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
        if (!isValidUrl) {
          setErrors({ ...errors, imageUrl: "Please enter a valid image URL." });
        } else {
          setErrors({ ...errors, imageUrl: "" });
        }
      }
    }

    if (e.target.name === "width" || e.target.name === "height") {
      setProduct({
        ...product,
        size: {
          ...product.size,
          [e.target.name]: parseInt(e.target.value, 10),
        },
      });
    } else if (e.target.name === "count") {
      setProduct({ ...product, [e.target.name]: parseInt(e.target.value, 10) });
    } else if (e.target.name.startsWith("comment")) {
      setProduct({ ...product });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); 

    let formIsValid = true;
    let errors = {};

    if (!product.imageUrl) {
      errors.imageUrl = "Image URL is required";
      formIsValid = false;
    }
    if (!product.name) {
      errors.name = "Product name is required";
      formIsValid = false;
    }
    if (!product.count) {
      errors.count = "Count is required";
      formIsValid = false;
    }
    if (!product.size.width) {
      errors.width = "Width is required";
      formIsValid = false;
    }
    if (!product.size.height) {
      errors.height = "Height is required";
      formIsValid = false;
    }
    if (!product.weight) {
      errors.weight = "Weight is required";
      formIsValid = false;
    }

    setErrors(errors);

    if (formIsValid) {
      // Submit the product data
      const response = await fetch("http://localhost:3001/products");
      const products = await response.json();
      const currentMaxId = products.reduce(
        (max, product) => Math.max(max, product.id),
        0
      );
      const newProductWithId = { ...product, id: currentMaxId + 1 };
      dispatch(addProduct(newProductWithId));
      handleClose();
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add Product</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleFormSubmit}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add a New Product
            </Typography>

            <TextField
              autoFocus
              required
              margin="dense"
              id="imageUrl"
              name="imageUrl"
              label="Image URL"
              type="text"
              fullWidth
              variant="standard"
              value={product.imageUrl}
              onChange={handleChange}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
            />
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Product Name"
              type="text"
              fullWidth
              variant="standard"
              value={product.name}
              onChange={handleChange}
            />
            <TextField
              required
              margin="dense"
              id="count"
              name="count"
              label="Count"
              type="number"
              fullWidth
              variant="standard"
              value={product.count}
              onChange={handleChange}
            />
            <TextField
              required
              margin="dense"
              id="width"
              name="width"
              label="Width"
              type="number"
              fullWidth
              variant="standard"
              value={product.size.width}
              onChange={handleChange}
            />
            <TextField
              required
              margin="dense"
              id="height"
              name="height"
              label="Height"
              type="number"
              fullWidth
              variant="standard"
              value={product.size.height}
              onChange={handleChange}
            />
            <TextField
              required
              margin="dense"
              id="weight"
              name="weight"
              label="Weight"
              type="text"
              fullWidth
              variant="standard"
              value={product.weight}
              onChange={handleChange}
            />
            <Button type="submit">Add</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddProductButton;
