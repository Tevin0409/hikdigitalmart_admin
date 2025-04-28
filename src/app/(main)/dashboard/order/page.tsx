"use client";
import React, { Suspense, useState } from "react";
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
import ProductsTable from "../../_components/tables/productsDataTable";
import VignettePurchaseDialog, { NewProductModal2 } from "../../_components/newProduct";
import OrdersTable from "../../_components/tables/ordersTable";

type pageProps = {
  searchParams: Promise<SearchParams>;
};
const Orders = (props: pageProps) => {
  const { data: products, isLoading, error } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders</p>;
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Orders" description="Manage Orders " />

          {/* <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
            <NewProductModal2
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              // subCategories={[]}
            />
            <UploadProductsDialog />
          </div> */}
        </div>
        <Separator />

        <OrdersTable />
      </div>
    </PageContainer>
  );
};

export default Orders;
