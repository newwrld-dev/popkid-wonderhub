
REVOKE EXECUTE ON FUNCTION public.award_chat_credit(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.request_withdrawal(integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_chat_credit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(integer, text) TO authenticated;
