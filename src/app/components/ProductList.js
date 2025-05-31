"use client"
import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
       fetch('https://market-psi-sage.vercel.app/api/products')
         .then(res => res.json())
         .then(data => setProducts(data))
         .catch(err => console.error('Ошибка загрузки продуктов:', err));
     }, []);

    //фильтры по категориям и строке поиска
    const filteredProducts = products.filter((product) => {
        const matchesSearchQuery =
            product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearchQuery && matchesCategory;
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <>
            <Navbar />
            <div className="container  mt-4">
                <h2>Список товаров</h2>

                {/*Поисковая строка*/}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                {/*Выбор категорий*/}
                <div className="mb-3">
                    <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="All">Все категории</option>
                        <option value="tools">Инструменты</option>
                        <option value="clothes">Одежда</option>
                        <option value="electronics">Техника/устройства</option>
                        <option value="furniture">Мебель</option>
                        <option value="other">Другое</option>
                    </select>
                </div>

                {/*Список продуктов*/}
                {filteredProducts.length === 0 ? (
                    <p>Нет доступных товаров</p>
                ) : (
                    <div className="row">
                        {filteredProducts.map((product) => (
                            <div className="col-md-4" key={product.id}>
                                <div className="card mb-4">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            className="card-img-top"
                                            alt={product.productName}
                                            style={{
                                                objectFit: "contain",
                                                width: "200px",
                                                height: "200px",
                                                marginLeft: "25%"
                                            }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.productName}</h5>
                                        <p className="card-text">{product.description}</p>
                                        <p className="card-text">
                                            <strong>Цена: </strong>{product.price} руб.
                                        </p>
                                        <p className="card-text">
                                            <strong>Продавец: </strong>
                                            {product.sellerName}
                                        </p>
                                        <p className="card-text">
                                            <strong>Контакт: </strong>
                                            {product.contactDetails}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductList;