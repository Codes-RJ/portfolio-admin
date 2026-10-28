-- Run this migration in Supabase Dashboard → SQL Editor to enable 1-Click Rollback in Admin Studio.

create or replace function public.list_portfolio_revisions()
returns table(revision_id bigint, replaced_at timestamptz, replaced_by uuid)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_portfolio_admin()
    and coalesce((select auth.jwt() ->> 'role') = 'service_role', false) = false
    and session_user <> 'postgres' then
    raise exception 'Administrator access required';
  end if;

  return query
  select r.revision_id, r.replaced_at, r.replaced_by
  from private.site_content_revisions r
  where r.content_id = 'portfolio'
  order by r.revision_id desc
  limit 20;
end;
$$;

revoke all on function public.list_portfolio_revisions() from public, anon;
grant execute on function public.list_portfolio_revisions() to authenticated, service_role;

create or replace function public.restore_portfolio_revision(target_revision_id bigint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_portfolio_admin()
    and coalesce((select auth.jwt() ->> 'role') = 'service_role', false) = false
    and session_user <> 'postgres' then
    raise exception 'Administrator access required';
  end if;

  return private.restore_portfolio_revision(target_revision_id);
end;
$$;

revoke all on function public.restore_portfolio_revision(bigint) from public, anon;
grant execute on function public.restore_portfolio_revision(bigint) to authenticated, service_role;
