const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addProduct = (request, response) => {
  pool.query(`INSERT INTO product (title, description, image, price, quantity, condition, availability, category)
    VALUES ('Blue Dragon Sticker',
    'A sticker of a blue dragon',
    'https://i.imgur.com/2zzKLgS.jpg',
    5.0000,
    349,
    'new',
    'available',
    'stickers');`)
}

const availability = (request, response) => {
  pool.query(`SELECT id, 
    title, 
    description, 
    image, 
    price, 
    quantity, 
    condition, 
           CASE
               WHEN quantity > 0 THEN 'available'
               WHEN quantity < 1 THEN 'unavailable'
           END availability,
    category
    	FROM public.product;`)
}

const addOrder = (request, response) => {
  pool.query(`INSERT INTO order(user_id, provider, status, preorder, paid, date_created, address_id, total)
  VALUES (3, 'stripe', 'fulfilled', false, true, '2022-05-23', 2, 99.9800);`)
}

const addOrderDetails = (request, response) => {
  pool.query(`INSERT INTO order_details(order_id, product_id, product_title, price, quantity, total)
  VALUES (1, 3, 'Blue Dragon Print', 49.9900, 2, 99.9800);`)
}

const createOrder = (request, response) => {
  pool.query(`INSERT INTO order(user_id, address_id, provider, status, preorder, paid, discount, total, date_created, ship_date, order_fulfilled, shipped_by, tracking_number)
  VALUES (3, 'stripe', 'fulfilled', false, true, '2022-05-23', 2, 99.9800);`)
}

const createOrderDetails = (request, response) => {
  pool.query(`INSERT INTO order_details(price, quantity, discount, total, product_id, product_total)
  VALUES (1, 3, 'Blue Dragon Print', 49.9900, 2, 99.9800);`)
}
