// // app/api/payment/create-order/route.ts
// import { NextResponse } from "next/server";
// import { Cashfree, CFEnvironment } from "cashfree-pg";

// export async function POST(req: Request) {
//   try {
//     const data = await req.json();
//     const { order_id, order_amount, customer_id, customer_phone } = data;
//     console.log("Received data:", data);
//     if (!order_id || !order_amount || !customer_id || !customer_phone) {
//       return NextResponse.json(
//         { success: false, message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Set up Cashfree client
//     const cashfree = new Cashfree(
//       CFEnvironment.SANDBOX, // or CFEnvironment.PRODUCTION
//       process.env.CASHFREE_APP_ID!,
//       process.env.CASHFREE_SECRET_KEY!
//     );

//     const payload = {
//       order_id,
//       order_amount,
//       order_currency: "INR",
//       customer_details: {
//         customer_id,
//         customer_phone,
//       },
//       order_meta: {
//         // return_url: `https://h2vgs3rg-3000.inc1.devtunnels.ms/api/payment/webhook?order_id={order_id}`,
//         notify_url: `https://h2vgs3rg-3000.inc1.devtunnels.ms/api/payment/webhook`,
//         return_url: `https://h2vgs3rg-3000.inc1.devtunnels.ms/booking/confirmation?order_id=${order_id}`,
//       },
//     };

//     // Create order using Cashfree SDK
//     const response = await cashfree.PGCreateOrder(payload);
//     console.log("Cashfree response:", response);

//     if (response.status === 200 && response.data?.payment_session_id) {
//       return NextResponse.json({
//         success: true,
//         order_id,
//         payment_session_id: response.data.payment_session_id,
//         payment_link: `https://sandbox.cashfree.com/pg/checkout?payment_session_id=${response.data.payment_session_id}`,
//         data: response.data,
//       });
//     } else {
//       return NextResponse.json(
//         { success: false, message: "Cashfree order creation failed", data: response.data },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error("[Cashfree] Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error?.response?.data?.message || error.message || "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      order_id,
      order_amount,
      customer_id,
      customer_phone,
      batchId,
      workshopId,
    } = data;

    console.log("Received data:", data);

    if (
      !order_id ||
      !order_amount ||
      !customer_id ||
      !customer_phone ||
      !batchId ||
      !workshopId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CASHFREE_APP_ID!,
      process.env.CASHFREE_SECRET_KEY!
    );

    const payload = {
      order_id,
      order_amount,
      order_currency: "INR",
      customer_details: {
        customer_id,
        customer_phone,
      },
      order_meta: {
        notify_url: `https://h2vgs3rg-3000.inc1.devtunnels.ms/api/payment/webhook`,
        return_url: `https://h2vgs3rg-3000.inc1.devtunnels.ms/booking/confirmation?order_id=${order_id}`,
      },
      order_tags: {
        batchId: String(batchId),
        workshopId: String(workshopId),
      },
    };

    const response = await cashfree.PGCreateOrder(payload);
    console.log("Cashfree response:", response);

    if (response.status === 200 && response.data?.payment_session_id) {
      return NextResponse.json({
        success: true,
        order_id,
        payment_session_id: response.data.payment_session_id,
        payment_link: `https://sandbox.cashfree.com/pg/checkout?payment_session_id=${response.data.payment_session_id}`,
        data: response.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Cashfree order creation failed",
          data: response.data,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Cashfree] Error:", error?.response?.data || error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.message ||
          error.message ||
          "Internal server error",
      },
      { status: 500 }
    );
  }
}

