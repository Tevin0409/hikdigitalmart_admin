
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from "react";
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
import { useOrders } from "@/hooks/use-orders";
import { useUsers } from "@/hooks/use-users";

// const flattenOrdersData = (data: UserInfoData) => {
//     const flattenedData: UserInfoData[] = [];
//     console.log("provided data", data);
//     if (!data.results) return flattenedData;

//     data.results.forEach((user: UserInfoData) => {
//         // product.models.forEach((model) => {
//         flattenedData.push({
//             firstName: user.firstName,
//             lastName: user.lastName,
//             phone_number: user.phoneNumber,
//         });
//     });

//     return flattenedData;
// };

type SortConfig = {
    key: keyof Order;
    direction: "asc" | "desc";
};

const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: "createdAt",
        direction: "desc",
    });

    const { data: response, isLoading, isError } = useUsers();

    if (isLoading)
        return <div className="flex justify-center p-6">Loading users...</div>;
    if (isError)
        return (
            <div className="flex justify-center p-6 text-red-500">
                Error loading users
            </div>
        );

        console.log("response data", response)
    // const orders = (response?.data).results;
    // const orders = flattenOrdersData(response?.data as OrdersData);

    // const processedOrders = useMemo(() => {
    //     let filtered = orders.filter((order: { first_name: string; last_name: string; email: string; company_name: any; }) => {
    //         const term = searchTerm.toLowerCase();
    //         return (
    //             order.first_name.toLowerCase().includes(term) ||
    //             order.last_name.toLowerCase().includes(term) ||
    //             order.email.toLowerCase().includes(term) ||
    //             (order.company_name ?? "").toLowerCase().includes(term)
    //         );
    //     });

    //     filtered.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
    //         const { key, direction } = sortConfig;
    //         const aValue = a[key];
    //         const bValue = b[key];

    //         if (aValue! < bValue!) return direction === "asc" ? -1 : 1;
    //         if (aValue! > bValue!) return direction === "asc" ? 1 : -1;
    //         return 0;
    //     });

    //     return filtered;
    // }, [orders, searchTerm, sortConfig]);

    // const totalPages = Math.ceil(processedOrders.length / rowsPerPage) || 1;
    // const paginated = useMemo(
    //     () =>
    //         processedOrders.slice(
    //             (currentPage - 1) * rowsPerPage,
    //             currentPage * rowsPerPage
    //         ),
    //     [processedOrders, currentPage, rowsPerPage]
    // );

    const requestSort = (key: keyof Order) => {
        setCurrentPage(1);
        setSortConfig((prev) => {
            const direction =
                prev.key === key && prev.direction === "asc" ? "desc" : "asc";
            return { key, direction };
        });
    };

    const getSortIcon = (column: keyof Order) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4 inline" />
        ) : (
            <ChevronDown className="ml-1 h-4 w-4 inline" />
        );
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Orders</h1>
                <div className="flex gap-4">
                    <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                </div>
            </div>

            <div className="border rounded-md">
                {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort("id")}
                            >
                                ID {getSortIcon("id")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort("first_name")}
                            >
                                First Name {getSortIcon("first_name")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort("last_name")}
                            >
                                Last Name {getSortIcon("last_name")}
                            </TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead
                                className="cursor-pointer text-right"
                                onClick={() => requestSort("total")}
                            >
                                Total {getSortIcon("total")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort("status")}
                            >
                                Status {getSortIcon("status")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort("createdAt")}
                            >
                                Created At {getSortIcon("createdAt")}
                            </TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginated.length > 0 ? (
                            paginated.map((order: { id: number; first_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; last_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; total: number; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; }) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.first_name}</TableCell>
                                    <TableCell>{order.last_name}</TableCell>
                                    <TableCell>{order.email}</TableCell>
                                    <TableCell className="text-right">
                                        KSH {(order.total / 100).toFixed(2)}
                                    </TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-6">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table> */}
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
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
                    </PaginationContent>
                </Pagination>
            </div>

            {/* <UploadImagesDialog
                isOpened={isDialogOpen && selectedProduct !== null}
                modelID={selectedProduct?.modelId || ""}
                onClose={() => setIsDialogOpen(false)}
            /> */}
        </div>
    );
};

export default UsersTable;
