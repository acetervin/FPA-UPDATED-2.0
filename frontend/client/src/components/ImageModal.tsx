import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "./ui/dialog";
import { OptimizedImage } from "./ui/optimized-image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, altText }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="max-w-4xl w-full p-4 overflow-auto">
        <OptimizedImage
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-[80vh] object-contain mx-auto"
        />
      </DialogContent>
    </Dialog>
  );
}
