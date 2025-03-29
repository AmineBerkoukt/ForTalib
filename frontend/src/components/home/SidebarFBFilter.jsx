import React, { useState, useCallback, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePostStore } from "../../store/usePostStore.js";
import {toast} from "react-hot-toast";

const DEFAULT_FILTERS = {
    price: 2000,
    rate: 0,
};

const SidebarFBFilter = () => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const { getPosts, getPostsFilter } = usePostStore();

    // Check if there are active filters
    const hasActiveFilters = useMemo(
        () =>
            filters.price !== DEFAULT_FILTERS.price ||
            filters.rate !== DEFAULT_FILTERS.rate,
        [filters]
    );

    // Update filters state on change
    const handleFilterChange = useCallback((name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: typeof value === "string" ? value : Number(value),
        }));
    }, []);

    // Fetch filtered posts
    const handleSearch = useCallback(async () => {
        try {
            await getPostsFilter(filters.price, filters.rate);
            toast.success("Filters applied !")
        } catch (error) {
            console.error("Error fetching filtered posts:", error);
        }
    }, [filters, getPostsFilter]);

    // Reset filters to default
    const handleRemoveFilters = useCallback(async () => {
        setFilters(DEFAULT_FILTERS);
        try {
            await getPosts();
            toast.success("Filters removed !")
        } catch (error) {
            console.error("Error fetching all posts:", error);
        }
    }, [getPosts]);

    // Render a range input element
    const renderRangeInput = useCallback(
        ({ id, label, min, max, step = 1, value, unit = "" }) => (
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}: {value} {unit}
                </label>
                <input
                    type="range"
                    id={id}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => handleFilterChange(id, e.target.value)}
                    className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>{min} {unit}</span>
                    <span>{max} {unit}</span>
                </div>
            </div>
        ),
        [handleFilterChange]
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Filters
                </h2>
                {hasActiveFilters && (
                    <button
                        className="bg-red-100 text-red-600 text-xs sm:text-sm font-medium py-1 px-2 sm:px-3 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 transition-colors duration-200"
                        onClick={handleRemoveFilters}
                    >
                        Remove Filters
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {renderRangeInput({
                    id: "price",
                    label: "Price",
                    min: 0,
                    max: 5000,
                    value: filters.price,
                    unit: "DHs",
                })}

                {renderRangeInput({
                    id: "rate",
                    label: "Minimum Rate",
                    min: 0,
                    max: 5,
                    step: 0.5,
                    value: filters.rate,
                    unit: "stars",
                })}
            </div>

            <button
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors duration-200 relative group text-sm"
                onClick={handleSearch}
            >
                <span className="mr-6">Search</span>
                <MagnifyingGlassIcon
                    className="h-4 w-4 sm:h-5 sm:w-5 text-white absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform group-hover:scale-110"
                />
            </button>
        </div>
    );
};

export default SidebarFBFilter;
