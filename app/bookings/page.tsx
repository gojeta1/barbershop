import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";
import { authOptions } from "../_lib/auth";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const [confirmedBookings, finishedBookings, canceledBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        // date: {
        //   gte: new Date(),
        // },
        status: 'CONFIRMED',
      },
      include: {
        service: true,
        barbershop: true,
      },
      orderBy: {
        date: 'asc',
      },
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        // date: {
        //   lt: new Date(),
        // },
        status: 'FINISHED',
      },
      include: {
        service: true,
        barbershop: true,
      },
      orderBy: {
        date: 'desc',
      },
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        status: 'CANCELED',
      },
      include: {
        service: true,
        barbershop: true,
      },
      orderBy: {
        date: 'desc',
      },
    }),
  ]);

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold mb-6">Agendamentos</h1>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 uppercase font-bold text-sm mb-3">Confirmados</h2>

            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking as any} />
              ))}
            </div>
          </>
        )}

        {finishedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Finalizados</h2>

            <div className="flex flex-col gap-3">
              {finishedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking as any} />
              ))}
            </div>
          </>
        )}

        {canceledBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Cancelados</h2>

            <div className="flex flex-col gap-3">
              {canceledBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking as any} />
              ))}
            </div>
          </>
        )}  
      </div>
    </>
  );
};

export default BookingsPage;
