import React, { useState } from 'react';
import { X, Ticket, Calendar, MapPin, CheckCircle, QrCode, CreditCard, Building, Phone } from 'lucide-react';
import { LIVE_SHOWS, BAND_INFO } from '../data/bandData';

interface TicketModalProps {
  showId?: string;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ showId, onClose }) => {
  const initialShow = LIVE_SHOWS.find(s => s.id === showId) || LIVE_SHOWS[0];
  const [selectedShow, setSelectedShow] = useState(initialShow);
  
  const [ticketType, setTicketType] = useState('Standard');
  const [quantity, setQuantity] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PromptPay' | 'CreditCard' | 'BankTransfer'>('PromptPay');
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const getPricePerTicket = () => {
    if (selectedShow.status === 'Free Entry') return 0;
    if (ticketType === 'VVIP Front Row') return 1800;
    if (ticketType === 'VIP Zone') return 1200;
    return 800;
  };

  const totalPrice = getPricePerTicket() * quantity;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    const ref = `TRIPLET-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setBookingSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!bookingSuccess ? (
          <>
            {/* Modal Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-red-500 uppercase">
                <Ticket className="w-3.5 h-3.5" />
                <span>ONLINE TICKET & TABLE BOOKING</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                จองบัตรคอนเสิร์ต / สำรองโต๊ะ
              </h3>
              <p className="text-xs text-neutral-400">
                เลือกการแสดงและกรอกข้อมูลเพื่อรับตั๋วอิเล็กทรอนิกส์ E-Ticket
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              
              {/* Select Show */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">เลือกรอบการแสดง</label>
                <select
                  value={selectedShow.id}
                  onChange={(e) => {
                    const found = LIVE_SHOWS.find(s => s.id === e.target.value);
                    if (found) setSelectedShow(found);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  {LIVE_SHOWS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.date} - {s.title} ({s.province})
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Venue Brief Card */}
              <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl text-xs space-y-1 text-neutral-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{selectedShow.venue} ({selectedShow.province})</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px] font-mono">
                  <span>เวลาแสดง: {selectedShow.time}</span>
                  <span className="text-red-400 font-bold">{selectedShow.ticketPrice}</span>
                </div>
              </div>

              {/* Ticket Type & Quantity */}
              {selectedShow.status !== 'Free Entry' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-300">โซนที่นั่ง/บัตร</label>
                    <select
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Standard">Standard Zone (800 บาท)</option>
                      <option value="VIP Zone">VIP Zone (1,200 บาท)</option>
                      <option value="VVIP Front Row">VVIP หน้าเวที (1,800 บาท)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neutral-300">จำนวนบัตร (ใบ)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">ชื่อ - นามสกุลผู้จอง *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น สมชาย ใจดี"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">เบอร์โทรศัพท์ติดต่อ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="081-234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">อีเมลสำหรับรับ E-Ticket</label>
                <input
                  type="email"
                  placeholder="yourname@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-neutral-300">ช่องทางชำระเงิน</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PromptPay')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                      paymentMethod === 'PromptPay'
                        ? 'bg-red-950 border-red-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-red-400" />
                    <span>PromptPay QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CreditCard')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                      paymentMethod === 'CreditCard'
                        ? 'bg-red-950 border-red-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-red-400" />
                    <span>บัตรเครดิต</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BankTransfer')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                      paymentMethod === 'BankTransfer'
                        ? 'bg-red-950 border-red-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <Building className="w-4 h-4 text-red-400" />
                    <span>โอนเงินผ่านธนาคาร</span>
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between text-sm">
                <span className="text-neutral-400">ราคารวมทั้งสิ้น ({quantity} ใบ):</span>
                <span className="text-xl font-black text-red-400 font-mono">
                  {totalPrice === 0 ? 'ฟรี (Free Entry)' : `${totalPrice.toLocaleString()} บาท`}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 rounded-2xl text-sm shadow-xl shadow-red-950 transition-all cursor-pointer"
              >
                ยืนยันการจองบัตรและชำระเงิน
              </button>

            </form>
          </>
        ) : (
          /* Booking Success confirmation Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">BOOKING CONFIRMED</span>
              <h3 className="text-2xl font-black text-white">จองบัตรคอนเสิร์ตสำเร็จ!</h3>
              <p className="text-xs text-neutral-400">
                รหัสอ้างอิงการจองของคุณคือ <span className="text-red-400 font-mono font-bold text-sm">{bookingRef}</span>
              </p>
            </div>

            {/* QR Code Simulation Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-xs mx-auto space-y-3">
              <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-inner">
                <QrCode className="w-24 h-24 text-neutral-950" />
              </div>
              <div className="text-xs text-neutral-300 font-mono">
                <p className="font-bold text-white">{selectedShow.title}</p>
                <p className="text-[11px] text-neutral-400">{selectedShow.date} • {selectedShow.venue}</p>
                <p className="text-[11px] text-red-400 mt-1">ผู้จอง: {customerName} ({quantity} ใบ)</p>
              </div>
            </div>

            <p className="text-xs text-neutral-400 font-light">
              ระบบได้ส่ง E-Ticket และรายละเอียดเข้าชมคอนเสิร์ตไปยังเบอร์ {phone} เรียบร้อยแล้ว สามารถนำ QR Code นี้แสดงหน้างานได้ทันที
            </p>

            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง และกลับสู่หน้าหลัก
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
