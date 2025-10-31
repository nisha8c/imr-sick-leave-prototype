import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Loader2 } from 'lucide-react';
import {Button} from "./ui/button.tsx";
import {Textarea} from "./ui/textarea.tsx";
import {Input} from "./ui/input.tsx";
import {trpc} from "../utils/trpc.ts";
import {toast} from "../hooks/use-toast.tsx";
import type {SickLeave} from "../types/sickLeave.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog.tsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    reason: z.string().optional(),
    comment: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditReportDialogProps {
    report: SickLeave;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditReportDialog = ({ report, open, onOpenChange }: EditReportDialogProps) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const utils = trpc.useUtils();
    const updateMutation = trpc.sickLeave.update.useMutation({
        onSuccess: async () => {
            await utils.sickLeave.list.invalidate(); // refresh list after editing
            toast({
                title: t('edit.successTitle'),
                description: t('edit.successMessage'),
                variant: 'default',
            });
            onOpenChange(false);
        },
        onError: (error) => {
            toast({
                title: t('form.errorTitle'),
                description: error.message || t('form.errorMessage'),
                variant: 'destructive',
            });
        },
    });

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: dayjs.utc(report.date).local().format("YYYY-MM-DD"),// ensure correct format for date input
            reason: report.reason || '',
            comment: report.comment || '',
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            await updateMutation.mutateAsync({
                id: report.id,
                date: data.date,
                reason: data.reason,
                comment: data.comment,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{t('edit.title')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.date')}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="bg-background border-input" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.reason')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={t('form.reasonPlaceholder')}
                                            className="bg-background border-input"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.comment')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={t('form.commentPlaceholder')}
                                            className="bg-background border-input resize-none"
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {t('edit.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || updateMutation.isPending}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {isSubmitting || updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('edit.saving')}
                                    </>
                                ) : (
                                    t('edit.save')
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
