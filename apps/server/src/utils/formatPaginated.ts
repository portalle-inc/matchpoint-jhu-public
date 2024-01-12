import { PageNumberPagination } from "prisma-extension-pagination/dist/types";

export default function formatPaginated<T extends any[]>(paginated: [T, PageNumberPagination]) {
  return { body: paginated[0], meta: paginated[1] };
}