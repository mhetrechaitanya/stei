
// app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { cache } from "react";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook body:", body);

    const signature = request.headers.get("x-webhook-Signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    console.log("Received webhook body:", body);
    console.log("Received webhook signature:", signature);
    console.log("Received webhook timestamp:", timestamp);

    
    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }
    if (!timestamp) {
      return NextResponse.json(
        { error: "Missing timestamp" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.CASHFREE_SECRET_KEY!)
    //   .update(timestamp + body)
    //   .digest("base64");

    // if (signature !== expectedSignature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    const cashfree = new Cashfree(
      CFEnvironment.SANDBOX, // or CFEnvironment.PRODUCTION
      process.env.CASHFREE_APP_ID!,
      process.env.CASHFREE_SECRET_KEY!
    );

    console.log("Cashfree ", cashfree);
    // Verify the webhook signature using Cashfree SDK
    try{
      
      const verifysignatire =  cashfree.PGVerifyWebhookSignature(signature,body,timestamp);
      console.log("Signature verification result:", verifysignatire);

    }
    catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }


    const webhookData = JSON.parse(body);
    console.log("Webhook received:", webhookData);

    // Handle different webhook events
    switch (webhookData.type) {
      case "PAYMENT_SUCCESS_WEBHOOK":
        console.log("Payment successful:", webhookData.data);
        // Update your database here
        break;
      case "PAYMENT_FAILED_WEBHOOK":
        console.log("Payment failed:", webhookData.data);
        // Handle failed payment
        break;
      default:
        console.log("Unknown webhook type:", webhookData.type);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role key only in secure server environments
// );

// export async function POST(request: Request) {
//   try {
//     const rawBody = await request.json(); // Read raw body as string
//     const signature = request.headers.get("x-webhook-signature");
//     const timestamp = request.headers.get("x-webhook-timestamp");


//     console.log("data oiwger oweyg : ", rawBody)


//     if (!signature || !timestamp) {
//       return NextResponse.json(
//         { error: "Missing signature or timestamp" },
//         { status: 400 }
//       );
//     }

//     // Step 1: Generate expected signature using HMAC SHA256
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.CASHFREE_SECRET_KEY!)
//       .update(timestamp + rawBody)
//       .digest("base64");

//     if (signature !== expectedSignature) {
//       console.error("Signature mismatch");
//       return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//     }

//     // Step 2: Parse JSON body now that signature is verified
//     const webhook = JSON.parse(rawBody);
//     console.log("Webhook verified:", webhook);

//     const eventType = webhook?.type;
//     const paymentData = webhook?.data;

//     // Step 3: Store relevant payment info in Supabase
//     if (["PAYMENT_SUCCESS_WEBHOOK", "PAYMENT_FAILED_WEBHOOK"].includes(eventType)) {
//       const { cf_payment_id, order_id, payment_status, payment_time, payment_method, transaction_id, payment_amount } = paymentData;

//       const { error } = await supabase.from("payments").insert([
//         {
//           cf_payment_id,
//           order_id,
//           status: payment_status,
//           paid_at: payment_time,
//           method: payment_method,
//           transaction_id,
//           amount: payment_amount,
//           raw_data: paymentData, // store entire payload optionally
//           event_type: eventType
//         }
//       ]);

//       if (error) {
//         console.error("Supabase insert error:", error);
//         return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
//       }

//       console.log("Payment stored in Supabase:", cf_payment_id);
//     }

//     return NextResponse.json({ message: "Webhook processed successfully" });
//   } catch (error: any) {
//     console.error("Webhook processing error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
