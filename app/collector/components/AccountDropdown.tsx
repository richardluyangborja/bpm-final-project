"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01FreeIcons,
  Logout05FreeIcons,
  User03FreeIcons,
} from "@hugeicons/core-free-icons"
import { logoutAction } from "../actions/logout-action"

export default function AccountDropdown({ user }: { user: { name: string } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon icon={User03FreeIcons} />
          <span className="max-sm:hidden">{user.name}</span>
          <HugeiconsIcon icon={ArrowDown01FreeIcons} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => logoutAction()}
          >
            <HugeiconsIcon icon={Logout05FreeIcons} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
