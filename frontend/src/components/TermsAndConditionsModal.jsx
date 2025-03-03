import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div 
        ref={modalRef}
        className={`${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} p-6 rounded-lg shadow-lg max-w-2xl w-full`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Terms and Conditions
          </h2>
          <button 
            onClick={onClose} 
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`max-h-96 overflow-y-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm scrollbar-thin`}>
          <p className="mb-4">
            By creating an account and using our colocation platform, you agree to these Terms and Conditions. Please read them carefully before proceeding.
          </p>

          <h3 className="font-bold text-lg mb-2">1. Platform Description</h3>
          <p className="mb-4">
            Our platform provides a digital marketplace where users can find, advertise, and arrange shared living accommodations. We solely provide the technology to connect individuals and do not own, lease, manage, or control any properties listed on our platform.
          </p>

          <h3 className="font-bold text-lg mb-2">2. User Responsibilities</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Users are solely responsible for the accuracy of information they provide.</li>
            <li>Users must verify all information regarding properties or potential roommates independently.</li>
            <li>Users are responsible for their own safety and security when meeting potential roommates or visiting properties.</li>
            <li>All financial transactions between users are conducted at their own risk.</li>
            <li>Users must comply with all applicable local laws and regulations related to housing and rental agreements.</li>
          </ul>

          <h3 className="font-bold text-lg mb-2">3. Disclaimer of Liability</h3>
          <p className="mb-4">
            <strong>We are not responsible for any damages, injuries, conflicts, financial losses, or other negative outcomes resulting from using our platform, including but not limited to:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Any act of violence, harassment, or criminal activity by users.</strong></li>
            <li>Inaccurate or misleading information provided by users.</li>
            <li>Any disputes between roommates or tenants and landlords.</li>
            <li>Property conditions, lease terms, or financial arrangements between users.</li>
            <li>Failure of users to fulfill their financial or contractual obligations.</li>
            <li>Any personal injury or property damage occurring during property visits or shared occupancy.</li>
            <li>Loss of personal data due to security breaches outside our reasonable control.</li>
            <li>Service interruptions, delays, or platform unavailability.</li>
          </ul>

          <h3 className="font-bold text-lg mb-2">4. No Verification or Screening</h3>
          <p className="mb-4">
            We do not verify user identities, conduct background checks, or screen property listings. Users understand that the platform does not guarantee the identity, character, behavior, or reliability of other users.
          </p>

          <h3 className="font-bold text-lg mb-2">5. Release of Claims</h3>
          <p className="mb-4">
            By using our platform, you release the administrators, owners, employees, and affiliates from all claims, demands, and damages (actual and consequential) arising out of or in any way connected with disputes with other users or your use of the platform.
          </p>

          <h3 className="font-bold text-lg mb-2">6. Indemnification</h3>
          <p className="mb-4">
            You agree to indemnify, defend, and hold harmless the platform administrators, owners, employees, and affiliates from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) made by any third party due to or arising out of your use of the platform, your violation of these terms, or your violation of any rights of another.
          </p>

          <h3 className="font-bold text-lg mb-2">7. User Conduct</h3>
          <p className="mb-4">
            You agree not to use the platform for any illegal or unauthorized purpose. You must not transmit worms, viruses, or any code of a destructive nature. Harassment, discrimination, hate speech, or threatening behavior toward other users is prohibited and may result in account termination.
          </p>

          <h3 className="font-bold text-lg mb-2">8. Termination</h3>
          <p className="mb-4">
            We reserve the right to terminate or suspend your account at any time for any reason without notice or liability to you.
          </p>

          <h3 className="font-bold text-lg mb-2">9. Changes to Terms</h3>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. Continued use of the platform after any changes constitutes acceptance of the modified terms.
          </p>

          <h3 className="font-bold text-lg mb-2">10. Governing Law</h3>
          <p className="mb-4">
            These terms shall be governed by and construed in accordance with local laws, without regard to its conflict of law provisions.
          </p>

          <p className="mt-6 font-bold">
            BY CREATING AN ACCOUNT OR USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition`}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TermsAndConditionsModal;