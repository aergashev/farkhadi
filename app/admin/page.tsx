import { getAllProducts } from "@/entities/product/data/server/store"
import { getAllOrders } from "@/entities/order/data/server/store"
import { isAdmin } from "@/providers/services/admin-auth/server"
import { LoginForm } from "./_components/login-form"
import { AdminDashboard } from "./_components/admin-dashboard"

export const metadata = { title: "Boshqaruv — FarKhadi" }

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <LoginForm />
  }

  const [products, orders] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
  ])

  return <AdminDashboard products={products} orders={orders} />
}
