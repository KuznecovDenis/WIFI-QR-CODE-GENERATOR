import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQRExport } from "../shared/hooks/useQRExport";
import type { ExportFormat, WiFiCredentials } from "../shared/types/wifi";
import { debounce } from "../shared/utils/debounce";
import { ActionButtons } from "./ActionButtons";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { WiFiForm } from "./WiFiForm";

export const WiFiQRGenerator: React.FC = () => {
  const [credentials, setCredentials] = useState<WiFiCredentials>({
    ssid: "",
    password: "",
  });
  const [qrValue, setQrValue] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordInInfo, setShowPasswordInInfo] = useState<boolean>(false);
  const [ssidError, setSsidError] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  const { handlePrint, handleSaveAs } = useQRExport();

  // Функция для генерации WiFi QR-кода
  const generateWiFiString = useCallback((ssid: string, password: string) => {
    if (!ssid.trim()) return "";
    return `WIFI:T:WPA;S:${ssid};P:${password};H:false;;`;
  }, []);

  // Дебаунсированная функция для автоматической перегенерации
  const debouncedRegenerate = useCallback(
    debounce((ssid: string, password: string) => {
      if (showQR && ssid.trim()) {
        const newWifiString = generateWiFiString(ssid, password);
        if (newWifiString) {
          setQrValue(newWifiString);
        }
      }
    }, 150),
    [showQR, generateWiFiString],
  );

  // Эффект для автоматической перегенерации при изменении данных
  useEffect(() => {
    debouncedRegenerate(credentials.ssid, credentials.password);
  }, [credentials.ssid, credentials.password, debouncedRegenerate]);

  const handleCredentialsChange = useCallback(
    (field: keyof WiFiCredentials, value: string) => {
      setCredentials((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Очищаем ошибку при вводе в SSID
      if (field === "ssid" && ssidError) {
        setSsidError("");
      }
    },
    [ssidError],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const togglePasswordInfoVisibility = useCallback(() => {
    setShowPasswordInInfo(!showPasswordInInfo);
  }, [showPasswordInInfo]);

  const generateWiFiQR = useCallback(() => {
    if (!credentials.ssid.trim()) {
      setSsidError("Пожалуйста, введите название сети (SSID)");
      return;
    }

    setSsidError(""); // Очищаем ошибку если она была
    const wifiString = generateWiFiString(
      credentials.ssid,
      credentials.password,
    );
    setQrValue(wifiString);
    setShowQR(true);
  }, [credentials.ssid, credentials.password, generateWiFiString]);

  const resetForm = useCallback(() => {
    setCredentials({ ssid: "", password: "" });
    setQrValue("");
    setShowQR(false);
    setSsidError("");
  }, []);

  const onPrint = useCallback(() => {
    handlePrint(qrRef, credentials);
  }, [handlePrint, credentials]);

  const onSaveAs = useCallback(
    (format: ExportFormat) => {
      handleSaveAs(qrRef, credentials, format);
    },
    [handleSaveAs, credentials],
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Генератор QR-кода для WiFi
      </h1>

      <WiFiForm
        credentials={credentials}
        showPassword={showPassword}
        ssidError={ssidError}
        onCredentialsChange={handleCredentialsChange}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onGenerate={generateWiFiQR}
        onReset={resetForm}
        showResetButton={showQR}
      />

      {showQR && qrValue && (
        <>
          <QRCodeDisplay
            ref={qrRef}
            qrValue={qrValue}
            credentials={credentials}
            showPasswordInInfo={showPasswordInInfo}
            onTogglePasswordInfoVisibility={togglePasswordInfoVisibility}
          />

          <ActionButtons onPrint={onPrint} onSaveAs={onSaveAs} />
        </>
      )}
    </div>
  );
};
