# Ticketing System Design Doc (sample)

## Overview

The ticketing system sells seats for concerts. Fans browse events and buy tickets in the mobile app. Venue staff publish events and seat maps in an admin console. Payments go through an external payment provider, and tickets are sent by an external email service.

Peak load is about 300 seat holds per second when a popular event opens. Venue staff publish around 20 events a day.

## Components

- **Mobile app**: fans browse events, hold seats, and pay. Calls the Booking API over HTTPS.
- **Admin console**: venue staff create events and upload seat maps. Calls the Event API.
- **Booking API**: handles holds and purchases. Calls the Seat Service to hold seats and the Payment Adapter to charge.
- **Event API**: stores events and seat maps in the Events DB.
- **Seat Service**: owns seat state. Keeps holds in Redis with a 10-minute TTL and confirmed seats in the Seats DB.
- **Payment Adapter**: wraps the payment provider's charge API.
- **Notification Worker**: reads `ticket.purchased` events from the queue and asks the email service to send the ticket.

## Booking flow

1. The fan picks seats. The Booking API asks the Seat Service to hold them for 10 minutes.
2. If any seat is already held or sold, the hold fails and the app shows the seat map again.
3. The fan pays. The Booking API asks the Payment Adapter to charge the card.
4. If the charge succeeds, the Booking API asks the Seat Service to confirm the seats, then publishes `ticket.purchased` to the queue.
5. If the charge fails, the Booking API releases the hold.
6. The Notification Worker picks up `ticket.purchased` and sends the ticket by email.

Holds that are not confirmed expire after 10 minutes and the seats become available again.
