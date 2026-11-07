import type { Locale } from './i18n'

/** Shown on the home hero if the CMS has no slides yet (or DB unreachable). */
export const fallbackSlides = (locale: Locale) =>
  locale === 'bn'
    ? [
        { eyebrow: 'প্রিমিয়াম কার রেন্টাল', title: 'আপনার যাত্রা, আমাদের দায়িত্ব', subtitle: 'ডেইলি, মান্থলি ও কর্পোরেট রেন্টাল — একই ছাদের নিচে।', ctaLabel: 'গাড়ি দেখুন', ctaLink: '/fleet', theme: 'violet' },
        { eyebrow: 'মান্থলি রেন্টাল', title: 'মাসিক প্ল্যানে সাশ্রয়ী ড্রাইভ', subtitle: 'অফিস, পরিবার বা ব্যবসা — নির্দিষ্ট গাড়ি, নির্দিষ্ট ড্রাইভার।', ctaLabel: 'প্ল্যান দেখুন', ctaLink: '/services', theme: 'pink' },
        { eyebrow: 'কর্পোরেট চুক্তি', title: 'আপনার টিমের জন্য ফ্লিট', subtitle: 'ইনভয়েসিং, ব্যাকআপ কার ও ২৪/৭ সাপোর্টসহ।', ctaLabel: 'চুক্তির জন্য কথা বলুন', ctaLink: '/contact', theme: 'amber' },
      ]
    : [
        { eyebrow: 'Premium car rental', title: 'Your journey, our responsibility', subtitle: 'Daily, monthly and corporate rentals — under one roof.', ctaLabel: 'Explore the fleet', ctaLink: '/fleet', theme: 'violet' },
        { eyebrow: 'Monthly rentals', title: 'Smarter driving on a monthly plan', subtitle: 'Offices, families or businesses — a dedicated car and driver.', ctaLabel: 'See plans', ctaLink: '/services', theme: 'pink' },
        { eyebrow: 'Corporate contracts', title: 'A fleet built around your team', subtitle: 'With invoicing, backup cars and 24/7 support.', ctaLabel: 'Talk contracts', ctaLink: '/contact', theme: 'amber' },
      ]
