import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { useAppDispatch } from "../app/hooks";
import { addProduct, updateProduct } from "../features/products/productSlice";
import type { Product } from "../features/products/types";

type Inputs = Omit<Product, "id" | "rating">;

const blank: Inputs = { title: "", price: 0, description: "", category: "", image: "" };

const ProductFormDialog = ({ open, onClose, product }: { open: boolean; onClose: () => void; product?: Product }) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Inputs>(blank);

  useEffect(() => {
    if (product) setForm({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
    else setForm(blank);
  }, [product, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      dispatch(updateProduct({ 
        ...product, 
        ...form, 
        rating: product.rating || { rate: 0, count: 0 } 
      }));
    } else {
      dispatch(addProduct(form));
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit" : "Add"} Product</DialogTitle>
          <DialogClose asChild>
            <button aria-label="Close" className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
              ×
            </button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-2">
          <input
            required value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title" className="border px-2 py-1 rounded"
          />
          <input
            required type="number"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
            placeholder="Price" className="border px-2 py-1 rounded"
          />
          <input
            required value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="Category" className="border px-2 py-1 rounded"
          />
          <input
            required value={form.image}
            onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            placeholder="Image URL" className="border px-2 py-1 rounded"
          />
          <textarea
            required value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description" className="border px-2 py-1 rounded"
          />
          <Button type="submit">{product ? "Update" : "Add"} Product</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ProductFormDialog;
