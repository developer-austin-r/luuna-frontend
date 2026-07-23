"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Plus,
  Search as SearchIcon,
  Settings,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

import {
  Breadcrumb,
  Button,
  Card,
  DeleteDialog,
  Input,
  Select,
} from "@/components/admin";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addActivityLog,
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/redux/slices/admin-slice";
import { type Category } from "@/types/admin";

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  status: "active" | "inactive";
  image: string;
}

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.admin.categories);

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedParents, setExpandedParents] = useState<
    Record<string, boolean>
  >({
    "cat-1": true,
    "cat-2": true,
  });

  // Selection/Mode States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    "cat-1",
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Drag and Drop mock state
  const [isDragging, setIsDragging] = useState(false);

  // Form Hooks
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "none",
      status: "active",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
    },
  });

  const watchedImage = useWatch({ control, name: "image" });

  const matchingCategoryIds = new Set(
    categories
      .filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((category) => category.id),
  );

  // Derive Parent categories (any category that does NOT have a parent itself)
  const parentCategories = categories.filter(
    (category) =>
      !category.parentId &&
      (matchingCategoryIds.has(category.id) ||
        categories.some(
          (child) =>
            child.parentId === category.id && matchingCategoryIds.has(child.id),
        )),
  );

  // Expand / Collapse toggler
  const toggleParent = (id: string) => {
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectCategory = (cat: Category) => {
    setIsAddingNew(false);
    setSelectedCategoryId(cat.id);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "none",
      status: cat.status,
      image:
        cat.image ||
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
    });
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setSelectedCategoryId(null);
    reset({
      name: "",
      slug: "",
      description: "",
      parentId: "none",
      status: "active",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
    });
  };

  // Auto Generate slug
  const handleAutoSlug = () => {
    const nameVal = getValues("name") || "";
    const generated = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", generated);
  };

  // Status Toggle switch
  const handleToggleStatus = (cat: Category) => {
    const nextStatus = cat.status === "active" ? "inactive" : "active";
    dispatch(updateCategory({ ...cat, status: nextStatus }));
    dispatch(
      addActivityLog({
        user: "Admin Alex",
        action: `Toggled status of category "${cat.name}" to ${nextStatus}`,
        module: "Categories",
        status: "success",
      }),
    );

    // Update active form values if we're viewing this category
    if (selectedCategoryId === cat.id) {
      setValue("status", nextStatus);
    }
  };

  const onSubmit = (data: CategoryFormValues) => {
    const parentVal = data.parentId === "none" ? undefined : data.parentId;

    if (isAddingNew) {
      dispatch(
        addCategory({
          name: data.name,
          slug: data.slug,
          description: data.description,
          parentId: parentVal,
          image: data.image,
          status: data.status,
        }),
      );
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Added new category: ${data.name}`,
          module: "Categories",
          status: "success",
        }),
      );
      setIsAddingNew(false);
      setSelectedCategoryId("cat-1");
      alert(`Category "${data.name}" added successfully.`);
    } else if (selectedCategoryId) {
      const existing = categories.find((c) => c.id === selectedCategoryId);
      if (existing) {
        dispatch(
          updateCategory({
            ...existing,
            name: data.name,
            slug: data.slug,
            description: data.description,
            parentId: parentVal,
            image: data.image,
            status: data.status,
          }),
        );
        dispatch(
          addActivityLog({
            user: "Admin Alex",
            action: `Modified category properties: ${data.name}`,
            module: "Categories",
            status: "success",
          }),
        );
        alert(`Category "${data.name}" updated successfully.`);
      }
    }
  };

  const handleDeleteClick = (cat: Category) => {
    setCategoryToDelete(cat);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete.id));
      dispatch(
        addActivityLog({
          user: "Admin Alex",
          action: `Removed category: ${categoryToDelete.name}`,
          module: "Categories",
          status: "success",
        }),
      );
      setSelectedCategoryId("cat-1");
    }
    setDeleteDialogOpen(false);
  };

  // Mock Upload Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Mock upload URL setting
    setValue(
      "image",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80",
    );
    alert("Cover image uploaded successfully (Mock simulation).");
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[{ label: "Categories", href: "/admin/categories" }]}
          />
          <h1 className="text-2xl font-bold text-text-custom mt-1 font-sans">
            Category Hierarchy
          </h1>
        </div>
        <Button
          onClick={handleAddNewClick}
          className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Tree View */}
        <div className="space-y-4">
          <Card title="Category Directory">
            {/* Search filter */}
            <div className="relative w-full mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-custom/40">
                <SearchIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Filter categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-border-custom rounded-lg bg-bg-secondary/40 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
              />
            </div>

            {/* Hierarchy Tree */}
            <div className="space-y-1.5 font-sans">
              {parentCategories.map((parent) => {
                const subCats = categories.filter(
                  (category) =>
                    category.parentId === parent.id &&
                    matchingCategoryIds.has(category.id),
                );
                const hasSubs = subCats.length > 0;
                const isExpanded = expandedParents[parent.id] ?? false;
                const isSelected = selectedCategoryId === parent.id;

                return (
                  <div key={parent.id} className="space-y-1">
                    {/* Parent row */}
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-bg-secondary border border-transparent text-text-custom"
                      }`}
                    >
                      <div
                        className="flex items-center gap-2 flex-1 min-w-0"
                        onClick={() => handleSelectCategory(parent)}
                      >
                        {hasSubs ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleParent(parent.id);
                            }}
                            className="p-0.5 rounded hover:bg-border-custom text-text-custom/50 cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="w-4.5" />
                        )}
                        <Folder
                          className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-text-custom/60"}`}
                        />
                        <span className="text-xs font-semibold truncate">
                          {parent.name}
                        </span>
                        <span className="text-3xs font-semibold px-1 rounded-full bg-slate-100 text-text-custom/65">
                          {parent.productCount}
                        </span>
                      </div>

                      {/* Toggles */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(parent)}
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                            parent.status === "active"
                              ? "bg-emerald-500"
                              : "bg-slate-200"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-white transition-transform ${
                              parent.status === "active"
                                ? "translate-x-3"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(parent)}
                          className="text-text-custom/40 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories list */}
                    {hasSubs && isExpanded && (
                      <div className="pl-6 border-l border-border-custom/60 ml-4 space-y-1">
                        {subCats.map((child) => {
                          const isChildSelected =
                            selectedCategoryId === child.id;
                          return (
                            <div
                              key={child.id}
                              className={`flex items-center justify-between p-1.5 rounded-md transition-all cursor-pointer ${
                                isChildSelected
                                  ? "bg-primary/5 text-primary border border-primary/10"
                                  : "hover:bg-bg-secondary border border-transparent text-text-custom/80"
                              }`}
                            >
                              <div
                                className="flex items-center gap-2 flex-1 min-w-0"
                                onClick={() => handleSelectCategory(child)}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-border-custom" />
                                <span className="text-xs font-medium truncate">
                                  {child.name}
                                </span>
                                <span className="text-3xs px-1 rounded bg-slate-50 text-text-custom/50">
                                  {child.productCount}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(child)}
                                  className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                                    child.status === "active"
                                      ? "bg-emerald-500"
                                      : "bg-slate-200"
                                  }`}
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                                      child.status === "active"
                                        ? "translate-x-3"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClick(child)}
                                  className="text-text-custom/40 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Add/Edit details Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title={
              isAddingNew
                ? "Create New Category"
                : `Category Settings: ${selectedCategory?.name || ""}`
            }
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Category Name"
                  {...register("name", { required: "Name is required" })}
                  error={errors.name?.message}
                  placeholder="e.g. activewear-women"
                />

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      label="Slug"
                      {...register("slug", { required: "Slug is required" })}
                      error={errors.slug?.message}
                      placeholder="womens-apparel"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutoSlug}
                    className="flex items-center gap-1 text-2xs p-2.5 h-9 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Auto
                  </Button>
                </div>

                <Select
                  label="Parent category"
                  {...register("parentId")}
                  options={[
                    { value: "none", label: "None (Root Category)" },
                    ...parentCategories.map((c) => ({
                      value: c.id,
                      label: c.name,
                    })),
                  ]}
                />

                <Select
                  label="Category Status"
                  {...register("status")}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block mb-1.5">
                  Category Description
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  className="w-full px-3 py-2 text-sm border border-border-custom rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Explain what products are sorted in here..."
                />
              </div>

              {/* Drag and drop cover image upload zone */}
              <div>
                <label className="text-xs font-semibold text-text-custom/80 uppercase tracking-wider block mb-1.5">
                  Category Cover Image
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border-custom hover:border-primary/50"
                  }`}
                >
                  {watchedImage ? (
                    <div className="space-y-3">
                      <img
                        src={watchedImage}
                        alt="Upload preview"
                        className="w-32 h-20 object-cover rounded-lg border border-border-custom mx-auto"
                      />
                      <div className="flex gap-2 justify-center">
                        <Input
                          type="text"
                          {...register("image")}
                          className="h-8 max-w-xs text-xs"
                          placeholder="Image URL"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setValue("image", "")}
                          className="text-red-500 hover:bg-red-50"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-text-custom/40 mb-2" />
                      <p className="text-xs font-bold text-text-custom mb-1">
                        Drag and drop file here, or select files
                      </p>
                      <p className="text-3xs text-text-custom/50">
                        Supports JPG, PNG, WEBP files up to 2MB (Mock)
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="category-file-picker"
                        onChange={() =>
                          setValue(
                            "image",
                            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80",
                          )
                        }
                      />
                      <label
                        htmlFor="category-file-picker"
                        className="mt-3 text-2xs font-semibold px-3 py-1.5 bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-all inline-block"
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border-custom/50">
                <Button type="submit" className="flex items-center gap-1.5">
                  <Settings className="w-4 h-4" />
                  {isAddingNew ? "Create Category" : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={categoryToDelete?.name}
        title="Delete Taxonomy Category"
      />
    </div>
  );
}
