import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Clock,
  Gift,
  Settings,
  Wrench,
  ChevronUp,
  Home,
  ShoppingBag,
  Info,
  MessageSquare,
  Globe
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import MotorcycleIcon from "@/components/ui/motorcycle-icon";

const Footer = () => {
  const { data: categories } = useCategories();
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-black text-white border-t border-yellow-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className={`flex items-center mb-4 group ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`text-yellow-500 relative ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <MotorcycleIcon 
                  size={32} 
                  className="group-hover:scale-110 transition-transform" 
                />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </div>
              <h3 className="text-xl font-bold">
                <span className="text-yellow-500 group-hover:text-yellow-400 transition-colors">Rammeh</span>{" "}
                <span className="text-white group-hover:tracking-wider transition-all duration-300">MotoScoot</span>
              </h3>
            </div>
            <p className={`text-gray-400 mb-4 hover:text-gray-300 transition-colors ${isRTL ? 'text-right' : ''}`}>
              {t('footer.companyDesc')}
            </p>
            <div className={`flex ${isRTL ? 'space-x-reverse space-x-5 justify-end' : 'space-x-5'}`}>
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 hover:scale-125 transition-all duration-300" 
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 hover:scale-125 transition-all duration-300" 
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-yellow-500 hover:text-yellow-400 hover:scale-125 transition-all duration-300" 
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-8 after:h-[2px] after:bg-yellow-500 after:bottom-[-4px] after:left-0">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className={`group flex items-center text-gray-400 hover:text-yellow-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Home size={16} className={`text-yellow-500 group-hover:scale-110 transition-transform ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{t('header.home')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className={`group flex items-center text-gray-400 hover:text-yellow-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <ShoppingBag size={16} className={`text-yellow-500 group-hover:scale-110 transition-transform ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{t('header.products')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/#featured" 
                  className={`group flex items-center text-gray-400 hover:text-yellow-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <MotorcycleIcon
                    size={16}
                    className={`text-yellow-500 group-hover:scale-110 transition-transform ${isRTL ? 'ml-2' : 'mr-2'}`}
                  />
                  <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{t('home.featured.title')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`group flex items-center text-gray-400 hover:text-yellow-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Info size={16} className={`text-yellow-500 group-hover:scale-110 transition-transform ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{t('header.about')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={`group flex items-center text-gray-400 hover:text-yellow-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <MessageSquare size={16} className={`text-yellow-500 group-hover:scale-110 transition-transform ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>{t('header.contact')}</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-8 after:h-[2px] after:bg-yellow-500 after:bottom-[-4px] after:left-0">
              {t('footer.categories')}
            </h3>
            <ul className="space-y-3">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/products?category=${category.slug}`}
                    className={`group flex items-center text-gray-400 hover:text-yellow-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Settings size={16} className={`text-yellow-500 group-hover:rotate-45 transition-transform duration-300 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>
                      {t(`products.categoryItems.${category.slug}`) || category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-500 relative inline-block after:content-[''] after:absolute after:w-8 after:h-[2px] after:bg-yellow-500 after:bottom-[-4px] after:left-0">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-3">
              <li className={`flex items-start group ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <MapPin className={`mt-1 text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform ${isRTL ? 'ml-3' : 'mr-3'}`} size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{t('footer.address')}</span>
              </li>
              <li className={`flex items-center group ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <Phone className={`text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform ${isRTL ? 'ml-3' : 'mr-3'}`} size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{t('footer.phone')}</span>
              </li>
              <li className={`flex items-center group ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <Mail className={`text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform ${isRTL ? 'ml-3' : 'mr-3'}`} size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">info@rammehmotoscoot.com</span>
              </li>
              <li className={`flex items-start group ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <Clock className={`mt-1 text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform ${isRTL ? 'ml-3' : 'mr-3'}`} size={18} />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors" 
                      dangerouslySetInnerHTML={{ __html: t('footer.hours') }}>
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row md:justify-between items-center ${isRTL ? 'text-right' : ''}`}>
          <p className="text-gray-400 text-sm mb-4 md:mb-0" dangerouslySetInnerHTML={{ __html: t('footer.copyright', { year: new Date().getFullYear() }) }}></p>
          <div className={`flex flex-wrap justify-center ${isRTL ? 'space-x-reverse space-x-6 rtl:space-x-6' : 'space-x-6'}`}>
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">{t('footer.privacy')}</a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">{t('footer.terms')}</a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">{t('footer.shipping')}</a>
            <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition">{t('footer.returns')}</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full shadow-lg transition-all hover:scale-110 group animate-bounce`}
        aria-label={t('footer.backToTop')}
      >
        <ChevronUp size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-ping"></span>
      </button>
    </footer>
  );
};

export default Footer;
