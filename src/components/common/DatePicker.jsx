import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

function DatePicker({ value, onChange, placeholder = "Sélectionner une date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const containerRef = useRef(null);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text cursor-pointer hover:border-primary/50 transition-all flex items-center"
      >
        <Calendar className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
        <span className={selectedDate ? 'text-text' : 'text-gray-500'}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-darkGray rounded-xl shadow-2xl z-[10000] w-[320px] p-4">
          {/* Header avec navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-darkGray rounded-lg transition-colors"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-text">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-darkGray rounded-lg transition-colors"
              type="button"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                disabled={!date}
                type="button"
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm transition-all
                  ${!date ? 'invisible' : ''}
                  ${isSelected(date) 
                    ? 'bg-primary text-white font-semibold shadow-lg scale-105' 
                    : isToday(date)
                    ? 'bg-primary/20 text-primary font-semibold'
                    : 'text-text hover:bg-darkGray'
                  }
                `}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>

          {/* Footer avec bouton aujourd'hui */}
          <div className="mt-4 pt-3 border-t border-darkGray">
            <button
              onClick={() => handleDateSelect(new Date())}
              className="w-full py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
              type="button"
            >
              Aujourd'hui
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
