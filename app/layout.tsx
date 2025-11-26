import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RING39モバイルオーダー　プレビューツール",
  description: "UIパターンの比較ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

