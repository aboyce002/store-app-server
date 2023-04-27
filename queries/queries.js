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
