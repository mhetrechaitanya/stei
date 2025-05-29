import { Suspense } from "react";
import PaymentCallbackClient from "./PaymentCallbackClient";

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCallbackClient />
    </Suspense>
  );
}