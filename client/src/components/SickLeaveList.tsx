import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, sv, de } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, Filter } from 'lucide-react';
import { SickLeaveCard } from './SickLeaveCard';
import { useState, useMemo } from 'react';
import {trpc} from "../utils/trpc.ts";
import {ReusableSelect} from "./ReusableSelect.tsx";
import {toast} from "../hooks/use-toast.tsx";
import {ConfirmDialog} from "./ConfirmDialog.tsx";
import {EditReportDialog} from "./EditReportDialog.tsx";

const locales = { en: enUS, sv, de };

export const SickLeaveList = () => {
    const { t, i18n } = useTranslation();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingReport, setEditingReport] = useState<any | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [filterType, setFilterType] = useState<'latest' | 'all' | 'month' | 'year'>('latest');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const utils = trpc.useUtils();
    const { data: reports = [], isLoading } = trpc.sickLeave.list.useQuery();
    const getLocale = () => locales[i18n.language as keyof typeof locales] || enUS;

    const deleteMutation = trpc.sickLeave.delete.useMutation({
        onSuccess: () => {
            toast({ title: t('delete.successTitle'), description: t('delete.successMessage') });
            setDeletingId(null);
            utils.sickLeave.list.invalidate(); // refresh list
        },
        onError: (error) => {
            toast({
                title: t('delete.title'),
                description: error.message || t('delete.errorMessage'),
                variant: 'destructive',
            });
        },
    });

    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        reports.forEach(r => months.add(format(new Date(r.date), 'yyyy-MM')));
        return Array.from(months).sort().reverse();
    }, [reports]);

    const availableYears = useMemo(() => {
        const years = new Set<string>();
        reports.forEach(r => years.add(format(new Date(r.date), 'yyyy')));
        return Array.from(years).sort().reverse();
    }, [reports]);

    const filteredReports = useMemo(() => {
        let filtered = [...reports];
        if (filterType === 'latest') return filtered.slice(0, 5);
        if (filterType === 'month' && selectedMonth)
            return filtered.filter(r => format(new Date(r.date), 'yyyy-MM') === selectedMonth);
        if (filterType === 'year' && selectedYear)
            return filtered.filter(r => format(new Date(r.date), 'yyyy') === selectedYear);
        return filtered;
    }, [reports, filterType, selectedMonth, selectedYear]);

    if (isLoading) return <p>Loading...</p>;

    return (
        <>
            <Card className="border-border md:max-h-[calc(100vh-12rem)] md:flex md:flex-col overflow-hidden">
                <CardHeader>
                    <CardTitle>{t('list.title')}</CardTitle>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mt-4">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <ReusableSelect
                                value={filterType}
                                onValueChange={(v) => setFilterType(v as 'latest' | 'all' | 'month' | 'year')}
                                options={[
                                    { value: 'latest', label: t('list.filterLatest') },
                                    { value: 'all', label: t('list.filterAll') },
                                    { value: 'month', label: t('list.filterMonth') },
                                    { value: 'year', label: t('list.filterYear') },
                                ]}
                            />
                        </div>
                        {filterType === 'month' && availableMonths.length > 0 && (
                            <ReusableSelect
                                value={selectedMonth}
                                onValueChange={setSelectedMonth}
                                placeholder={t('list.selectMonth')}
                                options={availableMonths.map(m => ({
                                    value: m,
                                    label: format(new Date(m + '-01'), 'MMMM yyyy', { locale: getLocale() }),
                                }))}
                            />
                        )}
                        {filterType === 'year' && availableYears.length > 0 && (
                            <ReusableSelect
                                value={selectedYear}
                                onValueChange={setSelectedYear}
                                placeholder={t('list.selectYear')}
                                options={availableYears.map(y => ({ value: y, label: y }))}
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pr-2">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3>{t('list.empty')}</h3>
                            <p>{t('list.emptyDescription')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReports.map(r => (
                                <SickLeaveCard
                                    key={r.id}
                                    report={r}
                                    onEdit={() => {
                                        setEditingReport(r);
                                        setIsEditOpen(true);
                                    }}
                                    onDelete={() => setDeletingId(r.id)}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                open={!!deletingId}
                onOpenChange={(open) => !open && setDeletingId(null)}
                title={t('delete.title')}
                description={t('delete.description')}
                cancelText={t('delete.cancel')}
                confirmText={t('delete.confirm')}
                onConfirm={() => {
                    if (deletingId) {
                        deleteMutation.mutate({ id: deletingId });
                    }
                }}
            />

            {editingReport && (
                <EditReportDialog
                    report={editingReport}
                    open={isEditOpen}
                    onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) setEditingReport(null);
                    }}
                />
            )}
        </>
    );
};
