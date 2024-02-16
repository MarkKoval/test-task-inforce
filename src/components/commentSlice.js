import { createAsyncThunk } from "@reduxjs/toolkit";

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const commentResponse = await fetch(
        `http://localhost:3001/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!commentResponse.ok) {
        throw new Error(`Failed to delete comment with ID ${commentId}`);
      }
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
