import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteProduct, fetchProducts } from "./productSlice";
import {
  DialogContentText,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

import { addComment, deleteComment } from "./commentSlice";

const ProductList = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const [sortOption, setSortOption] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewMore = (product) => {
    setSelectedProduct(product);
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "name":
        return a.name.localeCompare(b.name);
      case "id":
        return a.id - b.id;
      case "count":
        return a.count - b.count;
      case "weight":
        const weightA = String(a.weight || "").replace(/\D/g, "");
        const weightB = String(b.weight || "").replace(/\D/g, "");
        return parseInt(weightA, 10) - parseInt(weightB, 10);
      default:
        return 0;
    }
  });

  const ProductDetailsDialog = ({ product, onClose }) => {
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);

    const handleSaveProduct = async () => {
      await fetch(`http://localhost:3001/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      setIsEditMode(false);
      onClose();
    };
    const [errors, setErrors] = useState({ imageUrl: "" });
    const handleProductChange = (e, field) => {
      if (e.target.name === "imageUrl") {
        if (e.target.name === "imageUrl") {
          const isValidUrl =
            e.target.value.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
          if (!isValidUrl) {
            setErrors({
              ...errors,
              imageUrl: "Please enter a valid image URL.",
            });
          } else {
            setErrors({ ...errors, imageUrl: "" });
          }
        }
      }
      const updatedProduct = { ...product, [field]: e.target.value };
      setSelectedProduct(updatedProduct);
    };

    useEffect(() => {
      const fetchComments = async () => {
        const response = await fetch(
          `http://localhost:3001/comments?productId=${product.id}`
        );
        const data = await response.json();
        setComments(data);
      };

      fetchComments();
    }, [product.id]);

    const handleSubmitComment = async () => {
      const response = await fetch("http://localhost:3001/comments");
      const comments = await response.json();
      const currentMaxId = comments.reduce(
        (max, comment) => Math.max(max, comment.id),
        0
      );

      const newCommentData = {
        id: currentMaxId + 1,
        productId: product.id,
        description: commentText,
        date: new Date().toISOString(),
      };
      dispatch(addComment(newCommentData))
        .unwrap()
        .then((addedComment) => {
          setComments((currentComments) => [...currentComments, addedComment]);
          setCommentText("");
        })
        .catch((error) => {
          console.error("Failed to add comment:", error);
        });
    };

    const handleDeleteComment = (commentId) => {
      dispatch(deleteComment(commentId))
        .then(() => {
          setComments((currentComments) =>
            currentComments.filter((comment) => comment.id !== commentId)
          );
        })
        .catch((error) => {
          console.error("Failed to delete comment:", error);
        });
    };

    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {isEditMode ? (
            <>
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
                onChange={(e) => handleProductChange(e, "imageUrl")}
                error={!!errors.imageUrl}
                helperText={errors.imageUrl}
              />
              <TextField
                margin="dense"
                id="name"
                name="name"
                label="Product Name"
                type="text"
                fullWidth
                variant="standard"
                value={product.name}
                onChange={(e) => handleProductChange(e, "name")}
              />
              <TextField
                margin="dense"
                id="count"
                name="count"
                label="Count"
                type="number"
                fullWidth
                variant="standard"
                value={product.count}
                onChange={(e) => handleProductChange(e, "count")}
              />
              <TextField
                margin="dense"
                id="width"
                name="width"
                label="Width"
                type="number"
                fullWidth
                variant="standard"
                value={product.size.width}
                onChange={(e) => handleProductChange(e, "width")}
              />
              <TextField
                margin="dense"
                id="height"
                name="height"
                label="Height"
                type="number"
                fullWidth
                variant="standard"
                value={product.size.height}
                onChange={(e) => handleProductChange(e, "height")}
              />
              <TextField
                margin="dense"
                id="weight"
                name="weight"
                label="Weight"
                type="text"
                fullWidth
                variant="standard"
                value={product.weight}
                onChange={(e) => handleProductChange(e, "weight")}
              />
            </>
          ) : (
            <div>
              <img alt={product.name} src={product.imageUrl} loading="lazy" />
              <p>Name: {product.name}</p>
              <p>Count: {product.count}</p>
              <p>Weight: {product.weight}</p>
            </div>
          )}

          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={comment.description}
                  secondary={new Date(comment.date).toLocaleString()}
                />
                <Button
                  onClick={() => handleDeleteComment(comment.id)}
                  color="error"
                >
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
          <TextField
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          {isEditMode ? (
            <>
              <Button onClick={toggleEditMode}>Cancel</Button>
              <Button onClick={handleSaveProduct}>Save</Button>
            </>
          ) : (
            <>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleSubmitComment}>Submit Comment</Button>
              <Button onClick={toggleEditMode}>Edit</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };
  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-select-label">Sort By</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortOption}
          onChange={handleSortChange}
          label="Sort By"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="id">ID</MenuItem>
          <MenuItem value="count">Count</MenuItem>
          <MenuItem value="weight">Weight</MenuItem>
        </Select>
      </FormControl>
      <List>
        {sortedProducts.map((product) => (
          <ListItem key={product.id}>
            <ListItemText
              primary={product.name}
              secondary={` Count: ${product.count}, Weight: ${product.weight}g, Width: ${product.size.width}, Height: ${product.size.height}`}
            />
            <Button
              onClick={() => handleOpenDeleteDialog(product)}
              color="error"
            >
              Delete
            </Button>
            <Button onClick={() => handleViewMore(product)}>View More</Button>
          </ListItem>
        ))}
      </List>
      {selectedProduct && (
        <ProductDetailsDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteProduct(productToDelete.id));
              setDeleteDialogOpen(false);
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
