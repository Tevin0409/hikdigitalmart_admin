import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Search,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SmartPagination from "@/components/ui/smartPagination";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

// Custom hook for debouncing function
const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface ReviewTableProps {
  data: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    results: Review[];
  };
  currentPage?: number;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  onSearchTermChange: (term: string) => void;
  isLoading?: boolean;
  onRespondToReview: (reviewId: string, message: string) => Promise<void>;
}

declare type Review = {
  id: string;
  productModelId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: {
      name: string;
    };
  };
  productModel: {
    name: string;
  };
  images: {
    id: string;
    reviewId: string;
    uploadUrl: string;
    optimizeUrl: string;
    isPrimary: boolean;
  }[];
  ReviewResponse: {
    id: string;
    reviewId: string;
    userId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      role: {
        name: string;
      };
    };
  } | null;
};

const ReviewTable = ({
  data,
  currentPage = 1,
  onPageChange,
  searchTerm = "",
  onSearchTermChange,
  isLoading = false,
  onRespondToReview,
}: ReviewTableProps) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleResponseSubmit = async () => {
    if (!selectedReview || !responseMessage.trim()) return;
    
    try {
      setIsResponding(true);
      await onRespondToReview(selectedReview.id, responseMessage);
      setResponseMessage("");
      setSelectedReview(null);
    } finally {
      setIsResponding(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.results.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="font-medium">
                        {review.productModel.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {review.user.email}
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {review.ReviewResponse ? (
                        <Badge variant="outline" className="border-green-500">
                          Responded
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="ml-2">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.totalPages > 1 && (
            <SmartPagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onPageChange={onPageChange}
              activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
              prevLabel="Previous"
              nextLabel="Next"
              delta={1}
              className="rounded-md"
            />
          )}
        </>
      )}

      {/* Review Detail Sheet */}
      <Sheet
        open={!!selectedReview}
        onOpenChange={(open) => !open && setSelectedReview(null)}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedReview && (
            <>
              <SheetHeader>
                <SheetTitle>Review Details</SheetTitle>
                <SheetDescription>
                  Review for {selectedReview.productModel.name} from{" "}
                  {selectedReview.user.firstName} {selectedReview.user.lastName}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {selectedReview.user.firstName}{" "}
                      {selectedReview.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedReview.user.email}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm text-gray-500">
                    {selectedReview.rating.toFixed(1)}/5
                  </span>
                </div>

                <div>
                  <h4 className="font-medium">Product</h4>
                  <p>{selectedReview.productModel.name}</p>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Review Comment</h4>
                  <p className="whitespace-pre-line">{selectedReview.comment}</p>
                </div>

                {selectedReview.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Images</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedReview.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.optimizeUrl || image.uploadUrl}
                          alt="Review"
                          className="rounded-md object-cover h-24 w-full"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedReview.ReviewResponse && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium">Your Response</h4>
                    <div className="rounded-md border p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {selectedReview.ReviewResponse.user.firstName}{" "}
                            {selectedReview.ReviewResponse.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              selectedReview.ReviewResponse.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 whitespace-pre-line">
                        {selectedReview.ReviewResponse.message}
                      </p>
                    </div>
                  </div>
                )}

                {!selectedReview.ReviewResponse && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium">Respond to Review</h4>
                    <Textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Write your response here..."
                      rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedReview(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleResponseSubmit}
                        disabled={!responseMessage.trim() || isResponding}
                      >
                        {isResponding ? "Sending..." : "Send Response"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReviewTable;