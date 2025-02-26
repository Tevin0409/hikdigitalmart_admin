"use client";
import React, { Suspense } from "react";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "nuqs/server";
import { buttonVariants } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, Plus } from "lucide-react";

import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryForm } from "@/app/(main)/_components/category-form";
import {
  useFetchCategories,
  useFetchSubCategories,
} from "@/hooks/use-categories";
import { SubCategoryForm } from "@/app/(main)/_components/sub-category-form";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const Categories = (props: pageProps) => {
  const { data: categories, isLoading, error } = useFetchCategories();
  const { data: subCategories, isLoading: subCategoriesLoading } =
    useFetchSubCategories();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Categories & Subcategories"
            description="Manage your categories and subcategories"
          />

          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <CloudUploadIcon />
                  Add New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <CategoryForm />
                </div>
                {/* <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter> */}
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <CloudUploadIcon />
                  Add New Sub Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Create Sub Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <SubCategoryForm />
                </div>
                {/* <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter> */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator />
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="subCategories">Subcategories</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>

                    {/* <TableHead>Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(categories?.data as Category[])?.map(
                    (category: Category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>

                        {/* <TableCell>
                    <Button variant="outline">Edit</Button>
                    <Button variant="outline">Delete</Button>
                  </TableCell> */}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="subCategories">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subcategory</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created At</TableHead>
                    {/* <TableHead>Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(subCategories?.data as Subcategory[])?.map(
                    (subCategory: Subcategory) => (
                      <TableRow key={subCategory.id}>
                        <TableCell className="font-medium">
                          {subCategory.name}
                        </TableCell>
                        {/* use category.categoryId to get the category name */}
                        <TableCell>
                          {subCategory.categoryId
                            ? (categories?.data as Category[]).find(
                                (category: Category) =>
                                  category.id === subCategory.categoryId
                              )?.name
                            : "None"}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            subCategory.createdAt as string
                          ).toLocaleDateString()}
                        </TableCell>
                        {/* <TableCell>
                    <Button variant="outline">Edit</Button>
                    <Button variant="outline">Delete</Button>
                  </TableCell> */}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>

          {/* Subcategories */}
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default Categories;
