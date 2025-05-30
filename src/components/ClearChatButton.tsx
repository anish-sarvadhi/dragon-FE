import React from "react";
import { useDispatch } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { clearMessages } from "../store/chatSlice";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trash2 } from "lucide-react";

const ClearChatButton: React.FC = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const handleClearChat = () => {
    dispatch(clearMessages());
  };
console.log("isMobile", isMobile);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-500 hover:bg-red-50 bg-red-50 transition-all duration-200  active:scale-95"
        >
         {isMobile ? <Trash2 /> : <span className="ml-2 sm:inline">{"Clear Chat"}</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-800">
            Clear Chat History
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to clear all messages? This action cannot be
            undone and will permanently delete your chat history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-100">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleClearChat}
            className="bg-red-500 hover:bg-red-600 transition-colors duration-200"
          > 
            {isMobile ? "x" : "Clear Chat"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearChatButton;
