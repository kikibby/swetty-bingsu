import "./globals.css";

export const metadata = {
  title: "หวานหิมะ บิงซู | WAN HIMA BINGSU",
  description: "ระบบสั่งอาหาร QR และจัดการออเดอร์แบบเรียลไทม์สำหรับหวานหิมะ บิงซู",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
