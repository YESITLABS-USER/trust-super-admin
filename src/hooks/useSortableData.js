import { useState, useMemo } from "react";

// parseDate helper for date sorting (customize format if needed)
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const useSortableData = (data, initialConfig = { key: null, direction: "asc" }) => {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return data;

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig?.key];
      let bValue = b[sortConfig?.key];

      if (sortConfig?.key === "date") {
        aValue = parseDate(aValue);
        bValue = parseDate(bValue);
      } else if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortConfig?.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return { sortedData, sortConfig, handleSort };
};

export default useSortableData;
