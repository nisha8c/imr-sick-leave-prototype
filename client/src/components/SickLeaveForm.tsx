import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Loader2 } from 'lucide-react';
import {trpc} from "../utils/trpc.ts";
import {Button} from "./ui/button.tsx";
import {toast} from "../hooks/use-toast.tsx";
import {ConfirmDialog} from "./ConfirmDialog.tsx";
import {Input} from "./ui/input.tsx";
import {Textarea} from "./ui/textarea.tsx";
import {AlertDialogAction} from "./ui/alert-dialog.tsx";
import {EditReportDialog} from "./EditReportDialog.tsx";
import {SickLeaveResponse} from "@/types/sickLeave.ts";


const formSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    reason: z.string().min(1, 'Reason is required'),
    comment: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const SickLeaveForm = () => {
    const { t } = useTranslation();
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
    const [existingReport, setExistingReport] = useState<any | null>(null);
    const [pendingData, setPendingData] = useState<FormData | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const utils = trpc.useUtils();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
        await submitReport(data);
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
                                            <Input {...field} placeholder={t('form.reasonPlaceholder')} className="bg-background border-input" />
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
                                            <Textarea {...field} placeholder={t('form.commentPlaceholder')} rows={4} className="bg-background border-input resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('form.submitting')}
                                    </>
                                ) : (
                                    t('form.submit')
                                )}
                            </Button>
                        </form>
                    </Form>
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
