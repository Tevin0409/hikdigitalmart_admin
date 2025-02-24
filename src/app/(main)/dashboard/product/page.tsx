"use client";
import React, { Suspense } from "react";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "nuqs/server";
import { buttonVariants } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, Plus, Sheet } from "lucide-react";
import Link from "next/link";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload, Download } from "lucide-react";

import UploadProductsDialog from "../../_components/bulkupload";
import { useProducts } from "@/hooks/use-products";

type pageProps = {
  searchParams: Promise<SearchParams>;
};
const Products = (props: pageProps) => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products</p>;
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Products" description="Manage products " />

          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className=" bg-green-700 ">
                  <CloudUploadIcon />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Create Product</DialogTitle>
                  <DialogDescription>
                    Create a new product with the following details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div> */}
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <UploadProductsDialog />
          </div>
        </div>
        <Separator />
      </div>
    </PageContainer>
  );
};

export default Products;
