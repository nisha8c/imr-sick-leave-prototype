import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { enUS, sv, de } from 'date-fns/locale';
import { Calendar, FileText, Pencil, Trash2, Clock } from 'lucide-react';
import type {SickLeave} from "../types/sickLeave.ts";
import {Button} from "./ui/button.tsx";


const locales = { en: enUS, sv, de };

interface SickLeaveCardProps {
    report: SickLeave;
    onEdit: () => void;
    onDelete: () => void;
}

export const SickLeaveCard = ({ report, onEdit, onDelete }: SickLeaveCardProps) => {
    const { t, i18n } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);

    const getLocale = () => locales[i18n.language as keyof typeof locales] || enUS;

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'PPP', { locale: getLocale() });
        } catch {
            return dateString;
        }
    };

    const formatDateTime = (dateString: string) => {
        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return formatInTimeZone(new Date(dateString), userTimezone, 'PPp', { locale: getLocale() });
        } catch {
            return dateString;
        }
    };

    return (
        <div
            className="relative border border-primary rounded-lg p-4 bg-primary text-primary-foreground transition-all duration-300 cursor-pointer overflow-hidden hover:bg-primary/90"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered(!isHovered)}
        >
            {/* Main Content */}
            <div className={`transition-all duration-300 ${isHovered ? 'blur-sm' : ''}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                            <Calendar className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
                            <p className="font-medium text-primary-foreground">
                                {formatDate(report.date)}
                            </p>
                        </div>
                        <div className="flex items-start gap-3 pl-8">
                            <Clock className="h-4 w-4 text-primary-foreground/80 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-primary-foreground/80">
                                {t('list.submitted')}: {formatDateTime(report.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {report.reason ? (
                    <div className="flex items-start gap-3 mb-2 pl-8 text-left">
                        <FileText className="h-4 w-4 text-primary-foreground/80 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-primary-foreground/80">{t('list.reason')}</p>
                            <p className="text-sm text-primary-foreground line-clamp-1">{report.reason}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-primary-foreground/80 pl-8">{t('list.noReason')}</p>
                )}
            </div>

            {/* Dark Overlay on Hover */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Action Buttons Overlay */}
            <div
                className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="h-12 w-12 shadow-lg animate-scale-in bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                    <Pencil className="h-6 w-6" />
                </Button>

                <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="h-12 w-12 shadow-lg animate-scale-in bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    <Trash2 className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};
