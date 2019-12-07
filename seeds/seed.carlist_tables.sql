BEGIN; 

TRUNCATE 
  carlist_ads, 
  carlist_users
  RESTART IDENTITY CASCADE;

INSERT INTO carlist_users (username, full_name, phone, email, password)
values
  ('Chester', 'Chester Minit','6194859384','minitman@gmail.com','$2a$12$1ZAKcK921SGK2HsmfZLMVefSVLO9RZhDJMLVGLWX9lS1ua/029Zqi'),
  ('Robyn', 'Robyn Banks','6263953849','bankonit@gmail.com','$2a$12$.Y85vMt//pKJWZK16FitnOx1gsbrI8DeegjZKZDhFKGl47Jz.ZKh6'),
  ('Lars', 'Lars Cinnie','6194935830','cinnister@gmail.com','$2a$12$1I83OD7GaD44l8YrGk25oefL0XSKB1fbUtTjN3Tgad8rB7gBPweBu'),
  ('Tequila','Tequila Mockingbird','8583941839','tmockingbird@gmail.com','$2a$12$Yp0vYCcJ0x6rIWGcoMVQgux2ynSrHc85et0bnmyTGhyE308fBy7my');

INSERT INTO carlist_ads ( id, make, model, price, car_year, mileage, photos_link, content)
VALUES
  (1, 'Alfa Romeo', '4c', 30000, 2016, 43500,'link_here',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?'),
  (2, 'BMW', 'i8', 50000, 2017, 32000,'link_here',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'),
  (3, 'Chevorlet', 'corvette', 35000, 2006, 55000,'link_here',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.');

commit;