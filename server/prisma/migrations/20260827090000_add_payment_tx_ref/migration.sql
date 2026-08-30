--AlterTable
ALTER TABLE "Payment" ADD COLUMN  "txRef" TEXT;

--CreateIndex
CREATE UNIQUE INDEX "Payment_txRef_key" ON "Payment"("txRef");