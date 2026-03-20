"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminNavigationMenu() {
  const path = usePathname()

  const navigations = [
    {
      label: "Collector Management",
      url: "/admin/collector-management",
    },
    {
      label: "Borrower Management",
      url: "/admin/borrower-management",
    },
    {
      label: "Loan Management",
      url: "/admin/loan-management",
    },
    {
      label: "Payment Records",
      url: "/admin/payment-records",
    },
    {
      label: "Audit Trail",
      url: "/admin/audit-trail",
    },
  ]

  return (
    <section className="px-8 py-2">
      <ScrollArea className="w-full">
        <NavigationMenu>
          <NavigationMenuList className="gap-3">
            {navigations.map((nav, i) => (
              <NavigationMenuItem key={i}>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} ${path === nav.url && "bg-secondary"}`}
                  active={path === nav.url}
                >
                  <Link href={nav.url}>{nav.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
