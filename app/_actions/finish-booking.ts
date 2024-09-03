"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";

export const finishBooking = async (bookingId: string) => {
  await db.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "FINISHED",
    },
  });

  revalidatePath("/");
  revalidatePath("/bookings");
};