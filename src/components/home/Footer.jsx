import { ExternalLink } from 'lucide-react'

const Footer = () => (
  <footer className="mt-auto border-t border-gray-100 bg-white py-6">
    <div className="flex flex-col items-center gap-2">
      <a
        href="https://github.com/PawanKumar2001/MYNotes_Frontend"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
      >
        <ExternalLink size={15} />
        MYNotes_Frontend
      </a>
      <p className="text-xs text-gray-400">v2.0.0</p>
    </div>
  </footer>
)

export default Footer
