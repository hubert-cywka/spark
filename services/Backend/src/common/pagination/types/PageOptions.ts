import { Order } from "@/common/pagination/types/Order";

export interface PageOptions {
    order: Order;
    take: number;
    cursor?: string | null;
}
