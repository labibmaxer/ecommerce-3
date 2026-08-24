/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import AddToWishList from '../AddToWishList';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';

const PRODUCT_IMAGES = {
  streetwear: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  accessory: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  default: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'
};

const getProductImageUrl = product => {
  const normalizedName = (product?.name || '').toLowerCase();
  const normalizedCategory = (product?.category?.name || '').toLowerCase();
  const normalizedBrand = (product?.brand?.name || '').toLowerCase();
  const text = `${normalizedName} ${normalizedCategory} ${normalizedBrand}`;

  if (product?.imageUrl && /^https?:\/\//i.test(product.imageUrl)) {
    return product.imageUrl;
  }

  if (text.includes('shoe') || text.includes('hoodie') || text.includes('street') || text.includes('jacket')) {
    return PRODUCT_IMAGES.streetwear;
  }

  if (text.includes('bag') || text.includes('watch') || text.includes('belt') || text.includes('accessory') || text.includes('sunglasses')) {
    return PRODUCT_IMAGES.accessory;
  }

  if (text.includes('phone') || text.includes('laptop') || text.includes('tablet') || text.includes('tech') || text.includes('audio') || text.includes('device')) {
    return PRODUCT_IMAGES.tech;
  }

  return PRODUCT_IMAGES.default;
};

const ProductList = props => {
  const { products, updateWishlist, authenticated } = props;

  return (
    <div className='product-list'>
      {products.map((product, index) => {
        const imageUrl = getProductImageUrl(product);

        return (
          <div key={index} className='mb-3 mb-md-0'>
            <div className='product-container group'>
              <div className='item-box'>
                <div className='add-wishlist-box'>
                  <AddToWishList
                    id={product._id}
                    liked={product?.isLiked ?? false}
                    enabled={authenticated}
                    updateWishlist={updateWishlist}
                    authenticated={authenticated}
                  />
                </div>

                <div className='item-link'>
                  <Link
                    to={`/product/${product.slug}`}
                    className='d-flex flex-column h-100 product-card-link'
                  >
                    <div className='item-image-container'>
                      <div className='item-image-box'>
                        <img
                          className='item-image product-card-image'
                          src={imageUrl}
                          alt={product.name}
                          onError={event => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </div>
                    <div className='item-body'>
                      <div className='item-details p-3'>
                        <h1 className='item-name'>{product.name}</h1>
                        {product.brand && Object.keys(product.brand).length > 0 && (
                          <p className='by'>
                            By <span>{product.brand.name}</span>
                          </p>
                        )}
                        <p className='item-desc mb-0'>{product.description}</p>
                      </div>
                    </div>
                    <div className='d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer'>
                      <p className='price mb-0'>${product.price}</p>
                      {product.totalReviews > 0 && (
                        <p className='mb-0'>
                          <span className='fs-16 fw-normal mr-1'>
                            {parseFloat(product?.averageRating).toFixed(1)}
                          </span>
                          <span
                            className={`fa fa-star ${
                              product.totalReviews !== 0 ? 'checked' : ''
                            }`}
                            style={{ color: '#fbbf24' }}
                          ></span>
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
