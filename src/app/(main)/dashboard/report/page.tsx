"use client";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface ReportItem {
    id: string;
    label: string;
}

export default function Reports() {

    const reports: ReportItem[] = [
        { id: "user-registrations", label: "User Registrations Report" },
        { id: "verified-users", label: "Verified Users Report" },
        { id: "sales-summary", label: "Sales Summary Report" },
        { id: "order-status", label: "Order Status Report" },
        { id: "top-products", label: "Top Products Report" },
        { id: "low-in-stock", label: "Low In Stock Report" },
        { id: "wishlist-trends", label: "Wishlists Trends Report" },
        { id: "technician-registrations", label: "Technician Registration Report" },
    ];

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading title="Reports" description="Reports on all events" />
                </div>
                <Separator />
                <div className="w-full grid grid-cols-1 md:grid-cols-2">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="text-sm hover:text-blue-400 cursor-pointer p-1"
                        >
                            {report.label}
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}