/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import app from './app'
import dotenv from 'dotenv'
import dataSource from './config/typeorm.config'
import { autoCompleteSlotJob } from './jobs/auto-complete-slot.job'
import { remindSlotBookingJob } from './jobs/remind-slot-booking.job'
import cron from "node-cron";

dotenv.config()

const connectDatabase = async () => {
  try {
    await dataSource.initialize()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Error connecting to the database', error)
  }
}

connectDatabase()

// Đăng ký cron job tự động chuyển trạng thái slot mỗi 5 phút
cron.schedule("*/5 * * * *", async () => {
  await autoCompleteSlotJob();
});

// Đăng ký cron job gửi mail nhắc lịch trước 1 giờ mỗi 5 phút
cron.schedule("*/5 * * * *", async () => {
  await remindSlotBookingJob();
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
})
