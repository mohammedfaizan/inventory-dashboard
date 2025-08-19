import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { X } from "lucide-react";

interface ErrorAlertProps {
  msg: string;
  onClose?: () => void;
}

const ErrorAlert = ({ msg, onClose }: ErrorAlertProps) => (
  <Alert variant="destructive" className="relative">
    <div className="flex justify-between items-center">
      <div>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{msg}</AlertDescription>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-destructive/20 rounded-full"
          aria-label="Close error message"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  </Alert>
);

export default ErrorAlert;
