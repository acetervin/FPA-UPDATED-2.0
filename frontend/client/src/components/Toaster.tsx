import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

// Add a global error handler that shows errors in toast
export function setupGlobalErrorHandler() {
  const { toast } = useToast();

  window.onerror = (message, source, lineno, colno, error) => {
    toast({
      title: 'An error occurred',
      description: error?.message || String(message),
      variant: 'destructive',
    });
    return false;
  };

  window.onunhandledrejection = (event) => {
    toast({
      title: 'Promise Rejection',
      description: event.reason?.message || 'An async error occurred',
      variant: 'destructive',
    });
  };
}
