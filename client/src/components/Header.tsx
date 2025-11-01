import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Heart } from 'lucide-react';

export const Header = () => {
    const { t } = useTranslation();

    return (
        <header className="border-b border-border bg-card sticky top-0 z-50 mb-5">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                        <Heart className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                        {t('header.title')}
                    </h1>
                </div>
                <LanguageSwitcher />
            </div>
        </header>
    );
};
