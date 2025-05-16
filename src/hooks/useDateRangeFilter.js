// hooks/useDateRangeFilter.js
import { useCallback } from "react";
import { filterByDateRange } from "../utils/dateRangeFilter";

export const useDateRangeFilter = ({ data, dateKey, onFilter }) => {
  const handleApply = useCallback(
    (range) => {
      if (range?.length === 2) {
        const filtered = filterByDateRange(data, dateKey, range);
        onFilter(filtered);
      }
    },
    [data, dateKey, onFilter]
  );

  const handleCancel = useCallback(() => {
    onFilter(data);
  }, [data, onFilter]);

  return { handleApply, handleCancel };
};
