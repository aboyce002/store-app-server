const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

/*
  SELECT id, 
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
  	FROM public.product;
*/