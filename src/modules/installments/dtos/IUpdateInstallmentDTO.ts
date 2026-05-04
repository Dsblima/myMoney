import { Status } from "@prisma/client";

export interface IUpdateInstallmentDTO {
  id: string;
  totalPaid?: number;
  status?: Status;
  paidAt?: Date | null;
}
