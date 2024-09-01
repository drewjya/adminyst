import type { Updater } from "@tanstack/vue-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import weekOfYear from "dayjs/plugin/weekOfYear.js";

import dayjs from "dayjs";
import { Gender, OrderStatus } from "./enum";


export function formatDateString(format: string, dateString?: string) {
  return dateString ? dayjs(new Date(dateString)).format(format) : "-";
}

export function genOrderStatus(status: OrderStatus, buktiBayar: boolean) {
  
  let vals: OrderStatus[] = [];
  if (status === OrderStatus.PENDING) {
    if (buktiBayar) {
      vals = [OrderStatus.CONFIRMED]
    } else {
      vals = [OrderStatus.CANCELLED, OrderStatus.CONFIRMED]
    }
  } else if (status === OrderStatus.CONFIRMED) {
    vals = [OrderStatus.ONGOING, OrderStatus.RESCHEDULE]
  } else if (status === 'RESCHEDULE') {
    vals = [OrderStatus.CONFIRMED]
  } else if (status === 'ONGOING') {
    vals = [OrderStatus.COMPLETE]
  }

  return vals;
}

export function orderStatusList() {
  return Array.from(Object.values(OrderStatus));
}

export function genderList() {
  return Array.from(Object.values(Gender));
}

export function todayString() {
  return dayjs().format("YYYY-MM-DD");
  // return "2024-07-30";
}

export function getWeek(val: string) {
  dayjs.extend(weekOfYear);
  return dayjs(val).week();
}

export function getWeekDates(val: string) {
  const now = dayjs(val);

  const endWeek = now.endOf("week").format("YYYY-MM-DD");
  const startPrev = now
    .subtract(1, "week")
    .startOf("week")
    .format("YYYY-MM-DD");
  return {
    startPrev,
    endWeek,
  };
}

export function formatStringDate(value: string) {
  const val = dayjs(value);
  return {
    start: val.startOf("month").toDate(),
    end: val.endOf("month").toDate(),
  };
}

export function stringDateThisAndNExt(value: string) {
  const val = dayjs(value);
  return {
    start: val.subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    end: val.endOf("month").format("YYYY-MM-DD"),
  };
}

export function generateColor(status: OrderStatus) {
  return status === OrderStatus.COMPLETE
    ? "bg-green-200"
    : status === OrderStatus.CANCELLED
    ? "bg-red-200"
    : status === OrderStatus.PENDING
    ? "bg-gray-200"
    : status === OrderStatus.CONFIRMED
    ? "bg-blue-200"
    : status === OrderStatus.ONGOING
    ? "bg-yellow-200"
    : status === OrderStatus.RESCHEDULE
    ? "bg-purple-200"
    : "bg-orange-200";
}

export function currencyFormat(val: number) {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return formatter.format(val);
}

export function numberFormat(val: number) {
  const formatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  });
  return formatter.format(val);
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export function getLastItem<T>(data: T[]) {
  return data[data.length - 1];
}

export function titleCase(val: string) {
  return val
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
