import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import type { WiFiCredentials } from "../shared/types/wifi";

interface WiFiFormProps {
  credentials: WiFiCredentials;
  showPassword: boolean;
  ssidError: string;
  onCredentialsChange: (field: keyof WiFiCredentials, value: string) => void;
  onTogglePasswordVisibility: () => void;
  onGenerate: () => void;
  onReset: () => void;
  showResetButton: boolean;
}

export const WiFiForm: React.FC<WiFiFormProps> = ({
  credentials,
  showPassword,
  ssidError,
  onCredentialsChange,
  onTogglePasswordVisibility,
  onGenerate,
  onReset,
  showResetButton,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="ssid"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Название сети (SSID) *
        </label>
        <input
          type="text"
          id="ssid"
          value={credentials.ssid}
          onChange={(e) => onCredentialsChange("ssid", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
            ssidError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="Введите название WiFi сети"
          required
        />
        {ssidError && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {ssidError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Пароль
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={credentials.password}
            onChange={(e) => onCredentialsChange("password", e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите пароль сети"
          />
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <AiOutlineEye className="h-5 w-5" />
            ) : (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onGenerate}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Сгенерировать QR-код
        </button>

        {showResetButton && (
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
          >
            Очистить
          </button>
        )}
      </div>
    </div>
  );
};
