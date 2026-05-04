import './globals.css'
import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'

const tajawal = Tajawal({ 
  subsets: ['arabic'], 
  weight: ['200', '300', '400', '500', '700', '800', '900'] 
});

export const metadata: Metadata = {
  title: 'FFT Content Hub - إدارة محتوى ملتقى FFT',
  description: 'منصة إدارة المحتوى الأسبوعي لملتقى FFT الطلابي — نظّم، خطط، وأنشر محتوى النوادي الثلاثة بسهولة واحترافية. مصنع الأفكار المبتكرة بالذكاء الاصطناعي.',
  keywords: ['FFT', 'ملتقى طلابي', 'نوادي', 'ذكاء اصطناعي', 'ريادة أعمال', 'إعلام', 'تقنية'],
  openGraph: {
    title: 'FFT Content Hub',
    description: 'ملتقى طلابي رائد — إدارة محتوى النوادي الثلاثة',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
