/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import nodemailer from "nodemailer";

export async function sendVerifyEmail(to: string, maXacThuc: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // const verifyUrl = `https://your-fe-domain.com/verify?maXacThuc=${maXacThuc}`;
    const verifyUrl = `${process.env.FRONTEND_URL}/vi/account/set-password?maXacThuc=${maXacThuc}&email=${encodeURIComponent(to)}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Xác thực tài khoản Soccer Rental",
        // html: `<p>Vui lòng nhấn vào link sau để xác thực tài khoản:</p>
        //        <a href="${verifyUrl}">${verifyUrl}</a>`,
        html: `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px 0;">
          <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
            <div style="text-align:center;">
              <h2 style="color: #4CAF50; margin-bottom: 8px;">Soccer Rental</h2>
              <p style="color: #333; font-size: 18px; margin-bottom: 24px;">Xác thực tài khoản của bạn</p>
              <p style="color: #555; font-size: 15px; margin-bottom: 32px;">
                Cảm ơn bạn đã đăng ký! Vui lòng nhấn nút bên dưới để xác thực tài khoản.
              </p>
              <a href="${verifyUrl}" 
                 style="display:inline-block; background: #4CAF50; color: #fff; text-decoration: none; font-weight: bold; padding: 12px 32px; border-radius: 6px; font-size: 16px; box-shadow: 0 2px 6px #4caf5040;">
                Xác thực tài khoản
              </a>
              <div style="color: #888; font-size: 13px; margin-top: 32px;">
                <p style="margin: 0 0 4px 0;">Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
                <p style="margin: 0; color: #bbb;">&copy; 2025 Soccer Rental</p>
              </div>
            </div>
          </div>
        </div>
        `,
    });
}

export async function sendApproveSanBongMail(to: string, tenSan: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Sân bóng của bạn đã được duyệt",
        html: `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px 0;">
        <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
          <div style="text-align:center;">
            <h2 style="color: #4CAF50; margin-bottom: 8px;">Soccer Rental</h2>
            <p style="color: #333; font-size: 18px; margin-bottom: 24px;">Chúc mừng!</p>
            <p style="color: #555; font-size: 15px; margin-bottom: 32px;">
              Sân bóng <b>${tenSan}</b> của bạn đã được admin duyệt thành công.<br>
              Bạn có thể bắt đầu nhận đặt sân từ khách hàng ngay bây giờ.
            </p>
            <div style="color: #888; font-size: 13px; margin-top: 32px;">
              <p style="margin: 0 0 4px 0;">Nếu bạn có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ.</p>
              <p style="margin: 0; color: #bbb;">&copy; 2025 Soccer Rental</p>
            </div>
          </div>
        </div>
      </div>
      `,
    });
}

export async function sendMailRemindBooking(
    to: string,
    hoTen: string,
    tenSan: string,
    tenSanChiTiet: string,
    gioBatDau: string,
    diaChi: string,
    ngayDat: string
) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Nhắc lịch đặt sân bóng",
        html: `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px 0;">
          <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
            <div style="text-align:center;">
              <h2 style="color: #4CAF50; margin-bottom: 8px;">Soccer Rental</h2>
              <p style="color: #333; font-size: 18px; margin-bottom: 24px;">Xin chào ${hoTen},</p>
              <p style="color: #555; font-size: 15px; margin-bottom: 32px;">
                Bạn có lịch đặt sân <b>${tenSan}</b> - <b>${tenSanChiTiet}</b> vào lúc <b>${gioBatDau}</b> ngày <b>${ngayDat}</b>.<br>
                Địa chỉ: ${diaChi}<br>
                Vui lòng đến đúng giờ để đảm bảo quyền lợi của bạn.<br>
                <i>(Đây là email nhắc lịch tự động, vui lòng không trả lời email này.)</i>
              </p>
              <div style="color: #888; font-size: 13px; margin-top: 32px;">
                <p style="margin: 0 0 4px 0;">Chúc bạn có trải nghiệm vui vẻ!</p>
                <p style="margin: 0; color: #bbb;">&copy; 2025 Soccer Rental</p>
              </div>
            </div>
          </div>
        </div>
        `,
    });
}

export async function sendMailNotifyChuSan(
    to: string,
    chuSanName: string,
    tenSan: string,
    khachName: string,
    khachPhone: string,
    slotList: Array<{
        tenSanChiTiet: string;
        ngayDat: string;
        gioBatDau: string;
        gioKetThuc: string;
    }>,
    isCancel: boolean = false // thêm tham số này, mặc định là false
) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Tạo HTML cho danh sách slot
    const slotRows = slotList.map(
        (slot, idx) => `
        <tr style="background:${idx % 2 === 0 ? '#fafbfc' : '#f5f5f5'};">
            <td style="padding:10px 8px; border-bottom:1px solid #eee;">${slot.tenSanChiTiet}</td>
            <td style="padding:10px 8px; border-bottom:1px solid #eee;">${slot.ngayDat}</td>
            <td style="padding:10px 8px; border-bottom:1px solid #eee;">${slot.gioBatDau} - ${slot.gioKetThuc}</td>
        </tr>
    `
    ).join("");

    const subject = isCancel
        ? "Khách đã hủy đặt sân của bạn"
        : "Có khách vừa đặt sân của bạn";

    const introText = isCancel
        ? `Khách thuê <b>${khachName}</b> - ${khachPhone} vừa <span style="color:red;">hủy</span> các slot sau:`
        : `Khách thuê <b>${khachName}</b> - ${khachPhone} vừa đặt các slot sau:`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px 0;">
          <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
            <div style="text-align:center;">
              <h2 style="color: #4CAF50; margin-bottom: 8px;">Soccer Rental</h2>
              <p style="color: #333; font-size: 18px; margin-bottom: 8px;">Xin chào ${chuSanName},</p>
              <p style="color: #333; font-size: 16px; margin-bottom: 16px;"><b>${tenSan}</b></p>
              <p style="color: #555; font-size: 15px; margin-bottom: 24px;">
                ${introText}
              </p>
              <table style="width:100%; border-collapse:collapse; margin-bottom:24px; margin-top:18px;">
                <thead>
                  <tr style="background:#f0f0f0;">
                    <th style="padding:10px 8px; border-bottom:2px solid #4CAF50;">Sân chi tiết</th>
                    <th style="padding:10px 8px; border-bottom:2px solid #4CAF50;">Ngày</th>
                    <th style="padding:10px 8px; border-bottom:2px solid #4CAF50;">Giờ</th>
                  </tr>
                </thead>
                <tbody>
                  ${slotRows}
                </tbody>
              </table>
              <div style="color: #888; font-size: 13px; margin-top: 32px;">
                <p style="margin: 0 0 4px 0;">
                  ${
                    isCancel
                        ? "Vui lòng kiểm tra lại lịch sân của bạn."
                        : "Vui lòng chuẩn bị sân và liên hệ khách nếu cần."
                  }
                </p>
                <p style="margin: 0; color: #bbb;">&copy; 2025 Soccer Rental</p>
              </div>
            </div>
          </div>
        </div>
        `,
    });
}

export async function sendDisableSanBongMail(to: string, tenSan: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Sân bóng của bạn đã bị vô hiệu hóa",
        html: `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px 0;">
        <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
          <div style="text-align:center;">
            <h2 style="color: #4CAF50; margin-bottom: 8px;">Soccer Rental</h2>
            <p style="color: #F44336; font-size: 18px; margin-bottom: 24px;">Thông báo quan trọng</p>
            <p style="color: #555; font-size: 15px; margin-bottom: 32px;">
              Sân bóng <b>${tenSan}</b> của bạn đã bị admin vô hiệu hóa/từ chối duyệt.<br>
              Sân sẽ không hiển thị cho người dùng cho đến khi được duyệt lại.<br>
              Nếu bạn cần hỗ trợ hoặc muốn biết lý do chi tiết, vui lòng liên hệ đội ngũ quản trị Soccer Rental.
            </p>
            <div style="color: #888; font-size: 13px; margin-top: 32px;">
              <p style="margin: 0 0 4px 0;">Nếu có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ.</p>
              <p style="margin: 0; color: #bbb;">&copy; 2025 Soccer Rental</p>
            </div>
          </div>
        </div>
      </div>
      `,
    });
}
