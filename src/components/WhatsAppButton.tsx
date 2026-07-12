import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '+2348123456789'; // Business phone number
  const message = 'Hello Gold & Rock Leather Craft! I am visiting your GR STORE website and have a question about your custom leather pieces.';
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#20ba56] transition-all"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      id="whatsapp-floating-button"
      title="Chat on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 fill-white" />
      <span className="absolute right-full mr-2 bg-[#0f1e36] text-white text-xs px-2.5 py-1 rounded-md opacity-0 hover:opacity-100 md:group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:inline-block shadow-md border border-slate-700 font-medium">
        Chat with Us
      </span>
    </motion.a>
  );
}
