"use client";

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import prisma from "../../prisma/db";

interface PagenationProps {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagenation = ({ itemCount, pageSize, currentPage }: PagenationProps) => {
  const pageCount = Math.ceil(itemCount / pageSize);
  if (pageCount <= 1) return null;

  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push("?" + params.toString());
  };
  return (
    <div className="mt-4 flex flex-col gap-4 px-3">
      <div>
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => changePage(1)}
        >
          <ChevronFirst />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => changePage(currentPage + 1)}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => changePage(pageCount)}
        >
          <ChevronLast />
        </Button>
      </div>
      <div>
        <p>
          Page {currentPage}of {pageCount}
        </p>
      </div>
    </div>
  );
};

export default Pagenation;
