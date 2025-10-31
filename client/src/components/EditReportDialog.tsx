import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {trpc} from "../utils/trpc.ts";
import {toast} from "../hooks/use-toast.tsx";
import type {SickLeave} from "../types/sickLeave.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog.tsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {SickLeaveFormFields} from "./SickLeaveFormFields.tsx";
import {getSickLeaveFormSchema, SickLeaveFormData} from "../schemas/sickLeaveSchema.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

interface EditReportDialogProps {
    report: SickLeave;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditReportDialog = ({ report, open, onOpenChange }: EditReportDialogProps) => {
    const { t } = useTranslation();
    const formSchema = getSickLeaveFormSchema(t);
    type FormData = SickLeaveFormData;

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
                <SickLeaveFormFields
                    form={form}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    submitLabel={t('edit.save')}
                    cancelLabel={t('edit.cancel')}
                    onCancel={() => onOpenChange(false)}
                    showCancel
                />
            </DialogContent>
        </Dialog>
    );
};
