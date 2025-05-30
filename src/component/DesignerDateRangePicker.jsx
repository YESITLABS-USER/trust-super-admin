import { useEffect, useRef } from "react";

const DesignerDateRangePicker = ({ onApply, onCancel, placeholder }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Ensure moment and daterangepicker are loaded
    if (window.$ && window.$.fn.daterangepicker) {
      const $ = window.$;

      const input = $(inputRef.current);

      input.daterangepicker(
        {
          autoUpdateInput: false,
          locale: {
            cancelLabel: "Clear",
          },
        },
        function (start, end) {
          // Optional: Set input display manually
          input.val(`${start.format("MM/DD/YYYY")} - ${end.format("MM/DD/YYYY")}`);
        }
      );

      input.on("apply.daterangepicker", function (ev, picker) {
        if (onApply) {
          onApply([picker.startDate.toDate(), picker.endDate.toDate()]);
        }
        input.val(`${picker.startDate.format("MM/DD/YYYY")} - ${picker.endDate.format("MM/DD/YYYY")}`);
      });

      input.on("cancel.daterangepicker", function () {
        if (onCancel) {
          onCancel();
        }
        input.val(""); // clear the input
      });

      return () => {
        input.data("daterangepicker")?.remove(); // Cleanup
      };
    }
  }, [onApply, onCancel]);

  return (
    <>
      {/* Include external styles/scripts only once in your app, e.g., _app.js or index.html */}
      <label className="daterange-btn">
        <img src="/images/filter-icons/date.svg" alt="" />
        <input
          type="text"
          readOnly
          className="input"
          name="datefilter"
          placeholder={placeholder || "Sign Up Date Range"}
          ref={inputRef}
        />
      </label>
    </>
  );
};

export default DesignerDateRangePicker;
