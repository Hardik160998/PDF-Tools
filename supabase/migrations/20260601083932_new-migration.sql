CREATE SEQUENCE IF NOT EXISTS categories_id_seq;
CREATE TABLE public.categories (
  id integer PRIMARY KEY DEFAULT nextval('categories_id_seq'::regclass),
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'LayoutGrid'::text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

CREATE SEQUENCE IF NOT EXISTS allpdftools_id_seq;
CREATE TABLE public.allpdftools (
  id integer PRIMARY KEY DEFAULT nextval('allpdftools_id_seq'::regclass),
  tool_key text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  category_id integer NOT NULL,
  is_verified boolean NOT NULL DEFAULT true,
  category text,
  img_convert boolean DEFAULT false
);

CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  full_name text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  last_login timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  plan character varying(50) DEFAULT 'Basic Plan'::character varying,
  current_plan character varying(50) DEFAULT 'Basic Plan'::character varying,
  subscription_status character varying(20) DEFAULT 'inactive'::character varying,
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  razorpay_customer_id character varying(100),
  daily_usage_count integer DEFAULT 0,
  last_usage_reset timestamp with time zone DEFAULT now(),
  ecommerce_credits integer DEFAULT 10,
  tool_credits integer NOT NULL DEFAULT 10,
  credits_merged boolean NOT NULL DEFAULT false,
  is_guest boolean DEFAULT false,
  guest_session_id text,
  account_type character varying(20) DEFAULT 'guest'::character varying,
  remaining_credits integer DEFAULT 10,
  used_credits integer DEFAULT 0,
  is_confirmation boolean DEFAULT false,
  password character varying(255)
);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  razorpay_order_id character varying(100),
  razorpay_payment_id character varying(100),
  razorpay_signature character varying(256),
  amount numeric NOT NULL,
  currency character varying(10) DEFAULT 'INR'::character varying,
  status character varying(50) NOT NULL,
  error_code character varying(100),
  error_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  plan_id character varying(100) NOT NULL,
  razorpay_subscription_id character varying(100),
  status character varying(50) NOT NULL,
  current_start timestamp with time zone NOT NULL,
  current_end timestamp with time zone NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
