import { useCallback } from "react";
import type { ExportFormat, WiFiCredentials } from "../types/wifi";

export const useQRExport = () => {
  const handlePrint = useCallback(
    (
      qrRef: React.RefObject<HTMLDivElement | null>,
      credentials: WiFiCredentials,
    ) => {
      if (!qrRef.current) return;

      const printContent = document.createElement("div");
      printContent.innerHTML = `
      <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="margin-bottom: 20px;">WiFi QR Code</h1>
        <div style="margin: 20px 0;">
          ${qrRef.current.innerHTML}
        </div>
        <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; display: inline-block;">
          <strong>Сеть:</strong> ${credentials.ssid}<br>
          ${credentials.password ? "<strong>Защищено паролем</strong>" : "<strong>Открытая сеть</strong>"}
        </div>
        <p style="margin-top: 20px;">Отсканируйте QR-код для подключения к WiFi сети</p>
      </div>
    `;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>WiFi QR Code - ${credentials.ssid}</title>
            <style>
              @page { margin: 1cm; }
              body { margin: 0; padding: 0; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
        printWindow.document.close();

        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 250);
      }
    },
    [],
  );

  const handleSaveAs = useCallback(
    async (
      qrRef: React.RefObject<HTMLDivElement | null>,
      credentials: WiFiCredentials,
      format: ExportFormat,
    ) => {
      if (!qrRef.current) return;

      try {
        if (format === "svg") {
          // Для SVG экспортируем напрямую
          const svgElement = qrRef.current.querySelector("svg");
          if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], {
              type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(svgBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `wifi-qr-${credentials.ssid}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        } else {
          // Для растровых форматов создаем canvas вручную
          const svgElement = qrRef.current.querySelector("svg");
          if (!svgElement) return;

          // Получаем размеры SVG
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();

          // Увеличиваем разрешение для лучшего качества
          const scale = 4;
          canvas.width = 200 * scale;
          canvas.height = 200 * scale;

          if (ctx) {
            // Белый фон
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const svgBlob = new Blob([svgData], {
              type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(url);

              // PNG или JPEG
              const quality = format === "jpeg" ? 0.9 : undefined;
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `wifi-qr-${credentials.ssid}.${format}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }
                },
                `image/${format}`,
                quality,
              );
            };

            img.onerror = () => {
              URL.revokeObjectURL(url);
              throw new Error("Не удалось загрузить SVG изображение");
            };

            img.src = url;
          }
        }
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
        alert("Ошибка при сохранении файла. Попробуйте другой формат.");
      }
    },
    [],
  );

  return {
    handlePrint,
    handleSaveAs,
  };
};
