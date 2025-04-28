import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";




export default function Reports() {
    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading title="Reports" description="Reports on all events" />

                </div>
                <Separator />
            </div>
        </PageContainer>
    )
}