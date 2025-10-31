import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import {trpc} from "../utils/trpc.ts";
import {toast} from "../hooks/use-toast.tsx";
import {ConfirmDialog} from "./ConfirmDialog.tsx";
import {AlertDialogAction} from "./ui/alert-dialog.tsx";
import {EditReportDialog} from "./EditReportDialog.tsx";
import {SickLeaveResponse} from "@/types/sickLeave.ts";
import {SickLeaveFormFields} from "./SickLeaveFormFields.tsx";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {getSickLeaveFormSchema, SickLeaveFormData} from "../schemas/sickLeaveSchema.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);



export const SickLeaveForm = () => {
    const { t } = useTranslation();
    const formSchema = getSickLeaveFormSchema(t);
    type FormData = SickLeaveFormData;

    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
    const [existingReport, setExistingReport] = useState<any | null>(null);
    const [pendingData, setPendingData] = useState<FormData | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const utils = trpc.useUtils();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const [isSubmitting, setIsSubmitting] = useState(false);

    //const { data: reports = [] } = trpc.sickLeave.list.useQuery();

    const createMutation = trpc.sickLeave.create.useMutation({
        onSuccess: async (res) => {
            if (res.message !== "duplicate") {
                await utils.sickLeave.list.invalidate();
                form.reset({ date: '', reason: '', comment: '' });
            }
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
        defaultValues: { date: '', reason: '', comment: '' },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        await submitReport(data);
        setIsSubmitting(false);
    };

    const submitReport = async (data: FormData) => {
        try {
            const res: SickLeaveResponse = await createMutation.mutateAsync({
                date: data.date,
                reason: data.reason,
                comment: data.comment,
                timezone,
            });

            // Handle duplicate date
            if (res?.message === "duplicate" && res.existing) {
                setExistingReport(res.existing);
                setPendingData(data);
                setShowDuplicateDialog(true);
                return;
            }

            // Only show toast for actual new entry
            toast({
                title: t("form.successTitle"),
                description: t("form.successMessage"),
                variant: "default",
            });

            await utils.sickLeave.list.invalidate();
            form.reset({ date: '', reason: '', comment: '' });
        } catch (error: any) {
            toast({
                title: t('form.errorTitle'),
                description: error.message || t('form.errorMessage'),
                variant: 'destructive',
            });
        }
    };

    const handleEditExisting = () => {
        setShowDuplicateDialog(false);
        setShowEditDialog(true);
    };

    return (
        <>
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">{t('form.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <SickLeaveFormFields
                        form={form}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                        submitLabel={t('form.submit')}
                    />
                </CardContent>
            </Card>

            <ConfirmDialog
                open={showDuplicateDialog}
                onOpenChange={setShowDuplicateDialog}
                title={t('form.duplicateTitle')}
                description={t('form.duplicateDescription')}
                cancelText={t('form.duplicateCancel')}
                confirmText=""
                onConfirm={() => {}}
                actionButtons={
                    <>
                        <AlertDialogAction onClick={handleEditExisting}>
                            {t('form.duplicateEdit')}
                        </AlertDialogAction>
                    </>
                }
            />

            {existingReport && (
                <EditReportDialog
                    report={existingReport}
                    open={showEditDialog}
                    onOpenChange={(open) => {
                        setShowEditDialog(open);
                        if (!open) {
                            setExistingReport(null);
                            setPendingData(null);
                        }
                    }}
                />
            )}
        </>
    );
};
