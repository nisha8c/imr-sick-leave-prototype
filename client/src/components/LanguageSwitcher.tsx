import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {Button} from "./ui/button.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "./ui/popover.tsx";
import {ReusableSelect} from "./ReusableSelect.tsx";

const languages = [
    { code: 'en', name: 'English' },
    { code: 'sv', name: 'Svenska' },
    { code: 'de', name: 'Deutsch' },
];

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
    };

    return (
        <>
            {/* Desktop view */}
            <div className="hidden md:flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <ReusableSelect
                    value={i18n.language}
                    onValueChange={handleLanguageChange}
                    triggerClassName="w-[140px] bg-background border-border"
                    options={languages.map(lang => ({
                        value: lang.code,
                        label: lang.name
                    }))}
                />
            </div>

            {/* Mobile view - Icon only */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Globe className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 bg-popover border-border" align="end">
                    <div className="space-y-1">
                        {languages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant={i18n.language === lang.code ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                {lang.name}
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};
