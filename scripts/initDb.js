require("dotenv").config();
const mongoose = require("mongoose");

// Import models so Mongoose registers them
const Trip = require("../models/Trip");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");
const Review = require("../models/Review");

async function ensureCollection(db, name) {
  const collections = await db.listCollections({ name }).toArray();
  if (collections.length === 0) {
    await db.createCollection(name);
    console.log(`Created collection: ${name}`);
  } else {
    console.log(`Collection exists: ${name}`);
  }
}

async function main() {
  const uri = process.env.DB_URI;
  if (!uri) {
    throw new Error("DB_URI is not set in .env");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;

  // Ensure collections exist
  await ensureCollection(db, "users");
  await ensureCollection(db, "trips");
  await ensureCollection(db, "hotels");
  await ensureCollection(db, "cars");
  await ensureCollection(db, "bookings");
  await ensureCollection(db, "rooms");
  await ensureCollection(db, "notifications");
  await ensureCollection(db, "payments");
  await ensureCollection(db, "reviews");

  // Sync indexes (safe to run repeatedly)
  await Promise.all([
    User.syncIndexes(),
    Trip.syncIndexes(),
    Hotel.syncIndexes(),
    Car.syncIndexes(),
    Booking.syncIndexes(),
    Room.syncIndexes(),
    Notification.syncIndexes(),
    Payment.syncIndexes(),
    Review.syncIndexes(),
  ]);
  console.log("Indexes synced");

  await mongoose.disconnect();
  console.log("Disconnected");
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (e) {}
  process.exit(1);
});
