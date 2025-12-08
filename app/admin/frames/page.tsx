"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function AdminFramesPage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFrame, setEditingFrame] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    frame_material: "",
    frame_size: "",
    tags: "",
    imageUrl: "",
    stock: "",
  });

  useEffect(() => {
    fetchFrames();
  }, []);

  const fetchFrames = async () => {
    const res = await fetch("/api/frames");
    const data = await res.json();
    if (data.success) {
      setFrames(data.data);
    }
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingFrame
      ? `/api/frames/edit/${editingFrame._id}`
      : "/api/frames";
    const method = editingFrame ? "PUT" : "POST";

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      toast({
        title: editingFrame ? "Frame Updated" : "Frame Created",
        description: "The frame has been saved successfully.",
      });
      setShowForm(false);
      setEditingFrame(null);
      resetForm();
      fetchFrames();
    } else {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this frame?")) return;

    const res = await fetch(`/api/frames/edit/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      toast({ title: "Frame Deleted", description: "Frame removed successfully." });
      fetchFrames();
    }
  };

  const handleEdit = (frame: any) => {
    setEditingFrame(frame);
    setFormData({
      title: frame.title,
      description: frame.description,
      price: frame.price.toString(),
      category: frame.category,
      frame_material: frame.frame_material,
      frame_size: frame.frame_size,
      tags: frame.tags.join(", "),
      imageUrl: frame.imageUrl,
      stock: frame.stock.toString(),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      frame_material: "",
      frame_size: "",
      tags: "",
      imageUrl: "",
      stock: "",
    });
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Frames</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingFrame(null);
            resetForm();
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Frame
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="frame_material">Material</Label>
                  <Input
                    id="frame_material"
                    name="frame_material"
                    value={formData.frame_material}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="frame_size">Size</Label>
                  <Input
                    id="frame_size"
                    name="frame_size"
                    value={formData.frame_size}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? "Saving..." : editingFrame ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFrame(null);
                    resetForm();
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {frames.map((frame: any) => (
          <Card key={frame._id}>
            <CardContent className="p-3 sm:p-4">
              <div className="relative mb-4 aspect-square overflow-hidden rounded">
                <Image
                  src={frame.imageUrl}
                  alt={frame.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mb-2 font-semibold text-sm sm:text-base">{frame.title}</h3>
              <p className="mb-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {frame.description}
              </p>
              <p className="mb-2 font-bold text-primary text-sm sm:text-base">
                {formatPrice(frame.price)}
              </p>
              <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                Stock: {frame.stock}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(frame)}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Pencil className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(frame._id)}
                  className="px-2 sm:px-3"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
