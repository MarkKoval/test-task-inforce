import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product) => {
    const response = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    fetchProducts();
    return await response.json();
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("http://localhost:3001/products");
    const products = await response.json();
    return products;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const productResponse = await fetch(
        `http://localhost:3001/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!productResponse.ok) {
        throw new Error(`Failed to delete product with ID ${productId}`);
      }

      const commentsResponse = await fetch(
        `http://localhost:3001/comments?productId=${productId}`
      );
      if (!commentsResponse.ok) {
        throw new Error(`Failed to fetch comments for product ID ${productId}`);
      }

      const comments = await commentsResponse.json();

      const deletePromises = comments.map((comment) =>
        fetch(`http://localhost:3001/comments/${comment.id}`, {
          method: "DELETE",
        })
      );
      await Promise.all(deletePromises);

      return productId;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {
    sortProducts: (state, action) => {
      state.items.sort((a, b) => {
        switch (action.payload) {
          case "name":
            return a.name.localeCompare(b.name);
          case "count":
            return a.count - b.count;
          default:
            return 0;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { sortProducts } = productSlice.actions;
export default productSlice.reducer;
