import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        date: new Date().toISOString()
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="contact-page">
      <h1>Fale Conosco</h1>
      {submitted ? (
        <div className="success-message">
          <p>Sua mensagem foi enviada com sucesso!</p>
          <p>Entraremos em contato em breve.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Enviar Mensagem</button>
        </form>
      )}
      <div className="contact-info">
        <h2>Informações de Contato</h2>
        <p><strong>Email:</strong> contato@lojaonline.com</p>
        <p><strong>Telefone:</strong> (11) 99999-9999</p>
        <p><strong>Endereço:</strong> Rua Exemplo, 123 - São Paulo/SP</p>
      </div>
    </div>
  );
};

export default Contact;