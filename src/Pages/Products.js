import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from './components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let q;
        if (categoryFilter === 'all') {
          q = query(collection(db, "products"));
        } else {
          q = query(
            collection(db, "products"),
            where("category", "==", categoryFilter)
          );
        }

        // Aplicar ordenação
        switch (sortOption) {
          case 'price-asc':
            q = query(q, orderBy("price", "asc"));
            break;
          case 'price-desc':
            q = query(q, orderBy("price", "desc"));
            break;
          case 'name-asc':
            q = query(q, orderBy("name", "asc"));
            break;
          case 'name-desc':
            q = query(q, orderBy("name", "desc"));
            break;
          default:
            q = query(q, orderBy("name", "asc"));
        }

        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [sortOption, categoryFilter]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase()) ||
    product.description.toLowerCase().includes(filter.toLowerCase())
  );

  // Obter categorias únicas para o filtro
  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) return <div className="loading">Carregando produtos...</div>;

  return (
    <div className="products-page">
      <div className="container">
        <h1>Nossos Produtos</h1>
        
        <div className="products-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          
          <div className="filters">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas Categorias' : cat}
                </option>
              ))}
            </select>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name-asc">Nome: A-Z</option>
              <option value="name-desc">Nome: Z-A</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
            </select>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <p>Nenhum produto encontrado com o termo "{filter}"</p>
            <button onClick={() => setFilter('')}>Limpar busca</button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;