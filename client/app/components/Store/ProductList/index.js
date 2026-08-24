/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import AddToWishList from '../AddToWishList';

const ProductList = props => {
  const { updateWishlist, authenticated } = props;
  const products = Array.isArray(props.products) ? props.products : [];

  // Ensure UI renders even with minimal/missing product fields
  return (
    <div className='product-list'>
      {products.length === 0 && (
        <div className='text-center p-3' style={{ color: '#94a3b8' }}>
          No products available right now.
        </div>
      )}

      {products.map((product = {}, index) => {
        const id = product._id || `product-${index}`;
        const slug = product.slug || '';
        const imageSrc = product.imageUrl || '/images/placeholder-image.png';

        const averageRating = product?.averageRating || 0;
        const totalReviews = product?.totalReviews || 0;

        return (
          <div key={id} className='mb-3 mb-md-0'>
            <div className='product-container'>
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
                    to={`/product/${slug}`}
                    className='d-flex flex-column h-100'
                  >
                    <div className='item-image-container'>
                      <div className='item-image-box'>
                        <img
                          className='item-image'
                          src={imageSrc}
                          alt={product.name || 'product'}
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/placeholder-image.png';
                          }}
                        />
                      </div>
                    </div>
                    <div className='item-body'>
                      <div className='item-details p-3'>
                        <h1 className='item-name'>{product.name || 'Untitled'}</h1>
                        {product.brand && Object.keys(product.brand).length > 0 && (
                          <p className='by'>
                            By <span>{product.brand.name}</span>
                          </p>
                        )}
                        <p className='item-desc mb-0'>{product.description || ''}</p>
                      </div>
                    </div>
                    <div className='d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer'>
                      <p className='price mb-0'>${product.price || '0.00'}</p>
                      {totalReviews > 0 && (
                        <p className='mb-0'>
                          <span className='fs-16 fw-normal mr-1'>
                            {parseFloat(averageRating).toFixed(1)}
                          </span>
                          <span
                            className={`fa fa-star ${
                              totalReviews !== 0 ? 'checked' : ''
                            }`}
                            style={{ color: '#ffb302' }}
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
