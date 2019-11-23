BEGIN; 

TRUNCATE 
  carlist_ads, 
  carlist_users
  RESTART IDENTITY CASCADE;