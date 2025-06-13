import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { useProducts } from "@/hooks/use-products";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UploadImagesDialog from "../imageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFetchCategories, useFetchSubCategories } from "@/hooks/use-categories";
const flattenProductsData = (data: FetchProductsResponse) => {
  const flattenedData: FlattenProductsData[] = [];

  if (!data.results) return flattenedData;
  console.log("products", data.results)

  data.results.forEach((product: ProductData) => {
    product.models.forEach((model) => {
      flattenedData.push({
        productId: product.id!,
        productName: product.name,
        category: product.subCategory.category!.name,
        subCategory: product.subCategory.name,
        modelId: model.id!,
        modelName: model.name,
        description: model.description,
        price: model.price,
        inventory: model.inventory.quantity,
        features: model.features,
        status: model.status,
        isFeatured: model.isFeatured === "true" ? true : false,
      });
    });
  });

  return flattenedData;
};

type StatusType = "draft" | "active";

// a minimal feature for your form
type EditableFeature = { description: string };

// drop the original `features` on FlattenProductsData and replace with your own
type EditValues = Omit<FlattenProductsData, "features" | "status"> & {
  features: EditableFeature[];
  status: StatusType;       // reuse your StatusType
  isFeatured: boolean;      // keep as boolean
};

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [sortConfig, setSortConfig] = useState({
  //   key: "modelName",
  //   direction: "asc",
  // });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof FlattenProductsData;
    direction: "asc" | "desc";
  }>({
    key: "modelName",
    direction: "asc",
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<FlattenProductsData | null>(null);
  // const [editValues, setEditValues] = useState<Partial<FlattenProductsData>>({});
  const [editValues, setEditValues] = useState<EditValues>({
    modelName: "",
    productName: "",
    category: "",
    subCategory: "",
    description: "",
    price: 0,
    inventory: 0,
    features: [],
    productId: "",
    modelId: "",
    status: "draft",
    isFeatured: false,
  });

  useEffect(() => {
    if (selectedProduct) {
      setEditValues({
        modelName: selectedProduct.modelName,
        modelId: selectedProduct.modelId,
        productName: selectedProduct.productName,
        productId: selectedProduct.productId,
        category: selectedProduct.category,
        subCategory: selectedProduct.subCategory,
        description: selectedProduct.description || "",
        price: selectedProduct.price,
        inventory: selectedProduct.inventory,
        status: selectedProduct.status as unknown as StatusType,
        isFeatured: selectedProduct.isFeatured,
        features: selectedProduct.features.map((f) => ({
          description: f.description,
        })),
      });
      // console.log("the slected product", selectedProduct)
    }
  }, [selectedProduct]);

  const handleEditClick = (product: FlattenProductsData) => {
    // todo: fetch product details from the server then set the selected product
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleRowClick = (product: FlattenProductsData) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleAddImagesClick = (product: FlattenProductsData) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleViewClick = (product: FlattenProductsData) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };

  // Fetch products data
  const { data: products, isLoading, error: isError } = useProducts(
    currentPage,
    rowsPerPage
  );
  const { data: subCategories, isLoading: SubCategoryLoading, error: subCategoriesError } = useFetchSubCategories();
  const { data: categories, isLoading: categoryLoading, error: categoriesError } = useFetchCategories();

  if (isLoading)
    return <div className="flex justify-center p-6">Loading products...</div>;
  if (isError)
    return (
      <div className="flex justify-center p-6 text-red-500">
        Error loading products
      </div>
    );

  const productsData = flattenProductsData(
    products!.data as FetchProductsResponse
  );

  const filteredData = productsData.filter((item) => {
    return (
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const page = products?.data?.page ?? 1;
  const limit = products?.data?.limit ?? rowsPerPage;
  const totalPages = products?.data?.totalPages ?? 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = sortedData;
  // const paginatedData: FlattenProductsData[] | [] = [];

  // const requestSort = (key: string) => {
  //   let direction = "asc";
  //   if (sortConfig.key === key && sortConfig.direction === "asc") {
  //     direction = "desc";
  //   }
  //   setSortConfig({ key, direction });
  // };

  const requestSort = (key: keyof FlattenProductsData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName: string) => {
    if (sortConfig.key !== columnName) return null;

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  const addFeature = () => {
    setEditValues((v) => ({
      ...v,
      features: [...v.features, { description: "" }],
    }));
  };

  const updateFeature = (idx: number, val: string) => {
    setEditValues((v) => ({
      ...v,
      features: v.features.map((f, i) =>
        i === idx ? { description: val } : f
      ),
    }));
  };

  const removeFeature = (idx: number) => {
    setEditValues((v) => ({
      ...v,
      features: v.features.filter((_, i) => i !== idx),
    }));
  };

  console.log("edit values", editValues)


  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Catalog</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("modelName")}
              >
                Model {getSortIcon("modelName")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("productName")}
              >
                Product {getSortIcon("productName")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("category")}
              >
                Category {getSortIcon("category")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("subCategory")}
              >
                Sub Category {getSortIcon("subCategory")}
              </TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => requestSort("price")}
              >
                Price {getSortIcon("price")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => requestSort("inventory")}
              >
                Stock {getSortIcon("inventory")}
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow
                  key={item.modelId}
                // onClick={() => handleRowClick(item)}
                >
                  <TableCell className="font-medium">
                    {item.modelName}
                  </TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.subCategory}</TableCell>
                  {/* <TableCell className="max-w-md truncate">
                    {item.description}
                  </TableCell> */}
                  <TableCell className="text-right">
                    KSH{(item.price / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{item.inventory}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(item.modelId)
                          }
                        >
                          Copy model ID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewClick(item)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddImagesClick(item)}
                        >
                          Add model Images
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(item)}>
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1} to {startIndex + paginatedData.length} of{' '}
            {products?.data?.totalResults ?? paginatedData.length} entries
          </span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">per page</span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              // Show only a limited number of page links
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) ||
                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <PaginationEllipsis key={pageNumber} />;
              }

              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <UploadImagesDialog
        isOpened={isDialogOpen && selectedProduct !== null}
        modelID={selectedProduct?.modelId || ""}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Product Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>Model: {selectedProduct?.modelName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p><strong>Product:</strong> {selectedProduct?.productName}</p>
            <p><strong>Category:</strong> {selectedProduct?.category}</p>
            <p><strong>sub Category:</strong> {selectedProduct?.subCategory}</p>
            <p><strong>Description:</strong> {selectedProduct?.description}</p>
            <p><strong>Price:</strong> KSH {((selectedProduct?.price ?? 0) / 100).toFixed(2)}</p>
            <p><strong>Status:</strong>{selectedProduct?.status ?? ""}</p>
            <p><strong>Is Featured:</strong> {selectedProduct?.isFeatured.toString()}</p>
            <p><strong>Inventory:</strong> {selectedProduct?.inventory}</p>
            {selectedProduct?.features && (
              <div>
                <h4 className="font-semibold">Features:</h4>
                <ul className="list-disc list-inside">
                  {selectedProduct.features.map((feature, i) => <li key={i}>{feature.description}</li>)}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button variant="default" onClick={() => { handleEditClick(selectedProduct!); setIsDetailDialogOpen(false); }}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <DialogContent className="max-w-lg max-h-[80dvh]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Modify product details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[27rem] overflow-y-auto">
            <div>
              <Label>Model Name</Label>
              <Input
                placeholder="Model Name"
                value={editValues.modelName || ""}
                onChange={e => setEditValues(v => ({ ...v, modelName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Product Name</Label>
              <Input
                placeholder="Product Name"
                value={editValues.productName || ""}
                onChange={e => setEditValues(v => ({ ...v, productName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Category</Label>
              {/* <Input
                placeholder="Category"
                value={editValues.category || ""}
                onChange={e => setEditValues(v => ({ ...v, category: e.target.value }))}
              /> */}
              <Select name="categoryId" value={editValues.category} defaultValue={editValues.category} onValueChange={val => setEditValues(v => ({ ...v, category: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.data !== null ? (Object.values(categories?.data ?? {}) as unknown as Category[]).map((sc: Category) => {
                    return (
                      <SelectItem key={sc.id} value={sc.name!}>{sc.name}</SelectItem>
                    )
                  }) : null}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sub Category</Label>
              <Select name="subCategoryId" value={editValues.subCategory} defaultValue={editValues.subCategory} onValueChange={val => setEditValues(v => ({ ...v, subCategory: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories?.data !== null ? (Object.values(subCategories?.data ?? {}) as unknown as Subcategory[]).map((sc: Subcategory) => {
                    return (
                      <SelectItem key={sc.id} value={sc.name!}>{sc.name}</SelectItem>
                    )
                  }) : null}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Description"
                value={editValues.description || ""}
                onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                placeholder="Price (KSH)"
                type="number"
                value={editValues.price !== undefined ? (editValues.price / 100).toString() : ""}
                onChange={e => setEditValues(v => ({ ...v, price: Math.round(Number(e.target.value) * 100) }))}
              />
            </div>
            <div>
              <Label>Inventory</Label>
              <Input
                placeholder="Inventory"
                type="number"
                value={editValues.inventory?.toString() || ""}
                onChange={e => setEditValues(v => ({ ...v, inventory: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editValues.status}
                // explicitly type `value` as StatusType:
                onValueChange={(value: StatusType) =>
                  setEditValues((v) => ({ ...v, status: value }))
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>is Featured</Label>
              <Select
                value={String(editValues.isFeatured)}
                onValueChange={(value) =>
                  setEditValues((v) => ({ ...v, isFeatured: value === "true" }))
                }
              >
                <SelectTrigger id="isFeatured" className="w-full">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {Array.isArray(editValues.features) && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <label className="block text-sm font-medium mb-1">Features</label>
                  <Button size="sm" variant="destructive" onClick={() => addFeature()}>
                    Add
                  </Button>
                </div>
                {editValues.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Textarea
                      placeholder="Feature description"
                      value={f.description}
                      onChange={e => updateFeature(idx, e.target.value)}
                    />
                    <Button size="sm" variant="destructive" onClick={() => removeFeature(idx)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
            <Button
              variant="default"
            // onClick={() => updateMutation.mutate({ id: selectedProduct!.modelId, data: editValues })}
            // disabled={updateMutation.isLoading}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTable;
