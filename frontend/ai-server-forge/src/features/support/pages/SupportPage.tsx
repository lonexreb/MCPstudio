import { LifeBuoy } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import FaqSection from '../components/FaqSection';
import QuickLinks from '../components/QuickLinks';
import FeedbackForm from '../components/FeedbackForm';

const SupportPage = () => {
  return (
    <MainLayout title="Help & Support" subtitle="Get help and share feedback">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl p-6 gradient-aurora shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <LifeBuoy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Help & Support</h2>
              <p className="text-white/70 text-sm">
                Find answers, explore resources, and send us feedback
              </p>
            </div>
          </div>
        </div>

        <QuickLinks />
        <FaqSection />
        <FeedbackForm />
      </div>
    </MainLayout>
  );
};

export default SupportPage;
