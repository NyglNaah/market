"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/app/components/Navbar";

const ProductForm = () => {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Получение списка товаров из localStorage
    const [products, setProducts] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("products")) || [];
        }
        return [];
    });

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null); 
    const [id, setId] = useState(
        products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1
    );
    const [category, setCategory] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [contactDetails, setContactDetails] = useState("");

    const handleProductNameChange = (e) => setProductName(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleSellerNameChange = (e) => setSellerName(e.target.value);
    const handleContactDetailsChange = (e) => setContactDetails(e.target.value);

    // Обработка выбора изображения с сжатием
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    // максимальный размер
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height && width > MAX_WIDTH) {
                        height = Math.round((height *= MAX_WIDTH / width));
                        width = MAX_WIDTH;
                    } else if (height > MAX_HEIGHT) {
                        width = Math.round((width *= MAX_HEIGHT / height));
                        height = MAX_HEIGHT;
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // Сжатие изображения в JPEG с качеством 0.6
                    const quality = 0.6;
                    const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
                    setImage(compressedDataUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            image &&
            productName !== "" &&
            description !== "" &&
            price !== "" &&
            category !== "" &&
            sellerName !== "" &&
            contactDetails !== ""
        ) {
            const product = {
                id,
                productName,
                description,
                price,
                image, 
                quantity: 1,
                category,
                sellerName,
                contactDetails,
            };

             fetch('http://127.0.0.1:3001/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            })
            .then(res => res.json())
            .then(newProduct => {
                setProducts(prev => [...prev, newProduct]);
            });

            setId(id + 1);

            // Очистка формы
            setProductName("");
            setDescription("");
            setPrice("");
            setImage(null);
            setCategory("");
            setSellerName("");
            setContactDetails("");
        } else {
            alert("Пожалуйста, заполните все поля и выберите изображение");
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4" style={{ width: "70%" }}>
                <h2>Добавить товар</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">Название товара:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="productName"
                        value={productName}
                        onChange={handleProductNameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Описание:</label>
                        <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Цена:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="price"
                        value={price}
                        onChange={handlePriceChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Категория:</label>
                        <select
                        className="form-control"
                        id="category"
                        value={category}
                        onChange={handleCategoryChange}
                        >
                            <option value="">Выберите категорию</option>
                            <option value="tools">Инструменты</option>
                            <option value="clothes">Одежда</option>
                            <option value="electronics">Техника/устройства</option>
                            <option value="furniture">Мебель</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sellerName">Имя продавца:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="sellerName"
                        value={sellerName}
                        onChange={handleSellerNameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactDetails">Контактные данные:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="contactDetails"
                        value={contactDetails}
                        onChange={handleContactDetailsChange}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="image">Изображение:</label>
                        <input
                        type="file"
                        className="form-control-file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        />
                        {image && (
                        <div style={{ marginTop: "10px" }}>
                            <img
                            src={image}
                            alt="Preview"
                            style={{ maxWidth: "200px", height: "auto" }}
                            />
                        </div>
                    )}
                    </div>
                        <button type="submit" className="btn btn-primary mt-3">
                            Принять
                        </button>
                </form>
            </div>
        </>
    );
};

export default ProductForm;