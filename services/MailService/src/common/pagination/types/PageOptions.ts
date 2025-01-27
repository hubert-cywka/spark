import { Order } from "@/common/pagination/types/Order";

export interface PageOptions {
    order: Order;
    page: number;
    take: number;
    skip: number;
}
