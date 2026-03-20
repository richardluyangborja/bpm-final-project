"use client"

import { cn } from "@/lib/utils"
import { Spotlight } from "@/components/aceternity-ui/spotlight"
import { TextGenerateEffect } from "@/components/aceternity-ui/text-generate-effect"
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/aceternity-ui/3d-card"
import DashBoardPreview from "../public/hero-section-preview.png"
import Image from "next/image"
import LoginDialog from "./components/LoginDialog"

export default function page() {
  return (
    <div className="h-dvh w-full">
      <div className="relative flex h-full w-full overflow-hidden rounded-md bg-black/96 antialiased md:items-center md:justify-center">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-size-[40px_40px] select-none",
            "bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
          )}
        />

        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
          <h1 className="bg-opacity-50 h-39 bg-linear-to-b from-neutral-50 to-neutral-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
            Bring Clarity to <br /> Every Collection.
          </h1>
          <TextGenerateEffect
            words="Digitally record borrower payments, track loan balances and due
            installments, and maintain a transparent audit trail. "
            className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300"
          />
          <LoginDialog />
        </div>
        <div className="w-full max-sm:hidden">
          <CardContainer>
            <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/10 bg-gray-50 p-4 sm:w-120 dark:border-white/20 dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10">
              <CardItem
                as="p"
                translateZ="80"
                className="mx-auto max-w-lg text-base font-normal text-neutral-300"
              >
                With simple dashboards for collectors and administrators,
                managing field collections becomes organized, reliable, and easy
                to monitor.
              </CardItem>
              <CardItem translateZ="80" className="mt-4 w-full">
                <Image
                  src={DashBoardPreview}
                  height="1000"
                  width="1000"
                  className="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                  alt="preview"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </div>
  )
}
