import { forwardRef } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import QRCode from "react-qr-code";
import type { WiFiCredentials } from "../shared/types/wifi";

interface QRCodeDisplayProps {
  qrValue: string;
  credentials: WiFiCredentials;
  showPasswordInInfo: boolean;
  onTogglePasswordInfoVisibility: () => void;
}

export const QRCodeDisplay = forwardRef<HTMLDivElement, QRCodeDisplayProps>(
  (
    {
      qrValue,
      credentials,
      showPasswordInInfo,
      onTogglePasswordInfoVisibility,
    },
    ref,
  ) => {
    return (
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          QR-код для подключения к WiFi
        </h3>

        <div
          ref={ref}
          className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block"
        >
          <QRCode value={qrValue} size={200} level="M" />
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Отсканируйте QR-код камерой телефона для автоматического подключения к
          сети
        </p>

        {/* Блок с информацией о сети */}
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-700 break-all flex flex-col gap-1 items-center">
          <div className="flex items-center gap-1">
            Сеть: <strong>{credentials.ssid}</strong>
          </div>
          {credentials.password && (
            <div className="flex items-center gap-1">
              <span>
                Пароль:{" "}
                <strong>
                  {showPasswordInInfo
                    ? credentials.password
                    : "*".repeat(credentials.password.length)}
                </strong>
              </span>
              <button
                type="button"
                onClick={onTogglePasswordInfoVisibility}
                className=" text-blue-600 hover:text-blue-800 focus:outline-none"
                title={showPasswordInInfo ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPasswordInInfo ? (
                  <AiOutlineEyeInvisible className="h-4 w-4" />
                ) : (
                  <AiOutlineEye className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);
