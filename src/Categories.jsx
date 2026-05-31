import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', count: '1,240+ items', desc: 'Phones, laptops, cameras & more' },
  { name: 'Furniture', icon: '🪑', count: '860+ items', desc: 'Chairs, tables, shelves & beds' },
  { name: 'Books', icon: '📚', count: '2,100+ items', desc: 'Textbooks, novels, comics' },
  { name: 'Music', icon: '🎸', count: '430+ items', desc: 'Guitars, keyboards, speakers' },
  { name: 'Clothing', icon: '👗', count: '3,400+ items', desc: 'Clothes, shoes, bags' },
  { name: 'Accessories', icon: '⌚', count: '980+ items', desc: 'Watches, jewellery, eyewear' },
  { name: 'Sports', icon: '⚽', count: '560+ items', desc: 'Cycles, gym gear, bats & more' },
  { name: 'Other', icon: '📦', count: '1,900+ items', desc: 'Toys, art, collectibles & more' },
];

function Categories() {
  const navigate = useNavigate();

  return (
    <div className="categoriesPage">
      <h1 className="browseTitle">Browse by Category</h1>
      <p className="loginSub" style={{ textAlign: 'center', marginBottom: '32px' }}>
        {/* Pick a category to find exactly what you're looking for */}
      </p>
      <div className="categoriesGrid">
        {CATEGORIES.map(cat => (
          <div
            className="categoryCard"
            key={cat.name}
            onClick={() => navigate(`/Browse?category=${cat.name}`)}
          >
            <div className="categoryIcon">{cat.icon}</div>
            <h3 className="categoryName">{cat.name}</h3>
            <p className="categoryDesc">{cat.desc}</p>
            <span className="categoryCount">{cat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;