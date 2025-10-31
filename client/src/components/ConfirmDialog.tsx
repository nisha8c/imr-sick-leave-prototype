import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "./ui/alert-dialog.tsx";
import React from "react";


interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    cancelText: string;
    confirmText: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
    actionButtons?: React.ReactNode;
}

export const ConfirmDialog = ({
                                  open,
                                  onOpenChange,
                                  title,
                                  description,
                                  cancelText,
                                  confirmText,
                                  onConfirm,
                                  variant = 'default',
                                  actionButtons,
                              }: ConfirmDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-background border-border">
                        {cancelText}
                    </AlertDialogCancel>
                    {actionButtons || (
                        <AlertDialogAction
                            onClick={onConfirm}
                            className={
                                variant === 'destructive'
                                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    : ''
                            }
                        >
                            {confirmText}
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
