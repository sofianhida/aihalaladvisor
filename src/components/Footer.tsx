import React from 'react';
import { Github, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  translations: {
    createdBy: string;
    allRightsReserved: string;
  };
}

export function Footer({ translations }: FooterProps) {
  const socialLinks = [
    {
      href: "https://github.com/sofianhida",
      icon: Github,
      hoverColor: "hover:text-gray-900"
    },
    {
      href: "https://www.instagram.com/sofianzz_z",
      icon: Instagram,
      hoverColor: "hover:text-pink-600"
    },
    {
      href: "https://youtube.com/@sofianhidayat101",
      icon: Youtube,
      hoverColor: "hover:text-red-600"
    }
  ];

  return (
    <footer className="bg-white/80 backdrop-blur-md shadow-lg mt-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800">{translations.createdBy} Sofian Hidayat</h3>
            <p className="text-sm text-gray-600">AI-Powered Halal Diet Advisor</p>
          </motion.div>
          
          <div className="flex space-x-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-600 ${link.hoverColor} transition-colors`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <link.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
          
          <motion.div
            className="text-sm text-gray-500"
            whileHover={{ scale: 1.05 }}
          >
            © {new Date().getFullYear()} {translations.allRightsReserved}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}