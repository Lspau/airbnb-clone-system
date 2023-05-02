// const paypal = require('paypal-rest-sdk');
// paypal.configure({
//   mode: 'sandbox', //sandbox or live
//   client_id: 'AS4kyYtDx4gmtqeRove7jgpmzbLMPaWl0IMcSQ7OjSxGkdZQLWqkLL9hBYoXEZS8C2bDbcp8I8abcBQ-',
//   client_secret: 'EH9snA0m4nz6E7sAyBC8BF09NSCBVbvKFbCCVODnOJ_KuDmzsjhlmwwSROAmTDwxvFSPRgF7YWs0ER_a',
// });

// // API endpoint để tạo một thanh toán mới
// const create_payment_json = {
//   intent: 'sale',
//   payer: {
//     payment_method: 'paypal',
//   },
//   redirect_urls: {
//     return_url: 'http://localhost:3000/v1/payments/success',
//     cancel_url: 'http://localhost:3000/v1/payments/cancel',
//   },
//   transactions: [
//     {
//       item_list: {
//         items: [
//           {
//             name: 'Item Name',
//             sku: 'Item SKU',
//             price: '10.00',
//             currency: 'USD',
//             quantity: 1,
//           },
//         ],
//         //   params: params,
//       },
//       amount: {
//         currency: 'USD',
//         total: '10.00',
//       },
//       description: 'Payment description',
//     },
//   ],
// };

// const createPayment = paypal.payment.create(create_payment_json, (error, payment) => {
//   if (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } else {
//     for (let i = 0; i < payment.links.length; i++) {
//       if (payment.links[i].rel === 'approval_url') {
//         res.status(200).json({ approval_url: payment.links[i].href });
//       }
//     }
//   }
// });

// // API endpoint để xử lý khi thanh toán thành công

// const execute_payment_json = {
//   payer_id: payerId,
//   transactions: [
//     {
//       amount: {
//         currency: 'USD',
//         total: '10.00',
//       },
//     },
//   ],
// };

// const execute = paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
//   if (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } else {
//     console.log(JSON.stringify(payment));
//     res.status(200).json({ success: true });
//   }
// });

// module.exports = {
//   createPayment,
//   execute,
// };
