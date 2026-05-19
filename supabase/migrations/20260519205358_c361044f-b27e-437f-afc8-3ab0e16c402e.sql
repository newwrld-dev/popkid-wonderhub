
-- 1. Token balance on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tokens integer NOT NULL DEFAULT 0;

-- 2. Direct messages
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dm_pair ON public.direct_messages (sender_id, recipient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_dm_recipient ON public.direct_messages (recipient_id, created_at);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own DMs"
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Auth users send DMs"
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- 3. Daily chat credits (unique per pair per day)
CREATE TABLE IF NOT EXISTS public.daily_chat_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  partner_id uuid NOT NULL,
  credit_date date NOT NULL DEFAULT CURRENT_DATE,
  tokens_awarded integer NOT NULL DEFAULT 20,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, partner_id, credit_date)
);
CREATE INDEX IF NOT EXISTS idx_credits_user_day ON public.daily_chat_credits (user_id, credit_date);

ALTER TABLE public.daily_chat_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own credits"
  ON public.daily_chat_credits FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Withdrawals
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tokens_amount integer NOT NULL,
  ksh_amount integer NOT NULL,
  phone_number text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON public.withdrawals (user_id, created_at DESC);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = user_id);

-- 5. award_chat_credit RPC
CREATE OR REPLACE FUNCTION public.award_chat_credit(_partner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _is_activated boolean;
  _today_count integer;
  _inserted_id uuid;
  _new_balance integer;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('awarded', false, 'reason', 'not_authenticated');
  END IF;
  IF _partner_id = _uid THEN
    RETURN jsonb_build_object('awarded', false, 'reason', 'self_chat');
  END IF;

  SELECT activated INTO _is_activated FROM public.profiles WHERE id = _uid;
  IF NOT COALESCE(_is_activated, false) THEN
    RETURN jsonb_build_object('awarded', false, 'reason', 'not_activated');
  END IF;

  -- Already credited today for this partner?
  IF EXISTS (
    SELECT 1 FROM public.daily_chat_credits
    WHERE user_id = _uid AND partner_id = _partner_id AND credit_date = CURRENT_DATE
  ) THEN
    RETURN jsonb_build_object('awarded', false, 'reason', 'already_credited');
  END IF;

  -- Daily cap: 4 partners
  SELECT COUNT(*) INTO _today_count FROM public.daily_chat_credits
   WHERE user_id = _uid AND credit_date = CURRENT_DATE;
  IF _today_count >= 4 THEN
    RETURN jsonb_build_object('awarded', false, 'reason', 'daily_limit');
  END IF;

  INSERT INTO public.daily_chat_credits (user_id, partner_id)
  VALUES (_uid, _partner_id)
  RETURNING id INTO _inserted_id;

  UPDATE public.profiles SET tokens = tokens + 20
   WHERE id = _uid
   RETURNING tokens INTO _new_balance;

  RETURN jsonb_build_object('awarded', true, 'tokens_added', 20, 'balance', _new_balance);
END;
$$;

-- 6. request_withdrawal RPC
CREATE OR REPLACE FUNCTION public.request_withdrawal(_tokens integer, _phone text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _balance integer;
  _ksh integer;
  _wid uuid;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF _tokens < 2000 THEN
    RAISE EXCEPTION 'Minimum withdrawal is 2000 tokens (KSh 1000)';
  END IF;
  IF _tokens % 2 <> 0 THEN
    RAISE EXCEPTION 'Token amount must be even';
  END IF;
  IF _phone IS NULL OR length(_phone) < 9 THEN
    RAISE EXCEPTION 'Invalid phone number';
  END IF;

  SELECT tokens INTO _balance FROM public.profiles WHERE id = _uid FOR UPDATE;
  IF _balance < _tokens THEN
    RAISE EXCEPTION 'Insufficient tokens (balance: %)', _balance;
  END IF;

  _ksh := _tokens / 2;  -- 2 tokens = 1 KSh

  UPDATE public.profiles SET tokens = tokens - _tokens WHERE id = _uid;

  INSERT INTO public.withdrawals (user_id, tokens_amount, ksh_amount, phone_number)
  VALUES (_uid, _tokens, _ksh, _phone)
  RETURNING id INTO _wid;

  RETURN jsonb_build_object('id', _wid, 'ksh_amount', _ksh, 'status', 'pending');
END;
$$;

-- Enable realtime on direct_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
