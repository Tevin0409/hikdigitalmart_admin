"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { SearchParams } from "nuqs/server";
import { useState } from "react";

import { useUsers } from "@/hooks/use-users";
import UploadProductsDialog from "../../_components/bulkupload";
import { NewProductModal2 } from "../../_components/newProduct";

type pageProps = {
  searchParams: Promise<SearchParams>;
};
const Users = (props: pageProps) => {
  const { data: users, isLoading, error } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching Users</p>;
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Users" description="Manage users " />

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            {/* <VignettePurchaseDialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            /> */}
            <NewProductModal2
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
            <UploadProductsDialog />
          </div>
        </div>
        <Separator />

      </div>
    </PageContainer>
  );
};

export default Users;
