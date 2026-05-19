-- 1. Alter the default value of subscription_status to 'inactive'
alter table public.users alter column subscription_status set default 'inactive';

-- 2. Update existing basic users who have not purchased premium to have subscription_status = 'inactive'
update public.users 
set subscription_status = 'inactive' 
where (plan = 'Basic Plan' or plan is null or plan = 'free') 
  and subscription_start_date is null;
