import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function PostLectureQR() {
  const [copiedId, setCopiedId] = useState(null);

  const { data: settings = [] } = useQuery({
    queryKey: ['system-settings-whatsapp'],
    queryFn: () => base44.entities.SystemSetting.filter({ key: 'whatsapp_number' }),
  });

  const { data: lectureContents = [], isLoading } = useQuery({
    queryKey: ['post-lecture-pdfs'],
    queryFn: () => base44.entities.ServiceContent.filter({ service_type: 'post_lecture', content_type: 'pdf' }),
  });

  const phone = settings[0]?.value || '972XXXXXXXXX';

  const handleCopy = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const lectures = lectureContents.filter(c => c.sub_type && c.is_active !== false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          QR להרצאות — נתיב פוסט הרצאה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          הציגי את ה-QR המתאים בסוף כל הרצאה. הפונים יסרקו ויגיעו ישירות לוואטסאפ עם הודעת פתיחה שכוללת את שם ההרצאה.
        </p>

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">טוען...</p>
        ) : lectures.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            אין הרצאות עם PDF סיכום. הוסיפי רשומת ServiceContent עם service_type=post_lecture, content_type=pdf ו-sub_type=שם ההרצאה.
          </p>
        ) : (
          <div className="space-y-6">
            {lectures.map((lecture) => {
              const lectureName = lecture.sub_type;
              const msg = `הי ד"ר אדרי, אשמח לקבל את הסיכום של ההרצאה - ${lectureName}`;
              const encodedMsg = encodeURIComponent(msg);
              const whatsappLink = `https://wa.me/${phone}?text=${encodedMsg}`;
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(whatsappLink)}`;

              return (
                <div key={lecture.id} className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-bold text-sm text-foreground">{lectureName}</h3>
                  
                  <div className="flex justify-center">
                    <img
                      src={qrUrl}
                      alt={`QR - ${lectureName}`}
                      className="w-48 h-48 rounded-lg border"
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-2 text-xs text-center break-all" dir="ltr">
                    {whatsappLink}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleCopy(whatsappLink, lecture.id)}>
                      <Copy className="h-3.5 w-3.5" />
                      {copiedId === lecture.id ? 'הועתק!' : 'העתק קישור'}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        פתח בוואטסאפ
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}