import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import {
  HiChevronDown,
  HiOutlineDownload,
  HiOutlinePrinter,
} from "react-icons/hi";
import type { ExportFormat } from "../shared/types/wifi";

interface ActionButtonsProps {
  onPrint: () => void;
  onSaveAs: (format: ExportFormat) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPrint,
  onSaveAs,
}) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
      {/* Кнопка печати */}
      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
      >
        <HiOutlinePrinter className="h-4 w-4" />
        Распечатать
      </button>

      {/* Дропдаун скачивания */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200">
            <HiOutlineDownload className="h-4 w-4" />
            Скачать
            <HiChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white border border-gray-300 rounded-md shadow-lg z-50 p-1 min-w-[120px]"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 focus:bg-green-50 outline-none rounded"
              onClick={() => onSaveAs("png")}
            >
              <HiOutlineDownload className="h-4 w-4" />
              PNG изображение
            </DropdownMenu.Item>

            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 focus:bg-green-50 outline-none rounded"
              onClick={() => onSaveAs("jpeg")}
            >
              <HiOutlineDownload className="h-4 w-4" />
              JPEG изображение
            </DropdownMenu.Item>

            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 focus:bg-green-50 outline-none rounded"
              onClick={() => onSaveAs("svg")}
            >
              <HiOutlineDownload className="h-4 w-4" />
              SVG векторное
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
