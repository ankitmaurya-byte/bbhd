import React, { useState, useRef, useEffect } from "react";

const SelectDays: React.FC<{
  handleDaysChanges: (selectedDay: number) => void;
  day: number | null;
}> = ({ day, handleDaysChanges }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelection = (days: number) => {
    handleDaysChanges(days);
    setIsOpen(false); // Close dropdown after selection
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block w-32" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-2  bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 text-left text-sm"
      >
        {day ? `${day} ${day === 1 ? "day" : "days"}` : "Days"}
        <span className="absolute right-3 top-3 pointer-events-none">▼</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <li
            onClick={() => handleSelection(0)}
            className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-black hover:text-white"
          >
            Days
          </li>
          {[...Array(30)].map((_, index) => (
            <li
              key={index + 1}
              onClick={() => handleSelection(index + 1)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-black hover:text-white"
            >
              {index + 1} {index + 1 === 1 ? "day" : "days"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectDays;
