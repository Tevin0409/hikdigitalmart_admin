import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  Globe,
  Loader,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function NewProductModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [registration, setRegistration] = useState("");
  const [confirmRegistration, setConfirmRegistration] = useState("");
  const [country, setCountry] = useState("");

  const handleNextStep = () => {
    if (!startDate) return;
    console.log("Proceeding to next step...");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="flex bg-gray-100 ">
          {/* Left Sidebar */}
          <aside className="w-72 bg-gray-100  p-6 border-r">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-semibold">Find Vignette</h2>
              <HelpCircle className="w-5 h-5 ml-2 text-gray-400" />
            </div>

            <p className="text-sm text-gray-600 mb-8">
              Make your Vignet purchase easily by completing the necessary
              steps. Please do not forget to check the accuracy of your
              information.
            </p>

            <div className="space-y-4">
              {/* Completed step */}
              <div className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
                <span className="ml-3 font-medium text-blue-500">
                  Select Product
                </span>
              </div>

              {/* Current step */}
              <div className="flex items-center">
                <Loader className="w-6 h-6 text-gray-700" />
                <span className="ml-3 font-medium text-gray-700">
                  Enter Vehicle
                </span>
                <ChevronRight className="ml-auto text-gray-400" />
              </div>

              {/* Upcoming step */}
              <div className="flex items-center">
                <Circle className="w-6 h-6 text-gray-300" />
                <span className="ml-3 font-medium text-gray-400">
                  Check & Go
                </span>
              </div>
            </div>

            <div className="mt-auto pt-8 text-xs text-gray-500 flex items-center absolute bottom-6">
              © 2024 Vignetim
              <Button variant="ghost" size="sm" className="ml-auto text-xs">
                Need Help?
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 px-6 py-4 my-3 mr-2 bg-white rounded-lg">
            <DialogHeader className="">
              <DialogTitle>
                <div className="flex items-center justify-between">
                  <span className="text-xl">Vehicle Details</span>
                  <div className="flex items-center mt-2">
                    <Progress value={66} className="w-40 h-1" />
                    <span className="ml-2 text-sm text-gray-600">
                      2/3 completed
                    </span>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            <Separator className="my-6" />

            {/* Form Fields */}
            <div className="mt-8 space-y-6">
              {/* Country Field */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="text-base font-medium">
                    In Which country is your vehicle registered
                  </label>
                  <HelpCircle className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Select your vehicle's registration country.
                </p>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Select a country..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="at">Austria</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="ch">Switzerland</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="text-base font-medium">Start Date</label>
                  <HelpCircle className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Enter the start date of your vignette validity.
                </p>
                <Input
                  placeholder="DD / MM / YYYY"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* Registration Number */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="text-base font-medium">
                    Registration Number
                  </label>
                  <HelpCircle className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Enter your vehicle's license plate number.
                </p>
                <Input
                  placeholder="Enter registration number"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                />
              </div>

              {/* Confirm Registration */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="text-base font-medium">
                    Enter registration number again
                  </label>
                  <HelpCircle className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Re-enter your license plate number to confirm.
                </p>
                <Input
                  placeholder="Confirm number"
                  value={confirmRegistration}
                  onChange={(e) => setConfirmRegistration(e.target.value)}
                />
              </div>

              {/* Warning Alert */}
              {!startDate && (
                <Alert className="bg-red-50 border-red-200 text-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Please make sure to select the start date before proceeding
                    to the next step.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline">Back</Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleNextStep}
                disabled={!startDate}
              >
                Next Step
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
