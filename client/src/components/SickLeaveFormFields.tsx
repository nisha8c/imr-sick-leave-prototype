import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface SickLeaveFormFieldsProps<T extends { date: string; reason: string; comment?: string }> {
    form: UseFormReturn<T>;
    onSubmit: (data: T) => Promise<void>;
    isSubmitting: boolean;
    submitLabel: string;
    cancelLabel?: string;
    onCancel?: () => void;
    showCancel?: boolean;
}

export const SickLeaveFormFields = <T extends { date: string; reason: string; comment?: string }>({
                                                                                                      form,
                                                                                                      onSubmit,
                                                                                                      isSubmitting,
                                                                                                      submitLabel,
                                                                                                      cancelLabel,
                                                                                                      onCancel,
                                                                                                      showCancel = false,
                                                                                                  }: SickLeaveFormFieldsProps<T>) => {
    const { t } = useTranslation();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                <FormField
                    control={form.control}
                    name={"date" as keyof T as any}
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
                    name={"reason" as keyof T as any}
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
                    name={"comment" as keyof T as any}
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

                <div className={`flex ${showCancel ? 'gap-3' : ''}`}>
                    {showCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {cancelLabel || t('edit.cancel')}
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('form.submitting')}
                            </>
                        ) : (
                            submitLabel
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
