"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Brand } from "@/components/Brand";

export default function GenerateQRPage() {
  const [tableNumber, setTableNumber] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [qrUrl, setQrUrl] = useState("");
  const [orderUrl, setOrderUrl] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function openTable() {
    const table = tableNumber.trim();

    const adultCount = Math.max(0, Number(adults) || 0);
    const childCount = Math.max(0, Number(children) || 0);

    if (!table) {
      setMessage("กรุณากรอกหมายเลขโต๊ะ");
      setMessageType("error");
      return;
    }

    if (adultCount + childCount < 1) {
      setMessage("กรุณาระบุจำนวนลูกค้าอย่างน้อย 1 คน");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setCopied(false);

    try {
      const response = await fetch("/api/sessions/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNumber: table,
          adultCount,
          childCount,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "เปิดโต๊ะไม่สำเร็จ"
        );
      }

      const session = result.session;

      const url =
        `${window.location.origin}/order/` +
        `${encodeURIComponent(table)}` +
        `?token=${encodeURIComponent(session.token)}`;

      setOrderUrl(url);

      const generatedQr = await QRCode.toDataURL(url, {
        width: 560,
        margin: 1,
        color: {
          dark: "#17201d",
          light: "#fffaf0",
        },
      });

      setQrUrl(generatedQr);

      setMessage(
        result.reused
          ? "ใช้ QR ของโต๊ะนี้ที่เปิดอยู่แล้ว"
          : "เปิดโต๊ะเรียบร้อย"
      );

      setMessageType("success");
    } catch (error) {
      setMessage(
        error.message || "เกิดข้อผิดพลาด"
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function copyOrderUrl() {
    if (!orderUrl) return;

    try {
      await navigator.clipboard.writeText(orderUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      setMessage("ไม่สามารถคัดลอกลิงก์ได้");
      setMessageType("error");
    }
  }

  return (
    <main className="container qr-studio-page">

      {/* HEADER */}
      <header className="qr-studio-nav">
        <Brand compact />

        <span>TABLE STUDIO</span>

        <small>WAN HIMA BINGSU</small>
      </header>


      {/* MAIN */}
      <section className="qr-studio-layout">

        {/* LEFT : FORM */}
        <div className="qr-studio-form">

          <span className="studio-kicker">
            SET THE TABLE
          </span>

          <h1>
            สร้างทางเข้า
            <br />
            <em>สำหรับโต๊ะของคุณ</em>
          </h1>

          <p>
            กรอกข้อมูลโต๊ะ แล้วสร้าง QR
            สำหรับลูกค้าสแกนเพื่อเปิดเมนู
            และสั่งบิงซู
          </p>


          {/* TABLE NUMBER */}
          <label>
            หมายเลขโต๊ะ

            <input
              value={tableNumber}
              onChange={(event) =>
                setTableNumber(event.target.value)
              }
              placeholder="01"
            />
          </label>


          {/* PEOPLE */}
          <div className="studio-split">

            <label>
              ผู้ใหญ่

              <input
                type="number"
                min="0"
                value={adults}
                onChange={(event) =>
                  setAdults(event.target.value)
                }
              />
            </label>


            <label>
              เด็ก

              <input
                type="number"
                min="0"
                value={children}
                onChange={(event) =>
                  setChildren(event.target.value)
                }
              />
            </label>

          </div>


          {/* CREATE QR */}
          <button
            className="studio-submit"
            onClick={openTable}
            disabled={loading}
          >
            {loading
              ? "กำลังสร้าง..."
              : "สร้าง QR →"}
          </button>


          {/* MESSAGE */}
          {message && (
            <p
              className={`studio-message ${messageType}`}
            >
              {message}
            </p>
          )}

        </div>


        {/* RIGHT : QR */}
        <div className="qr-studio-preview">

          {qrUrl ? (

            <>

              {/* QR CARD */}
              <div className="qr-paper">

                <img
                  src={qrUrl}
                  alt={`QR โต๊ะ ${tableNumber}`}
                />

                <span>
                  SCAN FOR BINGSU
                </span>

              </div>


              {/* TABLE NAME */}
              <h2>
                TABLE {tableNumber}
              </h2>

              <p>
                สแกนเพื่อเปิดเมนูและสั่งจากโต๊ะ
              </p>


              {/* DIRECT LINK */}
              <div className="qr-direct-link">

                <div className="qr-direct-link-title">
                  🔗 ลิงก์หน้าสั่งอาหาร
                </div>

                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="qr-direct-link-url"
                >
                  {orderUrl}
                </a>


                {/* COPY BUTTON */}
                <button
                  type="button"
                  className="qr-copy-button"
                  onClick={copyOrderUrl}
                >
                  {copied
                    ? "✓ คัดลอกแล้ว"
                    : "📋 คัดลอกลิงก์"}
                </button>

              </div>

            </>

          ) : (

            /* EMPTY */
            <div className="qr-empty">

              <span>QR</span>

              <h2>
                รอการสร้าง
              </h2>

              <p>
                QR ของโต๊ะจะอยู่ตรงนี้
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}
