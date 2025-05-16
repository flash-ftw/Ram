import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function NotFound() {
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className={`flex mb-4 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">{t('notFound.title')}</h1>
          </div>

          <p className={`mt-4 text-sm text-gray-600 ${isRTL ? 'text-right' : ''}`}>
            {t('notFound.description')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
