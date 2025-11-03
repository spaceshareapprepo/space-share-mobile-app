CREATE TYPE "public"."currency_code" AS ENUM('USD', 'GHS');--> statement-breakpoint
CREATE TYPE "public"."shipment_code" AS ENUM('matching', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."status_code" AS ENUM('0', '1');--> statement-breakpoint
CREATE TYPE "public"."type_of_listing" AS ENUM('travel', 'shipment');--> statement-breakpoint
CREATE TABLE "airports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"index" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"city" varchar(100),
	"country" varchar(100),
	"iata_code" varchar(3),
	"icao_code" varchar(4),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"elevation_ft" integer,
	"timezone_offset" integer,
	"dst" varchar(1),
	"timezone" varchar(50),
	"type" varchar(20),
	"source" varchar(50),
	"label" varchar(225) GENERATED ALWAYS AS (COALESCE(city, '') || ' (' || COALESCE(iata_code, '') || ' - ' || COALESCE(name, '') || ')') STORED
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"origin_id" uuid NOT NULL,
	"origin_name" text,
	"destination_id" uuid NOT NULL,
	"destination_name" text,
	"flight_date" timestamp with time zone NOT NULL,
	"max_weight_kg" numeric(10, 2),
	"max_weight_lb" numeric(10, 2),
	"price_per_unit" numeric(10, 2),
	"currency_code" "currency_code" DEFAULT 'USD',
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"type_of_listing" "type_of_listing" NOT NULL,
	"status_code" "status_code" DEFAULT '0' NOT NULL,
	"shipment_code" "shipment_code"
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"thread_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"username" text,
	"first_name" text,
	"last_name" text,
	"full_name" text,
	"email" text,
	"avatar_url" text,
	"bucket_avatar_url" text,
	"website" text,
	"email_verified" boolean,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"listing_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_origin_id_airports_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."airports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_destination_id_airports_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."airports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_buyer_id_profiles_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_seller_id_profiles_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;