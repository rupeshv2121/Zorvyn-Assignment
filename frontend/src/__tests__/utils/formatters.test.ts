import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatMonthYear,
} from "../../utils/formatters";

describe("Formatters", () => {
  describe("formatCurrency", () => {
    it("should format positive numbers as USD currency", () => {
      expect(formatCurrency(1000)).toBe("$1,000.00");
      expect(formatCurrency(1000.5)).toBe("$1,000.50");
      expect(formatCurrency(100)).toBe("$100.00");
    });

    it("should format zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("should format negative numbers", () => {
      expect(formatCurrency(-1000)).toBe("-$1,000.00");
    });

    it("should format large numbers with commas", () => {
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
      expect(formatCurrency(999999)).toBe("$999,999.00");
    });

    it("should handle decimal precision", () => {
      expect(formatCurrency(10.1)).toBe("$10.10");
      expect(formatCurrency(10.99)).toBe("$10.99");
      expect(formatCurrency(10.999)).toBe("$11.00");
    });
  });

  describe("formatDate", () => {
    it("should format ISO date string to MMM DD, YYYY", () => {
      const date = "2026-04-01";
      const result = formatDate(date);

      expect(result).toMatch(/^[A-Za-z]{3} \d{2}, \d{4}$/);
      expect(result).toContain("2026");
    });

    it("should handle different months correctly", () => {
      expect(formatDate("2026-01-15")).toBe("Jan 15, 2026");
      expect(formatDate("2026-12-25")).toBe("Dec 25, 2026");
      expect(formatDate("2026-06-30")).toBe("Jun 30, 2026");
    });

    it("should pad single digit days", () => {
      const result = formatDate("2026-04-01");
      expect(result).toBe("Apr 01, 2026");
    });
  });

  describe("formatDateTime", () => {
    it("should format ISO datetime string with time", () => {
      const datetime = "2026-04-01T14:30:00Z";
      const result = formatDateTime(datetime);

      expect(result).toMatch(/[A-Za-z]{3} \d{2}, \d{4} \d{2}:\d{2}/);
    });

    it("should include hours and minutes", () => {
      const datetime = "2026-04-01T14:30:00Z";
      const result = formatDateTime(datetime);

      expect(result).toContain("14:30");
    });

    it("should handle different times", () => {
      const datetime1 = "2026-04-01T00:00:00Z";
      const datetime2 = "2026-04-01T23:59:59Z";

      const result1 = formatDateTime(datetime1);
      const result2 = formatDateTime(datetime2);

      expect(result1).toContain("00:00");
      expect(result2).toContain("23:59");
    });
  });

  describe("formatMonthYear", () => {
    it("should format YYYY-MM string to Month Year", () => {
      expect(formatMonthYear("2026-04")).toBe("April 2026");
      expect(formatMonthYear("2026-01")).toBe("January 2026");
      expect(formatMonthYear("2026-12")).toBe("December 2026");
    });

    it("should handle all months", () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      months.forEach((month, index) => {
        const monthStr = String(index + 1).padStart(2, "0");
        const result = formatMonthYear(`2026-${monthStr}`);
        expect(result).toBe(`${month} 2026`);
      });
    });

    it("should handle different years", () => {
      expect(formatMonthYear("2025-04")).toBe("April 2025");
      expect(formatMonthYear("2027-04")).toBe("April 2027");
    });
  });
});
