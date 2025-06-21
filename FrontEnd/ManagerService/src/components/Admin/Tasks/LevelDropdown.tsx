import React from "react";

interface Props {
    selectedLevel: string;
    onChange: (value: string) => void;
}

const availableLevels = ["Hight", "Medium", "Low"];

const levelColors: Record<string, string> = {
    Hight: "bg-red-100 text-red-600 border-red-600",
    Medium: "bg-yellow-100 text-yellow-600 border-yellow-600",
    Low: "bg-gray-100 text-gray-700 border-gray-500",
};

const LevelDropdown: React.FC<Props> = ({ selectedLevel, onChange }) => {
    return (
        <div className="flex gap-2">
            {availableLevels.map((level) => {
                const isSelected = selectedLevel === level;
                return (
                    <button
                        key={level}
                        onClick={() =>onChange(level)}
                        className={`capitalize px-4 py-2 border rounded-full transition 
                          ${
                            isSelected
                                ? levelColors[level]
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {level}
                    </button>
                );
            })}
        </div>
    );
};

export default LevelDropdown;
