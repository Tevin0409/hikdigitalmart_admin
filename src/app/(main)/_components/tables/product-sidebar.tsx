import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { features } from "process";

const ProductEditSheet = ({
  isSheetOpen,
  setIsSheetOpen,
  selectedProduct,
}: {
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: FlattenProductsData;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    modelName: "",
    productName: "",
    category: "",
    subCategory: "",
    price: "",
    inventory: 0,
    description: "",
    features: [],
  });
  const [stepComplete, setStepComplete] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // Initialize form data when a product is selected
  React.useEffect(() => {
    if (selectedProduct) {
      setFormData({
        modelName: selectedProduct.modelName,
        productName: selectedProduct.productName,
        category: selectedProduct.category,
        subCategory: selectedProduct.subCategory,
        price: (selectedProduct.price / 100).toFixed(2),
        inventory: selectedProduct.inventory,
        // Add additional fields for other steps
        description: selectedProduct.description || "",
        features: selectedProduct.features || [],
        // images: selectedProduct.images || [],
        // specifications: selectedProduct.specifications || {},
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNextClick = async () => {
    setLoading(true);

    try {
      // Save the current step data via API
      // const response = await fetch("/api/products/update", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     modelId: selectedProduct!.modelId,
      //     step: currentStep,
      //     data: formData,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to save data");
      // }

      // Mark current step as complete
      setStepComplete((prev) => ({
        ...prev,
        [currentStep]: true,
      }));

      // Move to the next step if not on the last step
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevClick = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Render different form fields based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* step title and description */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">General Information</h2>
              <p className="text-sm text-gray-500">
                Provide the basic information about the product.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                value={formData.modelName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={formData.productName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-x-2 flex justify-between items-center">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                {/* Dropdown with product names as options */}
                <Input
                  id="productName"
                  value={formData.productName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>

                {/* Autofill input based on the selected product name with category name that matches the product name */}
                <Input
                  id="productName"
                  value={formData.productName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category</Label>
                {/* dropdown with subcategories under the selected category */}
                <Input
                  id="productName"
                  value={formData.productName || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Tell us a little bit about your product"
                id="description"
                className="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input
                id="features"
                value={formData.features || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Manage Stock and Price</h2>
              <p className="text-sm text-gray-500">
                Provide quantity and price for the product.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSH)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventory">Stock</Label>
              <Input
                id="inventory"
                type="number"
                value={formData.inventory || ""}
                onChange={handleInputChange}
              />
            </div>
            {/* minimum stock */}
            <div className="space-y-2">
              <Label htmlFor="minimumStock">Minimum Stock</Label>
              <Input
                id="minimumStock"
                type="number"
                value={formData.minimumStock || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* retail price percentage */}
            <div className="space-y-2">
              <Label htmlFor="retailPricePercentage">
                Retail Price Percentage
              </Label>
              <Input
                id="retailPricePercentage"
                type="number"
                value={formData.retailPricePercentage || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSH)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventory">Stock</Label>
              <Input
                id="inventory"
                type="number"
                value={formData.inventory || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input
                id="features"
                value={formData.features || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription>
            Complete all steps to update the product information.
          </SheetDescription>
        </SheetHeader>

        {/* Stepper */}
        <div className="my-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep === step
                      ? "border-blue-500 bg-blue-50"
                      : stepComplete[step]
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {stepComplete[step] ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <span
                      className={
                        currentStep === step ? "text-blue-500" : "text-gray-500"
                      }
                    >
                      {step}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">
                  {step === 1
                    ? "General Information"
                    : step === 2
                    ? "Manage Stock and Price"
                    : step === 3
                    ? "Images"
                    : "Publish"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200" />
            <div
              className="absolute top-0 left-0 h-0.5 bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep - 1) * (100 / 3)}%` }}
            />
          </div>
        </div>

        {selectedProduct && <div className="py-4">{renderStepContent()}</div>}

        <SheetFooter className="pt-4 flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevClick}
                disabled={loading}
              >
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleNextClick} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentStep === 4 ? (
                "Submit"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductEditSheet;
