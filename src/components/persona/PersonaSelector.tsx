import { useState, useRef, useEffect } from 'react';
import { UserCircle, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import type { PersonaType, EndCustomerSubcategory } from '@/types';
import { cn } from '@/utils/cn';

const PERSONA_LABELS: Record<PersonaType, string> = {
  area_manager: 'Area Manager',
  customer_care_rep: 'Customer Care Representative',
  end_customer: 'End Customer',
};

const END_CUSTOMER_SUBCATEGORY_LABELS: Record<EndCustomerSubcategory, string> = {
  platinum: 'Platinum',
  standard: 'Standard',
  high_risk: 'High Risk',
};

export function PersonaSelector() {
  const selectedPersona = useAppStore(state => state.selectedPersona);
  const setPersona = useAppStore(state => state.setPersona);
  const [isOpen, setIsOpen] = useState(false);
  const [showEndCustomerSubmenu, setShowEndCustomerSubmenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowEndCustomerSubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handlePersonaSelect = (persona: PersonaType) => {
    if (persona === 'end_customer') {
      // For end_customer, toggle submenu visibility
      setShowEndCustomerSubmenu(!showEndCustomerSubmenu);
    } else {
      // For other personas, select immediately
      setPersona({ persona });
      setIsOpen(false);
      setShowEndCustomerSubmenu(false);
    }
  };

  const handleSubcategorySelect = (subcategory: EndCustomerSubcategory) => {
    setPersona({ persona: 'end_customer', subcategory });
    setIsOpen(false);
    setShowEndCustomerSubmenu(false);
  };

  const getDisplayLabel = () => {
    if (selectedPersona.persona === 'end_customer' && selectedPersona.subcategory) {
      return `${PERSONA_LABELS.end_customer} - ${END_CUSTOMER_SUBCATEGORY_LABELS[selectedPersona.subcategory]}`;
    }
    return PERSONA_LABELS[selectedPersona.persona];
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select persona"
        title={getDisplayLabel()}
        className="h-9 w-9"
      >
        <UserCircle className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 min-w-[200px]"
        >
          <div className="py-1">
            {/* Area Manager */}
            <button
              onClick={() => handlePersonaSelect('area_manager')}
              className={cn(
                'w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-zinc-50 transition-colors',
                selectedPersona.persona === 'area_manager' && 'bg-blue-50'
              )}
            >
              <span>{PERSONA_LABELS.area_manager}</span>
              {selectedPersona.persona === 'area_manager' && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Customer Care Representative */}
            <button
              onClick={() => handlePersonaSelect('customer_care_rep')}
              className={cn(
                'w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-zinc-50 transition-colors',
                selectedPersona.persona === 'customer_care_rep' && 'bg-blue-50'
              )}
            >
              <span>{PERSONA_LABELS.customer_care_rep}</span>
              {selectedPersona.persona === 'customer_care_rep' && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* End Customer with nested subcategories */}
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePersonaSelect('end_customer');
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-zinc-50 transition-colors',
                  selectedPersona.persona === 'end_customer' && 'bg-blue-50'
                )}
              >
                <span>{PERSONA_LABELS.end_customer}</span>
                <div className="flex items-center gap-1">
                  {selectedPersona.persona === 'end_customer' && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                  <ChevronRight className={cn(
                    'w-4 h-4 text-zinc-400 transition-transform',
                    showEndCustomerSubmenu && 'rotate-90'
                  )} />
                </div>
              </button>

              {/* Subcategories submenu - show on click or hover */}
              <div className={cn(
                'absolute right-full top-0 mr-1 bg-white border border-zinc-200 rounded-lg shadow-lg min-w-[160px] transition-opacity z-[60]',
                showEndCustomerSubmenu 
                  ? 'opacity-100 visible' 
                  : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              )}>
                <div className="py-1">
                  {(['platinum', 'standard', 'high_risk'] as EndCustomerSubcategory[]).map(
                    subcategory => (
                      <button
                        key={subcategory}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubcategorySelect(subcategory);
                        }}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-zinc-50 transition-colors',
                          selectedPersona.persona === 'end_customer' &&
                            selectedPersona.subcategory === subcategory &&
                            'bg-blue-50'
                        )}
                      >
                        <span>{END_CUSTOMER_SUBCATEGORY_LABELS[subcategory]}</span>
                        {selectedPersona.persona === 'end_customer' &&
                          selectedPersona.subcategory === subcategory && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
