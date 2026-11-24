import Link from 'next/link'
import { Logo } from './Logo'
import { buildWhatsAppUrl, t, type Locale, type T } from '@/lib/i18n'

export function Footer({ locale, s }: { locale: Locale; s: any }) {
  const tr = t(locale)
  const isBn = locale === 'bn'
  const waPhone = s?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801625347735'
  const waUrl = buildWhatsAppUrl({ phone: waPhone, locale })

  return (
    <footer className="footer">
      <div className="container footer-in">
        {/* Brand overview column */}
        <div className="footer-brand-col">
          <Link href={`/${locale}`} aria-label="Akhi Car Rental">
            <Logo locale={locale} />
          </Link>
          <p className="footer-tagline">
            {s?.tagline ||
              (isBn
                ? 'বাংলাদেশের নির্ভরযোগ্য ও প্রিমিয়াম কার রেন্টাল সমাধান।'
                : 'Premier luxury, executive, and corporate chauffeur solutions across Bangladesh.')}
          </p>
          <p className="footer-desc muted small">
            {s?.footerText ||
              (isBn
                ? 'এক দশকেরও বেশি সময় ধরে পেশাদার ড্রাইভার ও আধুনিক গাড়ির বহর নিয়ে সেবা দিয়ে আসছি।'
                : 'Excellence in luxury automotive hire, corporate long-term mobility, and 24/7 VIP airport transfers in Dhaka.')}
          </p>
          <div className="footer-badges">
            <span className="badge-item">🛡️ {isBn ? '১০০% ভেরিফায়েড ড্রাইভার' : 'Verified Chauffeurs'}</span>
            <span className="badge-item">⭐ {isBn ? 'শীর্ষ রেটেড সার্ভিস' : 'Top Rated Service'}</span>
          </div>
        </div>

        {/* Quick fleet categories */}
        <div className="footer-col">
          <h4>{tr('nav_fleet')}</h4>
          <ul className="foot-links">
            <li>
              <Link href={`/${locale}/fleet?category=sedan`}>{isBn ? 'এক্সিকিউটিভ সেডান' : 'Executive Sedans'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/fleet?category=microbus`}>
                {isBn ? 'নোয়া ও হায়েস মাইক্রোবাস' : 'Noah & Hiace Vans'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/fleet?category=suv`}>{isBn ? 'প্রাডো ও ৪x৪ এসইউভি' : 'Prado & 4x4 SUVs'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/fleet?category=luxury`}>{isBn ? 'মার্সিডিজ ও লাক্সারি' : 'Luxury VIP Sedans'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/fleet?category=pickup`}>{isBn ? 'হাইল্যাক্স ডাবল কেবিন' : '4x4 Double Cabins'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/fleet?category=bus`}>{isBn ? 'টয়োটা কোস্টার কোচ' : 'Tourist & Staff Coaches'}</Link>
            </li>
          </ul>
        </div>

        {/* Services & Navigation */}
        <div className="footer-col">
          <h4>{tr('nav_services')}</h4>
          <ul className="foot-links">
            <li>
              <Link href={`/${locale}/services`}>{isBn ? 'দৈনিক কার রেন্টাল' : 'Daily & Hourly Rental'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/services`}>{isBn ? 'মাসিক ডেডিকেটেড প্ল্যান' : 'Monthly Dedicated Plans'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/services`}>{isBn ? 'কর্পোরেট ফ্লিট চুক্তি' : 'Corporate Fleet Contracts'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/services`}>{isBn ? 'ভিআইপি এয়ারপোর্ট ট্রান্সফার' : 'Airport VIP Transfers'}</Link>
            </li>
            <li>
              <Link href={`/${locale}/facilities`}>{tr('nav_facilities')}</Link>
            </li>
            <li>
              <Link href={`/${locale}/about`}>{tr('nav_about')}</Link>
            </li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="footer-col footer-contact-col">
          <h4>{tr('contact_title')}</h4>
          <div className="footer-contact-items">
            <a href={`tel:${(s?.phone || '+8801625347735').replace(/\s/g, '')}`} className="contact-line">
              <span className="contact-icon">📞</span>
              <div>
                <small className="muted">{isBn ? '২৪/৭ সাপোর্ট হেল্পলাইন' : '24/7 Hotline'}</small>
                <strong>{s?.phone || '+880 1625-347735'}</strong>
              </div>
            </a>

            <a href={waUrl} target="_blank" rel="noreferrer" className="contact-line">
              <span className="contact-icon wa-icon">💬</span>
              <div>
                <small className="muted">{isBn ? 'তাৎক্ষণিক হোয়াটসঅ্যাপ' : 'Instant WhatsApp'}</small>
                <strong>+{waPhone}</strong>
              </div>
            </a>

            <a href={`mailto:${s?.email || 'akhicarrental77@gmail.com'}`} className="contact-line">
              <span className="contact-icon">✉️</span>
              <div>
                <small className="muted">{isBn ? 'ইনকোয়ারি ইমেইল' : 'Email Concierge'}</small>
                <strong>{s?.email || 'akhicarrental77@gmail.com'}</strong>
              </div>
            </a>

            <div className="contact-line">
              <span className="contact-icon">📍</span>
              <div>
                <small className="muted">{isBn ? 'অফিসের ঠিকানা' : 'Office Address'}</small>
                <span>{s?.address || 'House 12, Road 4, Sector 3, Uttara, Dhaka, Bangladesh'}</span>
              </div>
            </div>

            <div className="contact-line">
              <span className="contact-icon">🕒</span>
              <div>
                <small className="muted">{isBn ? 'কর্মঘণ্টা' : 'Operating Hours'}</small>
                <span>{s?.hours || 'Open 24 Hours / 7 Days'}</span>
              </div>
            </div>
          </div>

          <div className="footer-social-links">
            <a
              href={s?.facebook || s?.socials?.facebook || 'https://facebook.com/akhicarrental'}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              Facebook
            </a>
            {s?.socials?.instagram && (
              <a href={s.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                Instagram
              </a>
            )}
            {s?.socials?.youtube && (
              <a href={s.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                YouTube
              </a>
            )}
            {s?.socials?.linkedin && (
              <a href={s.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="copy muted">
          © {new Date().getFullYear()} {tr('brand')}. {tr('footer_rights')}
        </div>
        <div className="foot-secure-note muted small">
          🔒 {isBn ? 'নিরাপদ, বিশ্বস্ত ও ভেরিফায়েড কার রেন্টাল সেবা' : 'Verified, Licensed & Insured Fleet Operator in Dhaka'}
        </div>
      </div>
    </footer>
  )
}
