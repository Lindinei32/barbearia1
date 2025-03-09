"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { Session } from "next-auth";

interface CreateBookingParams {
  userId: string;
  serviceId: string;
  date: Date;
}

export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions) as Session & {
    user: {
      id: string;
    };
  };

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await db.booking.create({
    data: { ...params, userId: user.user.id },
  });

  revalidatePath("/");
};