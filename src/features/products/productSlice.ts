import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./types";

const BASE = "https://fakestoreapi.com/products";

interface State {
  list: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: State = { list: [], loading: false, error: null };

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error("Fetch failed");
  return (await r.json()) as Product[];
});

export const addProduct = createAsyncThunk(
  "products/add",
  async (p: Omit<Product, "id" | "rating">) => {
    const r = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, rating: { rate: 0, count: 0 } }),
    });
    if (!r.ok) throw new Error("Add failed");
    return (await r.json()) as Product;
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (p: Product) => {
    const r = await fetch(`${BASE}/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (!r.ok) throw new Error("Update failed");
    return (await r.json()) as Product;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number) => {
    const r = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Delete failed");
    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    // Fetch Products
    b.addCase(fetchProducts.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchProducts.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(fetchProducts.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || "Failed to fetch products";
    });

    // Add Product
    b.addCase(addProduct.pending, (s) => {
      s.error = null;
    });
    b.addCase(addProduct.fulfilled, (s, a) => {
      s.list.push(a.payload);
    });
    b.addCase(addProduct.rejected, (s, a) => {
      s.error = a.error.message || "Failed to add product";
    });

    // Update Product
    b.addCase(updateProduct.pending, (s) => {
      s.error = null;
    });
    b.addCase(updateProduct.fulfilled, (s, a) => {
      s.list = s.list.map((p) => (p.id === a.payload.id ? a.payload : p));
    });
    b.addCase(updateProduct.rejected, (s, a) => {
      s.error = a.error.message || "Failed to update product";
    });

    // Delete Product
    b.addCase(deleteProduct.pending, (s) => {
      s.error = null;
    });
    b.addCase(deleteProduct.fulfilled, (s, a) => {
      s.list = s.list.filter((p) => p.id !== a.payload);
    });
    b.addCase(deleteProduct.rejected, (s, a) => {
      s.error = a.error.message || "Failed to delete product";
    });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
