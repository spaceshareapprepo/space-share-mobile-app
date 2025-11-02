import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  decimal,
  boolean,
  jsonb,
  uuid,
  pgSchema,
  pgEnum,
} from "drizzle-orm/pg-core";
import  { sql } from "drizzle-orm";

// ============================================
// SCHEMA DEFINITION
// ============================================

const auth = pgSchema("auth");

export const authusers = auth.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull().references(() => authusers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text('username').unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name'),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  bucketAvatarUrl: text('bucket_avatar_url'),
  website: text('website'),
  emailVerified: boolean('email_verified'),
});

export const typeOfListingEnum = pgEnum('type_of_listing', ['travel', 'shipment']);

export const statusCodeEnum = pgEnum('status_code', ['0', '1']);

export const shipmentCodeEnum = pgEnum('shipment_code', ['matching', 'urgent']);

export const currencyCodeEnum = pgEnum('currency_code', ['USD', 'GHS']);

export const listings = pgTable("listings", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  origin: uuid("origin_id")
    .notNull()
    .references(() => airports.id, { onDelete: "cascade" }),
  destination: uuid("destination_id")
    .notNull()
    .references(() => airports.id, { onDelete: "cascade" }),
  flightDate: timestamp("flight_date", { withTimezone: true }).notNull(),
  maxWeightKg: integer("max_weight_kg").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(),
  currencyCode: currencyCodeEnum('currency_code').default('USD').notNull(),
  photos: jsonb("photos").$type<string[]>().default([]).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  typeOfListing: typeOfListingEnum('type_of_listing').notNull(),
  statusCode: statusCodeEnum('status_code').notNull().default('0'),
  shipmentCode: shipmentCodeEnum('shipment_code'),
});

export const threads = pgTable("threads", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
});

export const messages = pgTable("messages", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  threadId: uuid("thread_id")
    .notNull()
    .references(() => threads.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
});

export const airports = pgTable("airports", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  index: integer("index").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  iataCode: varchar("iata_code", { length: 3 }),
  icaoCode: varchar("icao_code", { length: 4 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  elevationFt: integer("elevation_ft"),
  timezoneOffset: integer("timezone_offset"),
  dst: varchar("dst", { length: 1 }),
  timezone: varchar("timezone", { length: 50 }),
  type: varchar("type", { length: 20 }),
  source: varchar("source", { length: 50 }),
});
