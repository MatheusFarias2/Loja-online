import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProduct(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return product.image;
    
    try {
      setUploading(true);
      const imageRef = ref(storage, `products/${uuidv4()}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return product.image;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const imageUrl = await uploadImage();
      const productData = {
        ...product,
        image: imageUrl || product.image,
        updatedAt: new Date().toISOString()
      };

      if (id) {
        await setDoc(doc(db, "products", id), productData, { merge: true });
      } else {
        productData.createdAt = new Date().toISOString();
        await setDoc(doc(db, "products", uuidv4()), productData);
      }

      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="product-form">
      <div className="container">
        <h1>{id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Preço (R$):</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Estoque:</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Categoria:</label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Imagem:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {product.image && !imageFile && (
              <div className="current-image">
                <img src={product.image} alt="Current" width="100" />
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn-save"
            disabled={uploading}
          >
            {uploading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;