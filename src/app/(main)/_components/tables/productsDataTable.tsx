import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UploadImagesDialog from "../imageUpload";
const flattenProductsData = (data: FetchProductsResponse) => {
  const flattenedData: FlattenProductsData[] = [];

  if (!data.results) return flattenedData;

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
      });
    });
  });

  return flattenedData;
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

  const [selectedProduct, setSelectedProduct] =
    useState<FlattenProductsData | null>(null);

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

  // Fetch products data
  const { data: products, isLoading, error: isError } = useProducts();

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

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);
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
                  onClick={() => handleRowClick(item)}
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
          {/* <span className="text-sm text-gray-500">
            Showing {Math.min(startIndex + 1, sortedData.length)} to{" "}
            {Math.min(startIndex + rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length} entries
          </span> */}
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
            {/* 
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
            </PaginationItem> */}
          </PaginationContent>
        </Pagination>
      </div>

      <UploadImagesDialog
        isOpened={isDialogOpen && selectedProduct !== null}
        modelID={selectedProduct?.modelId || ""}
        onClose={() => setIsDialogOpen(false)}
      />
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ShadCN Dialog</DialogTitle>
            <DialogDescription>
              This dialog opens based on the `isOpened` state.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default ProductsTable;
