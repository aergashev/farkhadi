import { getAllProducts } from "@/entities/product/data/server/store"
import { getAllOrders } from "@/entities/order/data/server/store"
import { getQuizStats } from "@/features/quiz/server/stats"
import { isAdmin } from "@/providers/services/admin-auth/server"
import { LoginForm } from "./_components/login-form"
import { AdminDashboard } from "./_components/admin-dashboard"

export const metadata = {
  title: "Boshqaruv",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <LoginForm />
  }

  const [products, orders, quizStats] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
    getQuizStats(),
  ])

  return (
    <AdminDashboard products={products} orders={orders} quizStats={quizStats} />
  )
}
