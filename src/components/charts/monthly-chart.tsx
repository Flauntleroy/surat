"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyChartProps {
  data: number[]; // 12 months of data
  year: number;
}

export function MonthlyChart({ data, year }: MonthlyChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#667085",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#667085",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#E4E7EC",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    colors: ["#465FFF"],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} surat`,
      },
    },
  };

  const series = [
    {
      name: "Surat",
      data,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Surat per Bulan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Tahun {year}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-brand-500"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Jumlah Surat</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={280}
        />
      </div>
    </div>
  );
}
