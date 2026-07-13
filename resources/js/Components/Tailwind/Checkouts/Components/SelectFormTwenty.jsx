import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

const SelectFormTwenty = ({
    options = [],
    placeholder = "Seleccionar opción",
    onChange,
    valueKey,
    labelKey,
    label,
    labelClass = "",
    className = "",
    disabled = false,
    value = null,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const selectRef = useRef(null);

    const isArrayOfObjects = options.length > 0 && typeof options[0] === "object";

    const computedValueKey = isArrayOfObjects ? valueKey || Object.keys(options[0])[0] : null;
    const computedLabelKey = isArrayOfObjects ? labelKey || Object.keys(options[0])[1] : null;

    const normalizedOptions = useMemo(() => {
        return options.map((option) =>
            isArrayOfObjects
                ? { value: option[computedValueKey], label: option[computedLabelKey] }
                : { value: option, label: option }
        );
    }, [options, isArrayOfObjects, computedValueKey, computedLabelKey]);

    const filteredOptions = useMemo(() => {
        return normalizedOptions.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [normalizedOptions, searchTerm]);

    useEffect(() => {
        if (value && normalizedOptions.length > 0) {
            const option = normalizedOptions.find((opt) => opt.value === value);
            if (option && (!selectedOption || selectedOption.value !== option.value)) {
                setSelectedOption(option);
            }
        } else if (!value && selectedOption) {
            setSelectedOption(null);
        }
    }, [value, normalizedOptions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelectedOption(option);
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={selectRef}>
            {label && (
                <label className={`block text-[10px] font-paragraph uppercase tracking-widest text-white/50 mb-2 ${labelClass}`}>
                    {label}
                </label>
            )}
            <button
                type="button"
                className={`w-full relative text-start px-4 py-3 bg-transparent border border-white/20 text-white rounded-none focus:border-white focus:outline-none transition-all duration-300 ${className}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <span className="block truncate font-paragraph text-sm">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center justify-center py-3 pr-3 pointer-events-none">
                    <ChevronDown
                        className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-black border border-white/20 rounded-none shadow-2xl max-h-60 overflow-auto">
                    <div className="sticky top-0 bg-black p-2 border-b border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={14} />
                            <input
                                type="text"
                                className="w-full pl-8 pr-4 py-2 bg-neutral-900 border border-white/10 text-white text-xs font-paragraph rounded-none focus:outline-none focus:border-white/40"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <ul className="py-1" role="listbox">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-3 text-xs font-paragraph text-white/40 uppercase tracking-wider text-center">
                                Sin resultados
                            </li>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = selectedOption && selectedOption.value === option.value;
                                return (
                                    <li
                                        key={option.value}
                                        className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-xs font-paragraph uppercase tracking-wider transition-colors duration-150 ${
                                            isSelected
                                                ? "bg-white text-black font-bold"
                                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`}
                                        onClick={() => handleSelect(option)}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <span className="block truncate">{option.label}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectFormTwenty;
