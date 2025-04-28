
import { useMemo, useState } from "react";
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
import { MoreHorizontal, ChevronUp, ChevronDown, Eye, Printer } from "lucide-react";
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


const flattenOrdersData = (data?: OrdersData) => {
    // if there's no data or no `.results` array, we return an empty list
    if (!data?.results || !Array.isArray(data.results)) {
        //   console.log("flattenOrdersData got no data, returning []");
        return [];
    }

    return data.results.map((order) => ({
        id: order.id,
        first_name: order.first_name,
        last_name: order.last_name,
        email: order.email,
        orderPrice: order.orderPrice,
        orderItems: order.orderItems,
        userId: order.userId,
        street_address: order.street_address,
        status: order.status,
        vat: order.vat,
        total: order.total,
        company_name: null,
        apartment: null,
        town: order.town,
        phone_number: order.phone_number,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }));
};

type SortConfig = {
    key: keyof Order;
    direction: "asc" | "desc";
};

const OrdersTable = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: "createdAt",
        direction: "desc",
    });

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedStatus, setEditedStatus] = useState<string>("");

    const { data: response, isLoading, isError } = useOrders();
    // console.log("response", response, isLoading, isError)
    const orders = flattenOrdersData(response?.data as OrdersData);

    const processedOrders = useMemo(() => {
        let filtered = orders.filter((order) => {
            const term = searchTerm.toLowerCase();
            return (
                order.first_name.toLowerCase().includes(term) ||
                order.last_name.toLowerCase().includes(term) ||
                order.email.toLowerCase().includes(term) ||
                (order.company_name ?? "").toLowerCase().includes(term)
            );
        });

        filtered.sort((a, b) => {
            const { key, direction } = sortConfig;
            const aValue = a[key];
            const bValue = b[key];

            if (aValue! < bValue!) return direction === "asc" ? -1 : 1;
            if (aValue! > bValue!) return direction === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [orders, searchTerm, sortConfig]);

    const totalPages = Math.ceil(processedOrders.length / rowsPerPage) || 1;
    const paginated = useMemo(
        () =>
            processedOrders.slice(
                (currentPage - 1) * rowsPerPage,
                currentPage * rowsPerPage
            ),
        [processedOrders, currentPage, rowsPerPage]
    );

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

    if (isLoading)
        return <div className="flex justify-center p-6">Loading orders...</div>;
    if (isError)
        return (
            <div className="flex justify-center p-6 text-red-500">
                Error loading orders
            </div>
        );

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
                <Table>
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
                            paginated.map((order) => (
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
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        setSelectedOrder(order);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    View Order
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
                </Table>
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
            
            {/* Order Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg max-h-[70dvh]">
                    <DialogHeader>
                        <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
                        <DialogDescription>Details and actions for this order</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 p-1 h-[28rem] overflow-y-auto">
                        <div>
                            <h3 className="font-semibold">Customer</h3>
                            <p>{selectedOrder?.first_name} {selectedOrder?.last_name}</p>
                            <p>{selectedOrder?.email}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Shipping Address</h3>
                            <p>{selectedOrder?.street_address}, {selectedOrder?.apartment}</p>
                            <p>{selectedOrder?.town}</p>
                            <p>{selectedOrder?.phone_number}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Items</h3>
                            <ul className="space-y-2">
                                {selectedOrder?.orderItems.map((item, idx) => (
                                    <li key={idx} className="border p-2 rounded">
                                        <p><strong>Product:</strong> {item.productModel.name}</p>
                                        <p><strong>Qty:</strong> {item.quantity}</p>
                                        <p><strong>Price:</strong> KSH {(item.productModel.price / 100).toFixed(2)}</p>
                                        <p><strong>Total:</strong> KSH {((item.productModel.price * item.quantity) / 100).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between">
                            <p><strong>Subtotal:</strong> KSH {((selectedOrder?.orderPrice ?? 0) / 100).toFixed(2)}</p>
                            <p><strong>VAT:</strong> KSH {((selectedOrder?.vat ?? 0) / 100).toFixed(2)}</p>
                            <p><strong>Total:</strong> KSH {((selectedOrder?.total ?? 0) / 100).toFixed(2)}</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Status</h3>
                            <Select value={editedStatus} onValueChange={(val) => setEditedStatus(val)}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Awaiting Shipment">Awaiting Shipment</SelectItem>
                                    <SelectItem value="Awaiting Payment">Awaiting Payment</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // TODO: Implement print receipt
                                }}
                            >
                                <Printer className="mr-2 h-4 w-4" /> Print Receipt
                            </Button> */}
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                    // TODO: Save editedStatus to backend
                                    setIsModalOpen(false);
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>

                    </div>

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrdersTable;
