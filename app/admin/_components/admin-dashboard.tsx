"use client"

import Link from "next/link"
import { LogOut, Package, Sparkles, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDict } from "@/providers/lib/i18n/client"
import { signOutAction } from "@/providers/services/admin-auth/actions"
import { LanguageSwitcher } from "@/app/_components/language-switcher"
import { Logo } from "@/app/_components/logo"
import type { Product } from "@/entities/product/data/shared/types"
import type { Order } from "@/entities/order/data/shared/types"
import type { QuizStats } from "@/features/quiz/shared"
import { ProductsManager } from "./products-manager"
import { OrdersTable } from "./orders-table"
import { QuizStatsPanel } from "./quiz-stats"

export function AdminDashboard({
  products,
  orders,
  quizStats,
}: {
  products: Product[]
  orders: Order[]
  quizStats: QuizStats
}) {
  const dict = useDict()
  const newOrders = orders.filter((o) => o.status === "new").length

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-border bg-brand-green-deep/90 backdrop-blur">
        <div className="container-px flex h-16 items-center justify-between">
          <Link href="/">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut className="size-4" />
                {dict.admin.signOut}
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-px py-8">
        <h1 className="mb-6 font-serif text-3xl">{dict.admin.title}</h1>

        <Tabs defaultValue="products">
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-x-visible sm:px-0">
            <TabsList className="bg-card">
              <TabsTrigger value="products" className="gap-2">
                <Package className="size-4" />
                {dict.admin.tabsProducts}
                <Badge className="border-0 bg-accent text-[10px] text-primary">
                  {products.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingCart className="size-4" />
                {dict.admin.tabsOrders}
                {newOrders > 0 && (
                  <Badge className="border-0 bg-primary text-[10px] text-primary-foreground">
                    {newOrders}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="quiz" className="gap-2">
                <Sparkles className="size-4" />
                {dict.admin.tabsQuiz}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="mt-6">
            <ProductsManager products={products} />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <OrdersTable orders={orders} />
          </TabsContent>
          <TabsContent value="quiz" className="mt-6">
            <QuizStatsPanel stats={quizStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
