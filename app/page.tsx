import Image from "next/image"
import Header from "./_components/ui/header"
import { db } from "./_lib/prisma"
import ServiceItem from "./_components/ui/ServiceItem"
import PhoneItem from "./_components/ui/phone-item"
import BookingItem from "./_components/ui/booking-item"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Booking {
  id: string
  date: Date
  service: {
    id: string
    name: string
    price: number
    barbershop: {
      id: string
      name: string
    }
  }
}

const Home = async () => {
  const session = await getServerSession(authOptions) as Awaited<ReturnType<typeof getServerSession>> & { user?: { id: string, name: string } }
  const barbershops = await db.barbershop.findMany({
    include: {
      services: true,
    },
  })

  const bookings: Booking[] = session?.user
    ? (await db.booking.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          service: {
            include: {
              barbershop: true,
            },
          },
        },
      })).map(booking => ({
        ...booking,
        service: {
          ...booking.service,
          price: Number(booking.service.price),
        },
      }))
    : []

  const confirmedBookings = bookings.filter(
    (booking) => new Date(booking.date) >= new Date(),
  )

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">
          {" "}
          Olá, {session?.user ? session.user.name : " Seja Bem-vindo"}
        </h2>

        <p className="mt-2 font-semibold">
          {" "}
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", {
              locale: ptBR,
            })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", {
              locale: ptBR,
            })}
          </span>
        </p>

        <div className="relative mt-6 h-[200px] w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/banner-01.png"
            fill
            className="rounded-lg object-cover"
            alt="Agende com os melhores profissionais"
          />
        </div>

        {confirmedBookings.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>
            <div className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={JSON.parse(JSON.stringify(booking))}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-3 mt-5 font-bold uppercase text-gray-400">
            Serviços
          </h2>
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="mt-5 space-y-5">
              {barbershop.services.map((service) => (
                <ServiceItem 
                  key={service.id}
                  service={JSON.parse(JSON.stringify(service))}
                  barbershop={JSON.parse(JSON.stringify(barbershop))}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-5 font-bold">
        {barbershops.map((barbershop) =>
          barbershop.phones
            .split(",")
            .map((phone) => (
              <PhoneItem key={phone.trim()} phone={phone.trim()} />
            )),
        )}
      </div>
    </div>
  )
}

export default Home