import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts, deleteProduct, clearError } from "./productSlice";
import Loader from "../../components/Loader";
import ErrorAlert from "../../components/ErrorAlert";
import { Button } from "../../components/ui/button";
import ProductFormDialog from "../../components/ProductFormDialog";
import SearchSortBar from "../../components/SearchSortBar";
import type { Product } from "./types";

const ProductList = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.products);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"title" | "price">("title");

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleErrorClose = () => {
    dispatch(clearError());
  };

  // Filtering and sorting
  const filtered = list
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortKey === "title"
        ? a.title.localeCompare(b.title)
        : a.price - b.price
    );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      {error && (
        <div className="mb-4">
          <ErrorAlert msg={error} onClose={handleErrorClose} />
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
        <Button onClick={() => setShowAdd(true)}>Add Product</Button>
      </div>
      <SearchSortBar
        search={search}
        onSearch={setSearch}
        sort={sortKey}
        onSort={setSortKey}
      />
      {loading && <Loader />}
      {!loading && !filtered.length && (
        <ErrorAlert msg="No products found." />
      )}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {filtered.map((p) => (
          <div key={p.id} className="border rounded-lg shadow bg-white p-3 flex flex-col">
            <img src={p.image} alt={p.title} className="h-32 mx-auto object-contain mb-2" />
            <div className="font-bold">{p.title}</div>
            <div className="text-sm text-gray-500">{p.category}</div>
            <div className="mt-1 font-semibold">${p.price}</div>
            <div className="text-xs">Stock: {p.rating?.count ?? 'N/A'}</div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => setEditing(p)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => dispatch(deleteProduct(p.id))}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <ProductFormDialog open={showAdd || !!editing} onClose={() => { setShowAdd(false); setEditing(null); }} product={editing ?? undefined} />
    </div>
  );
};
export default ProductList;
